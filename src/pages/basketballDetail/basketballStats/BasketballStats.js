import { Fragment, useContext, useEffect } from 'react';
import classes from './BasketballStats.module.css';
import MatchContext from '../../../store/match-context';
import Image from '../../../components/ui/Image';
import ChartBar from '../../../components/chart/ChartBar';
import { checkGreaterStat } from '../../../helpers/helpers';
import useHttp from '../../../hooks/use-http';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ErrorHandler from '../../../components/error/ErrorHandler';
function BasketballStats() {
  const {
    matchDetail: {
      homeTeamName,
      awayTeamName,
      homeImageUrl,
      awayImageUrl,
      matchId,
      matchStatus,
    },
    statsContainer,
    setMatchDetailError,
    setMatchDetailHandler,
    matchDetailError: { statsError },
  } = useContext(MatchContext);
  const { otherStats, scoringStats, leadStats } = statsContainer || {};
  const graphqlQuery = {
    query: `
    query FetchBasketballStats($matchId:ID!){
      getBasketballMatchStats(matchId: $matchId) {
        otherStats {
          stat
          home
          away
        }
        scoringStats {
          stat
          home
          away
        }
        leadStats {
          stat
          home
          away
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
    !statsError &&
    !statsContainer;
  const [data, isError, isLoading] = useHttp(
    graphqlQuery,
    'getBasketballMatchStats',
    toFetch
  );
  useEffect(() => {
    data && setMatchDetailHandler(data, 'stats');
    isError && setMatchDetailError(isError, 'stats');
  }, [data, setMatchDetailError, setMatchDetailHandler, isError]);
  return (
    <>
      {statsError && <ErrorHandler message={statsError} />}
      {isLoading && !statsError && (
        <div className="centered">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && !statsError && statsContainer && (
        <main className={classes.container}>
          <header className={classes['team-container']}>
            <div className={classes.home}>
              <Image src={homeImageUrl} alt="hehe" />
              <span>{homeTeamName}</span>
            </div>
            <div className={classes.away}>
              <Image src={awayImageUrl} alt="hehe" />
              <span>{awayTeamName}</span>
            </div>
          </header>
          <article className={classes['general-container']}>
            {scoringStats?.map((statsContainer, i) => {
              const { home, away, stat } = statsContainer;
              const { homeGreater, awayGreater } = checkGreaterStat(
                home,
                away,
                'scoring'
              );
              return (
                <div className={classes['stats-container']} key={i}>
                  <span
                    className={`${classes.score} ${
                      homeGreater ? classes.greater : ''
                    }`}
                  >
                    {home}
                  </span>
                  <span className={classes.stat}>{stat}</span>
                  <span
                    className={`${classes.score} ${
                      awayGreater ? classes.greater : ''
                    }`}
                  >
                    {away}
                  </span>
                </div>
              );
            }) ?? ''}
            <div className={classes['stats-container']}></div>
          </article>
          <article className={classes['chart-container']}>
            {otherStats?.map((statsContainer, i) => {
              const { home, stat, away } = statsContainer;
              const totalMaximum = home + away;
              if (totalMaximum === 0) return <Fragment key={stat}></Fragment>;
              return (
                <ChartBar
                  key={stat}
                  homeValue={home}
                  awayValue={away}
                  maxValue={totalMaximum}
                  label={stat}
                />
              );
            }) ?? ''}
          </article>
          <article className={classes['general-container']}>
            <div className={classes['stats-container']}></div>
            {leadStats?.map((statsContainer, i) => {
              const { home, away, stat } = statsContainer;
              const { homeGreater, awayGreater } = checkGreaterStat(
                home,
                away,
                'lead'
              );
              return (
                <div className={classes['stats-container']} key={i}>
                  <span
                    className={`${classes['left-lead-score']} ${
                      homeGreater ? classes.greater : ''
                    }`}
                  >
                    {home}
                  </span>
                  <span className={classes['lead-stat']}>{stat}</span>
                  <span
                    className={`${classes['right-lead-score']} ${
                      awayGreater ? classes.greater : ''
                    }`}
                  >
                    {away}
                  </span>
                </div>
              );
            }) ?? ''}
          </article>
        </main>
      )}
    </>
  );
}

export default BasketballStats;
