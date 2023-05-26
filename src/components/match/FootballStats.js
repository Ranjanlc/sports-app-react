import ChartBar from '../UI/ChartBar';
import classes from './FootballStats.module.css';
import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import FootballContext from '../../store/football-context';
import Info from '../../assets/info';
import LoadingSpinner from '../UI/LoadingSpinner';
const FootballStats = () => {
  const URL = 'http://localhost:8080/graphql';
  const [isLoading, setIsLoading] = useState(false);
  const ctx = useContext(FootballContext);
  const {
    matchDetail: {
      matchStatus,
      homeTeamName,
      awayTeamName,
      awayImageUrl,
      homeImageUrl,
      matchId,
    },
    statsContainer,
    setStatsHandler,
  } = ctx;
  const graphqlQuery = {
    query: `
    {
      getFootballMatchStats(matchId: ${matchId}) {
        stat
        home
        away
      }
    }`,
  };
  const fetchStatsHandler = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify(graphqlQuery),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const {
      data: { getFootballMatchStats },
    } = await res.json();
    setStatsHandler(getFootballMatchStats);
    setIsLoading(false);
  }, []);
  useEffect(() => {
    if (matchStatus !== 'NS' && statsContainer.length === 0) {
      fetchStatsHandler();
    }
  }, [fetchStatsHandler]);
  if (matchStatus === 'NS') {
    return (
      <div className={classes.fallback}>
        <Info /> Stats will be shown once the match starts.
      </div>
    );
  }
  return (
    <Fragment>
      {isLoading && (
        <div className="centered">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
        <Fragment>
          <nav className={classes['team-container']}>
            <div className={classes.home}>
              <img src={homeImageUrl} alt="hehe" />
              <span>{homeTeamName}</span>
            </div>
            <div className={classes.away}>
              <img src={awayImageUrl} alt="hehe" />
              <span>{awayTeamName}</span>
            </div>
          </nav>
          <div className={classes.chart}>
            {statsContainer.map((statContainer) => {
              const { stat, home, away } = statContainer;
              const capitalizedStat =
                stat.slice(0, 1).toUpperCase() + stat.slice(1);
              const totalMaximum = home + away;
              if (totalMaximum === 0) return <Fragment></Fragment>;
              return (
                <ChartBar
                  key={stat}
                  homeValue={home}
                  awayValue={away}
                  maxValue={totalMaximum}
                  label={capitalizedStat}
                />
              );
            })}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default FootballStats;
