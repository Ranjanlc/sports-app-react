import { Fragment } from 'react';
import { convertDateForDisplay } from '../../helpers/date-picker';
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

    const getScoreEl = (homeScore, awayScore) => {
      if (sportName !== 'cricket')
        return {
          homeScoreEl: homeScore,
          awayScoreEl: awayScore,
        };
      const {
        cricketFormat,
        homeInnings,
        awayInnings,
        totalAwayScore,
        totalHomeScore,
      } = refineCricketScores(homeScore, awayScore);
      if (cricketFormat === 'one-day') {
        return { homeScoreEl: homeScore, awayScoreEl: awayScore };
      }
      if (cricketFormat === 'test') {
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
      }
    };

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
      // Noticed that in case of AET, we dont get refinedWinnerTeam
      let refinedWinnerTeam = 0;
      refinedWinnerTeam = winnerTeam;
      if (winnerTeam !== 0 && !winnerTeam) {
        // IF basketball's api sends null, it didnt calculated that of AET but in others, it means undecided
        if (sportName === 'basketball') {
          refinedWinnerTeam = +homeScore > +awayScore ? 1 : 2;
        } else {
          refinedWinnerTeam = 0;
        }
      }
      const { displayTime } =
        sportName === 'football'
          ? convertDateForDisplay(startTime, 'football')
          : convertDateForDisplay(startTime);
      const { homeScoreEl, awayScoreEl } = getScoreEl(homeScore, awayScore);

      const calculateMatchStatus = () => {
        if (sportName === 'cricket') {
          return matchStatus === 'Ended' ? note : matchStatus;
        }
        return matchStatus;
      };
      const matchDetail = {
        matchId,
        matchStatus: calculateMatchStatus(),
        homeTeamName,
        awayTeamName,
        homeImageUrl,
        awayImageUrl,
        homeScore,
        awayScore,
        winnerTeam: refinedWinnerTeam,
        displayTime,
        competitionName,
        competitionId,
        uniqueId,
        homeTeamId,
        awayTeamId,
      };
      return (
        <div
          className={`${classes['match-container']} ${
            // Three diff checks for three diff sports
            matchStatus === 'Abandoned' ||
            matchStatus === 'Canc.' ||
            matchStatus === 'Canceled'
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
          <div className={classes['match-item']}>
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
              <div className={classes.home}>
                <div
                  className={
                    (matchStatus === 'FT' || matchStatus === 'Ended') &&
                    refinedWinnerTeam === 2
                      ? classes.loser
                      : ''
                  }
                >
                  <Image src={`${homeUrl}`} alt="Home" />
                  <span>{homeTeamName}</span>
                  {homeIsBatting && matchStatus !== 'Ended' && (
                    <Image src={cricketBat} className={classes.bat} alt="" />
                  )}
                </div>
                {homeScore && (
                  <div
                    className={`${classes.score} ${
                      refinedWinnerTeam === 2 ? classes.loser : ''
                    }`}
                  >
                    {homeScoreEl}
                  </div>
                )}
              </div>
              <div className={classes.away}>
                <div
                  className={
                    matchStatus === 'FT' && refinedWinnerTeam === 1
                      ? classes.loser
                      : ''
                  }
                >
                  <Image src={`${awayUrl}`} alt="Away" />
                  <span> {awayTeamName}</span>
                  {awayIsBatting && matchStatus !== 'Ended' && (
                    <Image src={cricketBat} className={classes.bat} alt="" />
                  )}
                </div>
                {awayScore && (
                  <div
                    className={`${classes.score} ${
                      refinedWinnerTeam === 1 ? classes.loser : ''
                    }`}
                  >
                    {awayScoreEl}
                  </div>
                )}
              </div>
            </div>

            {/* {!(
                matchStatus === 'NS' ||
                matchStatus === 'Not started' ||
                matchStatus === 'Postponed'
              ) &&
                sportName !== 'cricket' && (
                  <div className={classes.score}>
                    
                    
                  </div>
                )} */}
            {/* {sportName === 'cricket' &&
                !(
                  matchStatus === 'Not Started' ||
                  matchStatus === 'Interrupted' ||
                  matchStatus === 'Abandoned'
                ) &&
                cricketScore} */}
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
