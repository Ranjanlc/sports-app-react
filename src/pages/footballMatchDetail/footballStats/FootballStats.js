import ChartBar from '../../../components/chart/ChartBar';
import classes from './FootballStats.module.css';
import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import FootballContext from '../../../store/football-context';
import Info from '../../../assets/scoreList/info';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { URL } from '../../../helpers/helpers';
import ErrorHandler from '../../../components/error/ErrorHandler';
import useHttp from '../../../hooks/use-http';
const FootballStats = () => {
  // const [isLoading, setIsLoading] = useState(false);
  // const [isError, setIsError] = useState(null);
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
    setFootballDetailHandler,
  } = ctx;
  const graphqlQuery = {
    query: `
    query FootballStats($matchId:ID!){
      getFootballMatchStats(matchId:$matchId) {
        stat
        home
        away
      }
    }`,
    variables: {
      matchId,
    },
  };
  const toFetch = matchStatus !== 'NS' && statsContainer.length === 0;
  const [data, isError, isLoading] = useHttp(
    graphqlQuery,
    'getFootballMatchStats',
    toFetch
  );
  useEffect(() => {
    // To avoid mutating FootballContext while rendering of this component.
    if (data) {
      setFootballDetailHandler(data, 'stats');
    }
  }, [data, setFootballDetailHandler]);
  // if (isLoading !== loading) {
  //   setIsLoading(loading);
  // }
  // if (error) {
  //   setIsError(error);
  // }
  /*
  const fetchStatsHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify(graphqlQuery),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!res.ok || data.errors) {
        throw new Error(data.errors.at(0).message);
      }
      const {
        data: { getFootballMatchStats },
      } = data;
      setFootballDetailHandler(getFootballMatchStats, 'stats');
      setIsLoading(false);
    } catch (err) {
      setIsError(err.message);
    }
  }, []);
  useEffect(() => {
    // || to ensure that it loads for first time and persists
    matchStatus !== 'NS' && statsContainer.length === 0 && fetchStatsHandler();
  }, []);
  */
  if (matchStatus === 'NS') {
    return (
      <div className={classes.fallback}>
        <Info /> Stats will be shown once the match starts.
      </div>
    );
  }
  return (
    <Fragment>
      {isError && <ErrorHandler message={isError} />}
      {isLoading && !isError && (
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
              if (totalMaximum === 0) return <Fragment key={stat}></Fragment>;
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