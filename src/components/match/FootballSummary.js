import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import FootballContext from '../../store/football-context';
import LoadingSpinner from '../UI/LoadingSpinner';
import classes from './FootballSummary.module.css';
import FootballIncident from './FootballIncident';
import Info from '../../assets/info';
import football from '../../assets/football.png';
import missedGoal from '../../assets/football-cross.png';

const FootballSummary = (props) => {
  const URL = 'http://localhost:8080/graphql';

  const ctx = useContext(FootballContext);
  const [isLoading, setIsLoading] = useState(false);
  // const [penaltyContainer, setPenaltyContainer] = useState(null);
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
    setSummaryHandler,
  } = ctx;
  const graphqlQuery = {
    query: `
    {
      getFootballMatchSummary(matchId: ${matchId}) {
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
  };
  const fetchMatchSummary = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify(graphqlQuery),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const {
      data: { getFootballMatchSummary },
    } = await res.json();
    console.log(getFootballMatchSummary);
    setSummaryHandler(getFootballMatchSummary);
    setIsLoading(false);
  }, []);
  useEffect(() => {
    matchStatus !== 'NS' &&
      firstHalfIncidents.length === 0 &&
      fetchMatchSummary();
  }, [fetchMatchSummary]);
  if (matchStatus === 'NS') {
    return (
      <div className={classes.fallback}>
        <Info /> Key events will be shown once the match starts.
      </div>
    );
  }
  const firstHalfEl = firstHalfIncidents.map((incidentSet, i) => {
    return <FootballIncident incidentSet={incidentSet} key={i} />;
  });
  const secondHalfEl = secondHalfIncidents.map((incidentSet, i) => (
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
      } = homeTeam;
      const {
        incident: awayIncident,
        playerName: awayPlayer,
        score: awayScore,
      } = awayTeam;
      const el = (
        <main key={i} className={classes['penalty-card']}>
          <div className={classes.home}>
            <img src={homeImageUrl} className={classes.logo} />
            <div className={classes['player-container']}>
              <span className={classes.player}>{homePlayer}</span>
              <span className={classes.score}>{homeScore.join('-')}</span>
            </div>
            <span>{classifyPen(homeIncident)}</span>
          </div>
          <div className={classes.away}>
            <span>{classifyPen(awayIncident)}</span>
            <div className={classes['player-container']}>
              <span className={`${classes.player} ${classes['away-player']}`}>
                {awayPlayer}
              </span>
              <span className={classes.score}>{awayScore.join('-')}</span>
            </div>
            <img src={awayImageUrl} alt="Away Image" className={classes.logo} />
          </div>
        </main>
      );
      penaltyEl.push(el);
    }
  }
  return (
    <Fragment>
      {isLoading && (
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
          {secondHalfEl}
          <div className={`${classes.card} ${classes.time} ${classes.full}`}>
            <span className={classes.minute}>FT</span>
            {homeFTScore}-{awayFTScore}
          </div>
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
