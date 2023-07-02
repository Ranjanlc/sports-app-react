import dummyLogo from '../../assets/scoreList/dummy-logo.png';
import cricketBat from '../../assets/scoreList/cricket-bat.png';
import { competitionDateHandler } from '../../helpers/date-picker';
import { matchClickHandler, refineCricketScores } from '../../helpers/helpers';

import classes from './getCompMatches.module.css';
import Image from '../ui/Image';

const getScoreEl = (sportName, homeScore, awayScore) => {
  if (sportName !== 'cricket')
    return { homeScoreEl: homeScore, awayScoreEl: awayScore };
  const {
    cricketFormat,
    homeInnings,
    awayInnings,
    totalAwayScore,
    totalHomeScore,
  } = refineCricketScores(homeScore, awayScore); //object coz undefined would produce an error.
  if (cricketFormat === 'one-day') {
    return { homeScoreEl: homeScore, awayScoreEl: awayScore };
  }
  return {
    homeScoreEl: (
      <>
        <span className={classes.innings}>{homeInnings}</span>
        <span className={classes.total}>{totalHomeScore}</span>
      </>
    ),
    awayScoreEl: (
      <>
        <span className={classes.innings}>{awayInnings}</span>
        <span className={classes.total}>{totalAwayScore}</span>
      </>
    ),
  };
};

const getCompetitionMatches = (
  matches,
  sportName,
  competitionId,
  competitionName,
  matchState,
  matchDetailHandler,
  clearMatchDetailHandler,
  navigate
) => {
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
    const { homeScoreEl, awayScoreEl } = getScoreEl(
      sportName,
      homeScore,
      awayScore
    );
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
        className={`${classes['match-item']} ${
          matchStatus === 'Abandoned' || matchStatus === 'Canceled'
            ? classes.abandoned
            : ''
        }
        ${
          matchStatus.includes("'") || matchStatus.includes('quarter')
            ? classes.playing
            : ''
        }`}
        key={matchId}
        onClick={matchClickHandler.bind(
          null,
          matchDetail,
          matchDetailHandler,
          clearMatchDetailHandler,
          navigate,
          sportName
        )}
      >
        <div className={classes['date-container']}>
          <div className={classes.date}>{displayDate}</div>
          <div className={classes.time}>
            {matchState === 'fixtures' ? displayTime : matchStatus}
          </div>
        </div>
        <div className={classes.teams}>
          <div
            className={`${classes.home} ${
              (matchStatus === 'Ended' || matchStatus === 'AET') &&
              winnerTeam === 2
                ? classes.loser
                : ''
            }`}
          >
            <div
              className={
                matchStatus === 'Ended' && winnerTeam !== 1 ? classes.loser : ''
              }
            >
              <Image src={homeUrl} alt="Home" />
              {homeTeamName}
              {homeIsBatting && matchStatus !== 'Ended' && (
                <Image src={cricketBat} className={classes.bat} alt="" />
              )}
            </div>
            {matchState === 'results' && matchStatus !== 'Abandoned' && (
              <div className={classes.score}>{homeScoreEl}</div>
            )}
          </div>
          <div
            className={`${classes.away} ${
              (matchStatus === 'Ended' || matchStatus === 'AET') &&
              winnerTeam === 1
                ? classes.loser
                : ''
            }`}
          >
            <div>
              <Image src={awayUrl} alt="Away" />
              {awayTeamName}
              {awayIsBatting && matchStatus !== 'Ended' && (
                <Image src={cricketBat} className={classes.bat} alt="" />
              )}
            </div>
            {matchState === 'results' && matchStatus !== 'Abandoned' && (
              <div className={classes.score}>{awayScoreEl}</div>
            )}
          </div>
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
  matchDetailHandler,
  clearMatchDetailHandler,
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
    const { homeScoreEl, awayScoreEl } = getScoreEl(
      'football',
      homeScore,
      awayScore
    );
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
          clearMatchDetailHandler,
          navigate,
          'football'
        )}
      >
        <div className={classes['date-container']}>
          <div className={classes.date}>{displayDate}</div>
          <div className={classes.time}>
            {matchState === 'fixtures' ? displayTime : matchStatus}
          </div>
        </div>
        <div className={classes.teams}>
          <div
            className={`${classes.home} ${
              (matchStatus === 'FT' || matchStatus === 'AET') &&
              winnerTeam === 2
                ? classes.loser
                : ''
            }`}
          >
            <div>
              <Image src={homeUrl} alt="Home" />
              {homeTeamName}
            </div>
            {matchState === 'results' && (
              <div className={classes.score}>{homeScoreEl}</div>
            )}
          </div>
          <div
            className={`${classes.away} ${
              (matchStatus === 'FT' || matchStatus === 'AET') &&
              winnerTeam === 1
                ? classes.loser
                : ''
            }`}
          >
            <div>
              <Image src={awayUrl} alt="Away" />
              {awayTeamName}
            </div>
            {matchState === 'results' && (
              <div className={classes.score}>{awayScoreEl}</div>
            )}
          </div>
        </div>
      </div>
    );
  });
  return matchSet;
};
export default getCompetitionMatches;
