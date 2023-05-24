import { Fragment } from 'react';
import classes from './FeaturedMatch.module.css';
import { convertDateForDisplay } from '../../helpers/date-picker';
const FeaturedMatch = (props) => {
  const { event, sportName } = props;
  const {
    matchId,
    matchStatus,
    homeTeam: { name: homeTeamName, imageUrl: homeImageUrl },
    awayTeam: { name: awayTeamName, imageUrl: awayImageUrl },
    homeScore,
    awayScore,
    winnerTeam,
    startTime,
  } = event;
  //   TODO:Handle the case when test scores are shown in the featured match
  const { displayTime } = convertDateForDisplay(startTime, sportName);
  return (
    <Fragment>
      <span className={classes['featured-title']}>Featured Match</span>
      <div className={classes['featured-match']}>
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
