import { Fragment, useContext } from 'react';
import classes from './FeaturedMatch.module.css';
import { convertDateForDisplay } from '../../helpers/date-picker';
import FootballContext from '../../store/football-context';
import { useNavigate } from 'react-router-dom';
import { matchClickHandler } from '../../helpers/helpers';
const FeaturedMatch = (props) => {
  const { featuredMatchContainer, sportName } = props;
  const {
    matchDetailHandler,
    setStatsHandler,
    setSummaryHandler,
    setLineupHandler,
    setTableHandler,
  } = useContext(FootballContext);
  const navigate = useNavigate();
  const {
    event: {
      matchId,
      matchStatus,
      homeTeam: { name: homeTeamName, imageUrl: homeImageUrl, id: homeTeamId },
      awayTeam: { name: awayTeamName, imageUrl: awayImageUrl, id: awayTeamId },
      homeScore,
      awayScore,
      winnerTeam,
      startTime,
    },
    competitionId,
    competitionName,
  } = featuredMatchContainer;
  //   TODO:Handle the case when test scores are shown in the featured match
  const { displayTime } = convertDateForDisplay(startTime, sportName);
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
    <Fragment>
      <span className={classes['featured-title']}>Featured Match</span>
      <div
        className={classes['featured-match']}
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
        <div className={classes['featured-lhs']}>
          {homeTeamName.split(' ').at(0)}
          <img src={homeImageUrl} alt="dasd" />
        </div>
        <div
          className={
            sportName === 'cricket'
              ? classes['cricket-score']
              : classes['featured-score']
          }
        >
          {matchStatus === 'NS' || matchStatus === 'Not started' ? (
            <Fragment>{displayTime}</Fragment>
          ) : (
            <Fragment>
              <span
                className={
                  (matchStatus === 'Ended' || matchStatus === 'FT') &&
                  winnerTeam !== 1
                    ? classes.loser
                    : ''
                }
              >
                {homeScore}
              </span>
              <span
                className={
                  matchStatus === 'Ended' || matchStatus === 'FT'
                    ? classes.loser
                    : ''
                }
              >
                -
              </span>
              <span
                className={
                  (matchStatus === 'Ended' || matchStatus === 'FT') &&
                  winnerTeam !== 2
                    ? classes.loser
                    : ''
                }
              >
                {awayScore}
              </span>
            </Fragment>
          )}
        </div>
        <div className={classes['featured-rhs']}>
          {awayTeamName.split(' ').at(0)}
          <img src={awayImageUrl} alt="" />
        </div>
      </div>
    </Fragment>
  );
};

export default FeaturedMatch;
