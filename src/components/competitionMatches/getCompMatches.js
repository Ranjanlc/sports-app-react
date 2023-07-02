import dummyLogo from '../../assets/scoreList/dummy-logo.png';
import { competitionDateHandler } from '../../helpers/date-picker';
import { matchClickHandler } from '../../helpers/helpers';

import classes from './getCompMatches.module.css';
import Team from '../team/Team';

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
    const home = { homeTeamName, homeUrl, homeScore, homeIsBatting };
    const away = { awayTeamName, awayUrl, awayScore, awayIsBatting };
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
        <Team
          home={home}
          away={away}
          matchState={matchState}
          matchStatus={matchStatus}
          sportName={sportName}
          winnerTeam={winnerTeam}
        />
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
    const home = { homeUrl, homeTeamName, homeScore };
    const away = { awayUrl, awayTeamName, awayScore };
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

        <Team
          home={home}
          away={away}
          matchState={matchState}
          matchStatus={matchStatus}
          sportName="football"
          winnerTeam={winnerTeam}
        />
      </div>
    );
  });
  return matchSet;
};
export default getCompetitionMatches;
