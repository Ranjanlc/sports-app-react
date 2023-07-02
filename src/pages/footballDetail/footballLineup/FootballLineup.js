import classes from './FootballLineup.module.css';
import PlayerCircle from '../../../components/ui/PlayerCircle';
import { Fragment, useContext, useEffect } from 'react';
import MatchContext from '../../../store/match-context';
import SubOut from '../../../assets/matchDetail/sub-out';
import SubIn from '../../../assets/matchDetail/sub-in';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Info from '../../../assets/scoreList/info';
import ErrorHandler from '../../../components/error/ErrorHandler';
import useHttp from '../../../hooks/use-http';
import Image from '../../../components/ui/Image';
const FootballLineup = (props) => {
  const {
    matchDetail: {
      homeImageUrl,
      homeTeamName,
      awayTeamName,
      awayImageUrl,
      matchId,
      matchStatus,
    },
    setMatchDetailHandler,
    lineupContainer,
    setMatchDetailError,
    matchDetailError: { lineupError },
  } = useContext(MatchContext);
  const { lineups, subs } = lineupContainer;
  const graphqlQuery = {
    query: `
  query FootballLineup($matchId:ID!){
    getFootballMatchLineup(matchId:$matchId) {
      lineups {
        team
        coach
        players {
          playerId
          playerName
          playerNumber
          formatPosition
        }
      }
      subs {
        minute
        minuteExtended
        team
        subInPlayerId
        subOutPlayerId
        subInPlayerName
        subOutPlayerName
      }
    }
  }
  `,
    variables: {
      matchId,
    },
  };
  const toFetch = lineups.length === 0;
  const [data, isError, isLoading] = useHttp(
    graphqlQuery,
    'getFootballMatchLineup',
    toFetch
  );
  useEffect(() => {
    // To avoid mutating FootballContext while rendering of this component.
    data && setMatchDetailHandler(data, 'lineup');
    isError &&
      setMatchDetailError(
        'Lineups will appear once the match starts',
        'lineup'
      );
  }, [data, setMatchDetailHandler, isError, setMatchDetailError]);
  const { players: homePlayers = '', coach: homeCoach = '' } =
    lineups.find((el) => el.team === 1) || {};
  const { players: awayPlayers = '', coach: awayCoach = '' } =
    lineups.find((el) => el.team === 2) || {};
  const lineupReducer = (playerSet) => {
    const reducedLineup = playerSet.reduce((acc, curPlayer) => {
      const { playerId, playerName, playerNumber, formatPosition } = curPlayer;
      const index =
        formatPosition === 'substitutePlayer'
          ? 'subs'
          : formatPosition.slice(0, 1);
      if (acc[index]) {
        acc[index].push({ playerId, playerName, playerNumber });
      }
      if (!acc[index]) {
        acc[index] = [{ playerId, playerName, playerNumber }];
      }
      return acc;
    }, {});
    return reducedLineup;
  };
  const getLineupEl = (lineupObj, away = false) => {
    // Slicing the substitue part
    const finalLineupObj =
      matchStatus !== 'NS'
        ? Object.values(lineupObj).slice(0, -1)
        : Object.values(lineupObj);
    const lineupEl = finalLineupObj.map((positionSet, i) => {
      const playerEl = positionSet.map((playerSet) => {
        const { playerName, playerNumber, playerId } = playerSet;
        const subOut =
          subs &&
          Object.values(subs)
            ?.flat()
            ?.some((el) => el?.subOutPlayerId === playerId);
        return (
          <PlayerCircle
            playerName={playerName}
            playerNumber={playerNumber}
            away={away}
            subOut={subOut}
            key={playerNumber}
          />
        );
      });
      return (
        <div
          className={` ${classes['away-position']} ${classes.position}`}
          key={i}
        >
          {playerEl}
        </div>
      );
    });
    return lineupEl;
  };
  const getIndvSubEl = (subSet, away = false) => {
    const subEl = subSet.map((el) => {
      const { playerId, playerNumber, playerName } = el;
      const isSubstituted = subs?.some((el) => el?.subInPlayerId === playerId);
      return (
        <li key={playerId}>
          <PlayerCircle onlyCircle playerNumber={playerNumber} />
          <span
            className={`${classes['sub-player']} ${away ? classes.away : ''}`}
          >
            {playerName}
            {isSubstituted && <SubIn />}
          </span>
        </li>
      );
    });
    return subEl;
  };
  const homeLineupObj = lineups.length !== 0 && lineupReducer(homePlayers);
  const awayLineupObj = lineups.length !== 0 && lineupReducer(awayPlayers);

  const homeLineupSet = getLineupEl(homeLineupObj);
  const awayLineupSet = getLineupEl(awayLineupObj, true);

  const homeSubEl =
    lineups.length !== 0 &&
    matchStatus !== 'NS' &&
    getIndvSubEl(homeLineupObj.subs);
  const awaySubEl =
    lineups.length !== 0 &&
    matchStatus !== 'NS' &&
    getIndvSubEl(awayLineupObj.subs, true);
  const subsEl =
    subs &&
    Object.values(subs)
      .flat()
      .map((subContainer) => {
        const {
          minute = '23',
          team,
          subOutPlayerName,
          subInPlayerName,
          subOutPlayerId,
          minuteExtended,
        } = subContainer;
        return (
          <li key={subOutPlayerId} className={classes['subs-list']}>
            <span className={classes.time}>
              {minute}
              {minuteExtended ? `+${minuteExtended}` : ``}'
            </span>
            <span>
              <Image
                src={team === 1 ? homeImageUrl : awayImageUrl}
                alt="team"
              />
            </span>
            <span className={classes['sub-out']}>
              <span>{subOutPlayerName}</span>
              <SubOut />
            </span>
            <span className={classes['sub-in']}>
              <SubIn /> {subInPlayerName}
            </span>
          </li>
        );
      });

  return (
    <Fragment>
      {lineupError && <ErrorHandler message={lineupError} />}
      {isLoading && !lineupError && (
        <div className="centered">
          <LoadingSpinner />
        </div>
      )}
      {/* Case where there is no predicted lineups */}
      {!isLoading && lineups[0]?.players?.length === 0 && (
        <div className={classes.predicted}>
          <Info />
          No predicted lineups yet
        </div>
      )}
      {!isLoading && !lineupError && lineups[0]?.players?.length !== 0 && (
        <article className={classes.container}>
          <main className={classes['lineup-container']}>
            {!isLoading && matchStatus === 'NS' && (
              <div className={classes.predicted}>
                <Info />
                Predicted lineups
              </div>
            )}
            <div className={classes['lineups']}>
              <div className={classes.summary}>
                <span>
                  <Image src={homeImageUrl} alt="team" />
                  {homeTeamName}
                </span>
                <span>Coach : {homeCoach}</span>
              </div>
              <section className={classes['home-lineups']}>
                {homeLineupSet}
              </section>
              <section className={classes['away-lineups']}>
                <div className={classes.summary}>
                  <span>
                    <Image src={awayImageUrl} alt="Away Team" />
                    {awayTeamName}
                  </span>
                  <span>Coach : {awayCoach}</span>
                </div>
                {awayLineupSet}
              </section>
            </div>
            {subs && (
              <main className={classes['subs-container']}>
                <span className={classes.title}>Substitutions :</span>
                <ul>{subsEl}</ul>
              </main>
            )}
            {matchStatus !== 'NS' && (
              <Fragment>
                <span className={classes.title}>Substitute Players :</span>
                <div className={classes['team-name__container']}>
                  <span>
                    <Image src={homeImageUrl} alt="Team" />
                    {homeTeamName}
                  </span>
                  <span className={classes.away}>
                    <Image src={awayImageUrl} alt="Away Team" />
                    {awayTeamName}
                  </span>
                </div>
                <main className={classes['sub__player-container']}>
                  <div className={classes['home__sub']}>{homeSubEl}</div>
                  <div className={classes['away__sub']}>{awaySubEl}</div>
                </main>
              </Fragment>
            )}
          </main>
        </article>
      )}
    </Fragment>
  );
};

export default FootballLineup;
