import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import FootballContext from '../../../store/football-context';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import classes from './FootballSummary.module.css';
import FootballIncident from './FootballIncident';
import Info from '../../../assets/scoreList/info';
import football from '../../../assets/matchDetail/football.png';
import missedGoal from '../../../assets/matchDetail/football-cross.png';
import { URL } from '../../../helpers/helpers';
import ErrorHandler from '../../../components/error/ErrorHandler';
import useHttp from '../../../hooks/use-http';

const FootballSummary = (props) => {
  // const [isLoading, setIsLoading] = useState(false);
  // const [isError, setIsError] = useState(null);
  // const [penaltyContainer, setPenaltyContainer] = useState(null);
  const ctx = useContext(FootballContext);
  const {
    matchDetail: { matchStatus, matchId, homeImageUrl, awayImageUrl },
    summaryContainer: {
      homeFTScore,
      awayHTScore,
      awayFTScore,
      homeHTScore,
      homeShootoutScore,
      awayShootoutScore,
      homeScore,
      awayScore,
      firstHalfIncidents,
      secondHalfIncidents,
      extraTimeIncidents,
      penaltyShootout: penaltyContainer,
    },
    setFootballDetailHandler,
  } = ctx;
  const graphqlQuery = {
    query: `
    query FootballSummary($matchId:ID!){
      getFootballMatchSummary(matchId:$matchId) {
        homeFTScore
        awayHTScore
        homeHTScore
        awayFTScore
        homeScore
        awayScore
        homeShootoutScore
        awayShootoutScore
        firstHalfIncidents {
          minute
          team
          score
          scorer
          assister
          incident
          playerName
          minuteExtended
          hasAssisted
        }
        secondHalfIncidents {
          minute
          team
          score
          scorer
          assister
          incident
          playerName
          minuteExtended
          hasAssisted
        }
        extraTimeIncidents {
           minute
          team
          score
          scorer
          assister
          incident
          playerName
          minuteExtended
          hasAssisted
        }
        penaltyShootout {
          team 
          playerName
          score
          incident
        }
      }
    }
    `,
    variables: {
      matchId,
    },
  };
  const toFetch = firstHalfIncidents.length === 0 && matchStatus !== 'NS';
  console.log(toFetch);
  const [data, isError, isLoading] = useHttp(
    graphqlQuery,
    'getFootballMatchSummary',
    toFetch
  );
  useEffect(() => {
    // To avoid mutating FootballContext while rendering of this component.
    if (data) {
      setFootballDetailHandler(data, 'summary');
    }
  }, [data, setFootballDetailHandler]);
  // if (isLoading !== loading) {
  //   setIsLoading(loading);
  // }
  // if (error) {
  //   setIsError(error);
  // }
  // const fetchMatchSummary = useCallback(async () => {
  //   try {
  //     setIsLoading(true);
  //     const res = await fetch(URL, {
  //       method: 'POST',
  //       body: JSON.stringify(graphqlQuery),
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });
  //     const data = await res.json();
  //     if (!res.ok || data.errors) {
  //       throw new Error(data.errors.at(0).message);
  //     }
  //     const {
  //       data: { getFootballMatchSummary },
  //     } = data;
  //     console.log(getFootballMatchSummary);
  //     setFootballDetailHandler(getFootballMatchSummary, 'summary');
  //     setIsLoading(false);
  //   } catch (err) {
  //     setIsError(err.message);
  //   }
  // }, []);
  // useEffect(() => {
  //   matchStatus !== 'NS' &&
  //     firstHalfIncidents.length === 0 &&
  //     fetchMatchSummary();
  // }, []);
  if (matchStatus === 'NS') {
    return (
      <div className={classes.fallback}>
        <Info /> Key events will be shown once the match starts.
      </div>
    );
  }
  console.log(firstHalfIncidents, extraTimeIncidents);
  const firstHalfEl = firstHalfIncidents.map((incidentSet, i) => {
    return <FootballIncident incidentSet={incidentSet} key={i} />;
  });
  const secondHalfEl = secondHalfIncidents?.map((incidentSet, i) => (
    <FootballIncident incidentSet={incidentSet} key={i} />
  ));
  const extraTimeEl =
    extraTimeIncidents &&
    extraTimeIncidents.map((incidentSet, i) => (
      <FootballIncident incidentSet={incidentSet} key={i} />
    ));
  const classifyPen = (incident) => {
    if (incident === 'shootOutPen') {
      return (
        <div className={classes['goal-icon__container']}>
          PEN
          <img src={football} alt="football" />
        </div>
      );
    }
    if (incident === 'shootOutMiss') {
      return (
        <div className={classes['goal-icon__container']}>
          PEN
          <img src={missedGoal} />
        </div>
      );
    }
  };
  const penaltyEl = [];
  if (penaltyContainer) {
    for (let i = 0; i < penaltyContainer.length; i += 2) {
      const j = i + 1;
      console.log(penaltyContainer);
      const homeTeam =
        penaltyContainer[i].team === 1
          ? penaltyContainer[i]
          : penaltyContainer[j];
      const awayTeam =
        penaltyContainer[i].team === 2
          ? penaltyContainer[i]
          : penaltyContainer[j];
      const {
        incident: homeIncident,
        playerName: homePlayer,
        score: homeScore,
      } = homeTeam || { incident: '', playerName: '', score: [] }; //To avoid errors
      const {
        incident: awayIncident,
        playerName: awayPlayer,
        score: awayScore,
      } = awayTeam || { incident: '', playerName: '', score: [] };
      const el = (
        <main key={i} className={classes['penalty-card']}>
          {!awayTeam ||
            (!homeTeam && <div className={classes.decider}>Decider:</div>)}
          {homeTeam && (
            <div className={classes.home}>
              <img src={homeImageUrl} className={classes.logo} />
              <div className={classes['player-container']}>
                <span className={classes.player}>{homePlayer}</span>
                <span className={classes.score}>{homeScore.join('-')}</span>
              </div>
              <span>{classifyPen(homeIncident)}</span>
            </div>
          )}
          {awayTeam && (
            <div className={classes.away}>
              <span>{classifyPen(awayIncident)}</span>
              <div className={classes['player-container']}>
                <span className={`${classes.player} ${classes['away-player']}`}>
                  {awayPlayer}
                </span>
                <span className={classes.score}>{awayScore.join('-')}</span>
              </div>
              <img
                src={awayImageUrl}
                alt="Away Image"
                className={classes.logo}
              />
            </div>
          )}
        </main>
      );
      penaltyEl.push(el);
    }
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
        <div className={classes.container}>
          {firstHalfEl}
          <div className={`${classes.card} ${classes.time} ${classes.half}`}>
            <span className={classes.minute}>HT</span>
            {homeHTScore}-{awayHTScore}
          </div>
          {secondHalfEl && secondHalfEl}
          {matchStatus === 'FT' && (
            <div className={`${classes.card} ${classes.time} ${classes.full}`}>
              <span className={classes.minute}>FT</span>
              {homeFTScore}-{awayFTScore}
            </div>
          )}
          {extraTimeEl && extraTimeEl}
          {homeScore && (
            <div className={`${classes.card} ${classes.time} ${classes.full}`}>
              <span className={classes.minute}>AET</span>
              {homeScore}-{awayScore}
            </div>
          )}
          {penaltyContainer && <Fragment> {penaltyEl}</Fragment>}
          {penaltyContainer && (
            <div
              className={`${classes.card} ${classes.full} ${classes.time} ${classes['penalty-score__container']}`}
            >
              <span>Penalty Shootout</span>
              <div className={classes['penalty-score']}>
                <img src={homeImageUrl} className={classes.logo} />
                {homeShootoutScore}-{awayShootoutScore}
                <img src={awayImageUrl} className={classes.logo} />
              </div>
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default FootballSummary;
