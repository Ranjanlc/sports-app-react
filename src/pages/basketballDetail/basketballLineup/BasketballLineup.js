import { useSearchParams } from 'react-router-dom';
import MatchContext from '../../../store/match-context';
import useHttp from '../../../hooks/use-http';

import ErrorHandler from '../../../components/error/ErrorHandler';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

import classes from './BasksetballLineup.module.css';
import Image from '../../../components/ui/Image';
import { getFullPosition } from '../../../helpers/helpers';
import { useContext, useEffect } from 'react';

function BasketballLineup() {
  const [searchParams, setSearchParams] = useSearchParams();
  // Sorting and getting curLineup
  const {
    matchDetail: { matchId, matchStatus },
    lineupContainer,
    setMatchDetailHandler,
    setMatchDetailError,
    matchDetailError: { lineupError },
  } = useContext(MatchContext);
  const query = searchParams.get('team') || 'home';
  const graphqlQuery = {
    query: `
  query FetchBasketballLineup($matchId:ID!){
    getBasketballMatchLineups(matchId: $matchId) {
      home {
        player {
          id
          name
        }
        position
        isSub
        assists
        points
        rebounds
        played
      }
      away {
        player {
          id
          name
        }
        position
        isSub
        assists
        points
        rebounds
        played
      }
    }
  }    
  `,
    variables: {
      matchId,
    },
  };
  const toFetch =
    !(matchStatus === 'Not started' || matchStatus === 'Canceled') &&
    !lineupError &&
    !lineupContainer.home;
  const [data, isError, isLoading] = useHttp(
    graphqlQuery,
    'getBasketballMatchLineups',
    toFetch
  );
  useEffect(() => {
    if (data) {
      const { home, away } = data;
      const total = [...home, ...away];
      setMatchDetailHandler({ home, away, total }, 'lineup');
    }
    // !data &&
    //   setMatchDetailError('Sorry,No player data for this match', 'lineup');
    isError && setMatchDetailError(isError, 'lineup');
  }, [setMatchDetailError, setMatchDetailHandler, data, isError]);

  const curLineup = lineupContainer[query]?.sort(
    (cur, next) => next.points - cur.points
  );
  const playerListEl = curLineup?.map((playerContainer) => {
    const {
      points,
      assists,
      rebounds,
      played,
      isSub,
      position,
      player: { id, name },
    } = playerContainer;
    return (
      <tr key={id}>
        <td className={classes.player}>
          <div className={classes['player-name']}>
            <Image
              src={`https://api.sofascore.app/api/v1/player/${id}/image`}
              alt="Player"
              isPlayer={true}
            />
            <span>{name} </span>
          </div>
          {!isSub && <span className={classes.starter}>starter</span>}
        </td>
        <td className={classes.stats}>{points}</td>
        <td className={`${classes.stats} ${classes.rebound}`}>{rebounds}</td>
        <td className={classes.stats}>{assists}</td>
        <td className={classes.stats}>{played}'</td>
        <td
          data-full={getFullPosition(position)}
          className={`${classes.stats} ${classes.position}`}
        >
          {position}
        </td>
      </tr>
    );
  });
  return (
    <>
      {lineupError && <ErrorHandler message={lineupError} />}
      {isLoading && !lineupError && (
        <div className="centered">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && !lineupError && (
        <section className={classes.container}>
          <nav className={classes.nav}>
            <div
              className={query === 'home' ? classes.active : ''}
              onClick={() => {
                setSearchParams('?team=home', { replace: true });
              }}
            >
              Home
            </div>
            <div
              className={query === 'away' ? classes.active : ''}
              onClick={() => {
                setSearchParams('?team=away', { replace: true });
              }}
            >
              Away
            </div>
            <div
              className={query === 'total' ? classes.active : ''}
              onClick={() => {
                setSearchParams('?team=total', { replace: true });
              }}
            >
              Total
            </div>
          </nav>
          <table className={classes['player-container']} border={1}>
            <thead>
              <tr>
                <th className={`${classes.player} ${classes.head}`}>Player</th>
                <th className={classes.stats}>Points</th>
                <th className={classes.rebound}>Rebounds</th>
                <th className={classes.stats}>Assists</th>
                <th className={classes.stats}>Played</th>
                <th className={classes.stats}>Position</th>
              </tr>
            </thead>
            <tbody>{playerListEl}</tbody>
          </table>
        </section>
      )}
    </>
  );
}

export default BasketballLineup;
