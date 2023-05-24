import { Fragment, useContext } from 'react';
import classes from './MatchDetail.module.css';
import { convertToReadableStatus } from '../../helpers/helpers';
import People from '../../assets/people';
import Stadium from '../../assets/stadium.svg';
import Referee from '../../assets/referee.svg';
import Calendar from '../../assets/calendar.svg';
import { DUMMY_INFO } from '../../helpers/DUMMY';
import { NavLink, Outlet } from 'react-router-dom';
import FootballContext from '../../store/football-context';
// import Stadium from '../../assets/stadium';
const MatchDetail = () => {
  const ctx = useContext(FootballContext);
  const { matchDetail } = ctx;
  const {
    matchStatus,
    homeTeamName,
    awayTeamName,
    homeScore,
    awayScore,
    homeImageUrl,
    awayImageUrl,
    competitionName,
    displayTime,
    winnerTeam,
  } = matchDetail;
  // console.log(matchId, winnerTeam);
  const { spectators, refName, refCountry, venue, startDate } = DUMMY_INFO;
  return (
    <main className={classes.container}>
      <section className={classes['match-container']}>
        <span className={classes['competition-title']}>{competitionName}</span>
        <article className={classes['match']}>
          <div className={classes['match-lhs']}>
            {homeTeamName}
            <img src={homeImageUrl} alt="dasd" />
          </div>
          <main className={classes['score-container']}>
            <div className={classes['match-score']}>
              {matchStatus === 'NS' ? (
                <Fragment>{displayTime}</Fragment>
              ) : (
                <Fragment>
                  <span
                    className={
                      matchStatus === 'FT' && winnerTeam !== 1
                        ? classes.loser
                        : ''
                    }
                  >
                    {homeScore}
                  </span>
                  <span className={matchStatus === 'FT' ? classes.loser : ''}>
                    -
                  </span>
                  <span
                    className={
                      matchStatus === 'FT' && winnerTeam !== 2
                        ? classes.loser
                        : ''
                    }
                  >
                    {awayScore}
                  </span>
                </Fragment>
              )}
            </div>
            <div className={classes.status}>
              {isNaN(parseInt(matchStatus))
                ? convertToReadableStatus(matchStatus)
                : matchStatus}
            </div>
          </main>

          <div className={classes['match-rhs']}>
            {awayTeamName}
            <img src={awayImageUrl} alt="" />
          </div>
        </article>
        <main className={classes.info}>
          <div>
            <span>
              <img src={Calendar} alt="dcsa" />
              {startDate}
            </span>
            <span>
              <img src={Stadium} /> {venue}
            </span>
          </div>
          <div>
            <span>
              <People />
              {spectators}
            </span>
            <span>
              <img src={Referee} alt="Ref" />
              {refName}({refCountry})
            </span>
          </div>
        </main>
      </section>
      <section className={classes['details-container']}>
        <header className={classes['link-container']}>
          <NavLink
            to="summary"
            className={({ isActive }) => (isActive ? classes.active : '')}
          >
            Summary
          </NavLink>
          <NavLink
            to="stats"
            className={({ isActive }) => (isActive ? classes.active : '')}
          >
            Stats
          </NavLink>
          <NavLink
            to="lineups"
            className={({ isActive }) => (isActive ? classes.active : '')}
          >
            Lineups
          </NavLink>
          <NavLink
            to="table"
            className={({ isActive }) => (isActive ? classes.active : '')}
          >
            Table
          </NavLink>
        </header>
        {/* <hr /> */}
        <article className={classes['details']}>
          <Outlet />
        </article>
      </section>
    </main>
  );
};

export default MatchDetail;
