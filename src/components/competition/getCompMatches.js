import classes from './CompetitionDetail.module.css';
import StarJsx from '../../assets/star-jsx';
import dummyLogo from '../../assets/dummy-logo.png';
import cricketBat from '../../assets/cricket-bat.png';
import { competitionDateHandler } from '../../helpers/date-picker';
import { refineCricketScores } from '../../helpers/helpers';

const getCompetitionMatches = (matches, sportName, matchState) => {
  const compMatches = matches.map((event) => {
    const {
      matchId,
      matchStatus,
      startTime,
      awayScore,
      homeScore,
      homeTeam: {
        imageUrl: homeImageUrl,
        name: homeTeamName,
        isBatting: homeIsBatting,
        id: homeTeamId,
      },
      awayTeam: {
        imageUrl: awayImageUrl,
        name: awayTeamName,
        id: awayTeamId,
        isBatting: awayIsBatting,
      },
    } = event;
    const homeUrl = homeImageUrl.includes('undefined')
      ? dummyLogo
      : homeImageUrl;
    const awayUrl = awayImageUrl.includes('undefined')
      ? dummyLogo
      : awayImageUrl;
    const { displayTime, displayDate } = competitionDateHandler(startTime);
    const {
      cricketFormat,
      homeInnings,
      awayInnings,
      totalAwayScore,
      totalHomeScore,
    } =
      sportName === 'cricket' ? refineCricketScores(homeScore, awayScore) : {}; //object coz undefined would produce an error.
    const displayScore =
      sportName === 'cricket' && cricketFormat === 'test' ? (
        <div className={classes.score}>
          <div className={classes['first-score']}>
            <span className={classes.innings}>{homeInnings}</span>
            <span className={classes.total}>{totalHomeScore}</span>
          </div>
          <div className={classes['second-score']}>
            <span className={classes.innings}>{awayInnings}</span>
            <span className={classes.total}>{totalAwayScore}</span>
          </div>
        </div>
      ) : (
        // Will reach here either it is one-day-cricket or basketball
        <div className={classes.score}>
          <div className={classes['first-score']}>{homeScore}</div>
          <div className={classes['second-score']}>{awayScore}</div>
        </div>
      );
    return (
      <div className={classes['match-item']} key={matchId}>
        <div className={classes.lhs}>
          <div className={classes['date-container']}>
            <div className={classes.date}>{displayDate}</div>
            <div className={classes.time}>
              {matchState === 'fixtures' ? displayTime : matchStatus}
            </div>
          </div>
          <div className={classes.teams}>
            <div>
              <img src={homeUrl} alt="Home" />
              {homeTeamName}
              {homeIsBatting && matchStatus !== 'Ended' && (
                <img src={cricketBat} className={classes.bat} alt="" />
              )}
            </div>
            <div>
              <img src={awayUrl} alt="Away" />
              {awayTeamName}
              {awayIsBatting && matchStatus !== 'Ended' && (
                <img src={cricketBat} className={classes.bat} alt="" />
              )}
            </div>
          </div>
        </div>
        <div className={classes.rhs}>
          {matchState === 'results' && displayScore}
          <StarJsx />
        </div>
      </div>
    );
  });
  return compMatches;
};
export default getCompetitionMatches;
