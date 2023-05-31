import StarJsx from '../../assets/star-jsx';
import dummyLogo from '../../assets/dummy-logo.png';
import cricketBat from '../../assets/cricket-bat.png';
import { competitionDateHandler } from '../../helpers/date-picker';
import { refineCricketScores } from '../../helpers/helpers';

import classes from './getCompMatches.module.css';

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
      winnerTeam,
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
          <div
            className={`${classes['first-score']} ${
              matchStatus === 'Ended' && winnerTeam !== 1 ? classes.loser : ''
            }`}
          >
            {homeScore}
          </div>
          <div
            className={`${classes['second-score']} ${
              matchStatus === 'Ended' && winnerTeam !== 2 ? classes.loser : ''
            } `}
          >
            {awayScore}
          </div>
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
            <div
              className={
                matchStatus === 'Ended' && winnerTeam !== 1 ? classes.loser : ''
              }
            >
              <img src={homeUrl} alt="Home" />
              {homeTeamName}
              {homeIsBatting && matchStatus !== 'Ended' && (
                <img src={cricketBat} className={classes.bat} alt="" />
              )}
            </div>
            <div
              className={
                matchStatus === 'Ended' && winnerTeam !== 2 ? classes.loser : ''
              }
            >
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

export const getFootballMatches = (
  matches,
  matchState,
  competitionId,
  competitionName,
  matchClickHandler,
  matchDetailHandler,
  setSummaryHandler,
  setStatsHandler,
  setLineupHandler,
  setTableHandler,
  navigate
) => {
  const matchSet = matches[matchState].map((event) => {
    const {
      matchId,
      matchStatus,
      startTime,
      awayScore,
      homeScore,
      homeTeam: { imageUrl: homeImageUrl, name: homeTeamName, id: homeTeamId },
      awayTeam: { imageUrl: awayImageUrl, name: awayTeamName, id: awayTeamId },
      winnerTeam,
    } = event;
    const homeUrl = homeImageUrl.includes(undefined) ? dummyLogo : homeImageUrl;
    const awayUrl = awayImageUrl.includes(undefined) ? dummyLogo : awayImageUrl;
    const { displayTime, displayDate } = competitionDateHandler(startTime);
    const matchDetail = {
      matchId,
      matchStatus,
      homeTeamName,
      awayTeamName,
      homeImageUrl,
      awayImageUrl,
      homeScore,
      awayScore,
      winnerTeam,
      displayTime,
      competitionName,
      competitionId,
      homeTeamId,
      awayTeamId,
    };
    return (
      <div
        className={classes['match-item']}
        key={matchId}
        onClick={matchClickHandler.bind(
          null,
          matchDetail,
          matchDetailHandler,
          setSummaryHandler,
          setStatsHandler,
          setLineupHandler,
          setTableHandler,
          navigate
        )}
      >
        <div className={classes.lhs}>
          <div className={classes['date-container']}>
            <div className={classes.date}>{displayDate}</div>
            <div className={classes.time}>
              {matchState === 'fixtures' ? displayTime : matchStatus}
            </div>
          </div>
          <div className={classes.teams}>
            <div
              className={
                matchStatus === 'FT' && winnerTeam !== 1 ? classes.loser : ''
              }
            >
              <img src={homeUrl} alt="Home" />
              {homeTeamName}
            </div>
            <div
              className={
                matchStatus === 'FT' && winnerTeam !== 2 ? classes.loser : ''
              }
            >
              <img src={awayUrl} alt="Away" />
              {awayTeamName}
            </div>
          </div>
        </div>
        <div className={classes.rhs}>
          {matchState === 'results' && (
            <div className={classes.score}>
              <div
                className={`${classes['first-score']} ${
                  matchStatus === 'FT' && winnerTeam !== 1 ? classes.loser : ''
                }`}
              >
                {homeScore}
              </div>
              <div
                className={`${classes['second-score']} ${
                  matchStatus === 'FT' && winnerTeam !== 2 ? classes.loser : ''
                } `}
              >
                {awayScore}
              </div>
            </div>
          )}
          <StarJsx />
        </div>
      </div>
    );
  });
  return matchSet;
};
export default getCompetitionMatches;
