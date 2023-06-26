import { Fragment } from 'react';
import { convertDateForDisplay } from '../../helpers/date-picker';
import favourites from '../../assets/scoreList/star.svg';
import dummyLogo from '../../assets/scoreList/dummy-logo.png';
import cricketBat from '../../assets/scoreList/cricket-bat.png';
import { refineCricketScores } from '../../helpers/helpers';
import classes from './getMatchList.module.css';
import { matchClickHandler } from '../../helpers/helpers';
import Image from '../ui/Image';

const getMatchList = (
  matches,
  sportName,
  competitionClickHandler,
  matchDetailHandler,
  clearMatchDetailHandler,
  navigate
) => {
  const matchList = matches.map((competition) => {
    const {
      competitionId,
      competitionName,
      competitionImage,
      venue,
      events,
      uniqueId,
    } = competition;
    const compDetails = {
      competitionName,
      competitionImage,
      venue,
      competitionId,
    };
    if (sportName === 'cricket') compDetails.uniqueId = uniqueId;
    const eventsList = events.map((event) => {
      const {
        matchId,
        matchStatus,
        startTime,
        awayScore,
        homeScore,
        winnerTeam,
        note,
        homeTeam: {
          imageUrl: homeImageUrl,
          name: homeTeamName,
          isBatting: homeIsBatting,
          id: homeTeamId,
        },
        awayTeam: {
          imageUrl: awayImageUrl,
          name: awayTeamName,
          isBatting: awayIsBatting,
          id: awayTeamId,
        },
      } = event;
      const homeUrl = homeImageUrl.includes(undefined)
        ? dummyLogo
        : homeImageUrl;
      const awayUrl = awayImageUrl.includes(undefined)
        ? dummyLogo
        : awayImageUrl;
      const { displayTime } =
        sportName === 'football'
          ? convertDateForDisplay(startTime, 'football')
          : convertDateForDisplay(startTime);
      // Logic to separate test scores with odi&t20i scores.
      const {
        cricketFormat,
        homeInnings,
        awayInnings,
        totalAwayScore,
        totalHomeScore,
      } =
        sportName === 'cricket'
          ? refineCricketScores(homeScore, awayScore)
          : {}; //object coz undefined would produce an error.
      const cricketScore =
        sportName === 'cricket' &&
        (cricketFormat === 'test' ? (
          <div className={classes.score}>
            <div
              className={`${classes['first-score']} ${
                matchStatus === 'Ended' && winnerTeam !== 1 ? classes.loser : ''
              }`}
            >
              <span className={classes.innings}>{homeInnings}</span>
              <span className={classes.total}>{totalHomeScore}</span>
            </div>
            <div
              className={`${classes['second-score']} ${
                matchStatus === 'Ended' && winnerTeam !== 2 ? classes.loser : ''
              } `}
            >
              <span className={classes.innings}>{awayInnings}</span>
              <span className={classes.total}>{totalAwayScore}</span>
            </div>
          </div>
        ) : (
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
        ));
      const matchDetail = {
        matchId,
        matchStatus: matchStatus !== 'Ended' ? matchStatus : note,
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
        uniqueId,
        homeTeamId,
        awayTeamId,
      };
      return (
        <div
          className={classes['match-container']}
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
          <div className={classes['match-item']}>
            <div className={classes.lhs}>
              {sportName === 'cricket' && (
                <span className={classes['time']}>{displayTime}</span>
              )}
              {sportName !== 'cricket' && (
                <span
                  className={`${classes.time} ${
                    sportName === 'basketball'
                      ? classes['basketball-time']
                      : classes.time
                  }`}
                >
                  {matchStatus === 'NS' || matchStatus === 'Not started'
                    ? displayTime
                    : matchStatus}
                </span>
              )}
              <div className={classes.teams}>
                <div
                  className={
                    (matchStatus === 'FT' || matchStatus === 'Ended') &&
                    winnerTeam !== 1
                      ? classes.loser
                      : ''
                  }
                >
                  <Image src={`${homeUrl}`} alt="Home" />
                  {homeTeamName}
                  {homeIsBatting && matchStatus !== 'Ended' && (
                    <Image src={cricketBat} className={classes.bat} alt="" />
                  )}
                </div>
                <div
                  className={
                    matchStatus === 'FT' && winnerTeam !== 2
                      ? classes.loser
                      : ''
                  }
                >
                  <Image src={`${awayUrl}`} alt="Away" />
                  {awayTeamName}
                  {awayIsBatting && matchStatus !== 'Ended' && (
                    <Image src={cricketBat} className={classes.bat} alt="" />
                  )}
                </div>
              </div>
            </div>
            <div className={classes.rhs}>
              {!(
                matchStatus === 'NS' ||
                matchStatus === 'Not started' ||
                matchStatus === 'Postponed'
              ) &&
                sportName !== 'cricket' && (
                  <div className={classes.score}>
                    <div
                      className={`${classes['first-score']} ${
                        (matchStatus === 'FT' || matchStatus === 'Ended') &&
                        winnerTeam !== 1
                          ? classes.loser
                          : ''
                      }`}
                    >
                      {homeScore}
                    </div>
                    <div
                      className={`${classes['second-score']} ${
                        (matchStatus === 'FT' || matchStatus === 'Ended') &&
                        winnerTeam !== 2
                          ? classes.loser
                          : ''
                      }`}
                    >
                      {awayScore}
                    </div>
                  </div>
                )}
              {sportName === 'cricket' &&
                !(
                  matchStatus === 'Not Started' ||
                  matchStatus === 'Interrupted' ||
                  matchStatus === 'Abandoned'
                ) &&
                cricketScore}
              <Image src={favourites} alt="star" className={classes.star} />
            </div>
          </div>
          {note && <div className={classes.note}>{note}</div>}
        </div>
      );
    });

    return (
      <Fragment
        key={`${competitionId}.${
          Math.ceil(Math.random() * 100) + Math.floor(Math.random() * 100)
        }`}
      >
        <div className={classes['title-container']}>
          <Image src={`${competitionImage}`} alt="Flag" />
          <div className={classes.title}>
            <span
              className={classes.competition}
              onClick={competitionClickHandler.bind(null, compDetails)}
            >
              {competitionName}
            </span>
            <span className={classes.country}>{venue}</span>
          </div>
        </div>
        {eventsList}
      </Fragment>
    );
  });
  return matchList;
};
export default getMatchList;
