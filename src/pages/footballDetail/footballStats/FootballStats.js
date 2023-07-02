import ChartBar from '../../../components/chart/ChartBar';
import classes from './FootballStats.module.css';
import { Fragment, useContext, useEffect } from 'react';
import MatchContext from '../../../store/match-context';
import Info from '../../../assets/scoreList/info';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ErrorHandler from '../../../components/error/ErrorHandler';
import useHttp from '../../../hooks/use-http';
import Image from '../../../components/ui/Image';
const FootballStats = () => {
  const ctx = useContext(MatchContext);
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
    setMatchDetailHandler,
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
  const toFetch = matchStatus !== 'NS' && !statsContainer;
  const [data, isError, isLoading] = useHttp(
    graphqlQuery,
    'getFootballMatchStats',
    toFetch
  );
  useEffect(() => {
    // To avoid mutating FootballContext while rendering of this component.
    if (data) {
      setMatchDetailHandler(data, 'stats');
    }
  }, [data, setMatchDetailHandler]);
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
              <Image src={homeImageUrl} alt="hehe" />
              <span>{homeTeamName}</span>
            </div>
            <div className={classes.away}>
              <Image src={awayImageUrl} alt="hehe" />
              <span>{awayTeamName}</span>
            </div>
          </nav>
          <div className={classes.chart}>
            {statsContainer?.map((statContainer) => {
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
            }) ?? ''}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default FootballStats;
