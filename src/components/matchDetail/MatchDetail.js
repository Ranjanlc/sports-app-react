import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import classes from './MatchDetail.module.css';
import People from '../../assets/matchDetail/people';

import Stadium from '../../assets/matchDetail/stadium.svg';
import Referee from '../../assets/matchDetail/referee.svg';
import Calendar from '../../assets/matchDetail/calendar.svg';
import { Fragment, useContext, useState } from 'react';
import MatchContext from '../../store/match-context';
import useHttp from '../../hooks/use-http';
import ErrorHandler from '../error/ErrorHandler';
import LoadingSpinner from '../ui/LoadingSpinner';
import { convertToReadableStatus } from '../../helpers/helpers';
import Image from '../ui/Image';
import { competitionDateHandler } from '../../helpers/date-picker';
function MatchDetail({ query, endpoint }) {
  const [matchInfo, setMatchInfo] = useState({});
  const navigate = useNavigate();
  // const { awayScore: detailedAwayScore, homeScore: detailedHomeScore } =
  //   DUMMY_INFO;
  const ctx = useContext(MatchContext);
  const {
    matchDetail: {
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
    },
  } = ctx;
  const getDetailedScores = (
    isFootball,
    detailedHomeScore,
    detailedAwayScore
  ) => {
    if (isFootball || !detailedHomeScore || !detailedAwayScore) return [];
    const homeScoreArr = Object.values(detailedHomeScore);
    const awayScoreArr = Object.values(detailedAwayScore);
    console.log(homeScoreArr);
    // Filtered to remove empty periods
    return homeScoreArr.filter(Boolean).map((homeVal, i) => {
      const awayVal = awayScoreArr[i];
      const homeWon = homeVal > awayVal;
      return (
        <li className={classes['basketball-score']} key={i}>
          <span
            className={`${classes['period-score']}
          ${!homeWon ? classes.lost : ''}
          `}
          >
            {homeVal}
          </span>
          <span className={classes['period-name']}>Period {i + 1}</span>
          <span
            className={`${classes['period-score']}
          ${homeWon ? classes.lost : ''}
          `}
          >
            {awayVal}
          </span>
        </li>
      );
    });
  };
  const isFootball = endpoint.includes('Football');
  const { homeScore: detailedHomeScore, awayScore: detailedAwayScore } =
    matchInfo;
  const scoreListContainer = getDetailedScores(
    isFootball,
    detailedHomeScore,
    detailedAwayScore
  );
  const [data, isError, isLoading] = useHttp(query, endpoint);
  if (data && Object.values(matchInfo).length === 0) {
    setMatchInfo(data);
  }
  const backClickHandler = () => {
    navigate(-1);
  };

  const { spectators, refName, refCountry, venue, startDate } = matchInfo;
  const refinedStartDate =
    !isFootball && startDate
      ? `${competitionDateHandler(startDate).displayDate},
      ${competitionDateHandler(startDate).displayTime}`
      : startDate;
  return (
    <Fragment>
      <span className={classes.arrow} onClick={backClickHandler}>
        &#8592;
      </span>

      <main className={classes.container}>
        {isError && <ErrorHandler message={isError} />}
        {isLoading && !isError && (
          <div className="centered">
            <LoadingSpinner />
          </div>
        )}
        {!isLoading && !isError && (
          <section className={classes['match-container']}>
            <span className={classes['competition-title']}>
              {competitionName}
            </span>
            <main className={classes['match-score-container']}>
              <article className={classes['match']}>
                <div className={classes.team}>
                  {homeTeamName}
                  <Image src={homeImageUrl} alt="dasd" />
                </div>
                <main className={classes['score-container']}>
                  <div className={classes['match-score']}>
                    {matchStatus === 'NS' ? (
                      <Fragment>{displayTime}</Fragment>
                    ) : (
                      <Fragment>
                        <span
                          className={
                            winnerTeam && winnerTeam !== 1 ? classes.loser : ''
                          }
                        >
                          {homeScore}
                        </span>
                        <span
                          className={matchStatus === 'FT' ? classes.loser : ''}
                        >
                          -
                        </span>
                        <span
                          className={
                            winnerTeam && winnerTeam !== 2 ? classes.loser : ''
                          }
                        >
                          {awayScore}
                        </span>
                      </Fragment>
                    )}
                  </div>
                  <div className={classes.status}>
                    {isFootball && isNaN(parseInt(matchStatus))
                      ? convertToReadableStatus(matchStatus)
                      : matchStatus}
                  </div>
                </main>

                <div className={classes.team}>
                  {awayTeamName}
                  <Image src={awayImageUrl} alt="" />
                </div>
              </article>
              {!isFootball && (
                <ul className={classes['basketball-score-container']}>
                  {scoreListContainer}
                </ul>
              )}
            </main>
            <main className={classes.info}>
              <div>
                <span>
                  <Image src={Calendar} alt="dcsa" />
                  {refinedStartDate}
                </span>
                {venue && (
                  <span>
                    <Image src={Stadium} alt="stadium" /> {venue}
                  </span>
                )}
              </div>
              <div>
                {spectators && (
                  <span>
                    <People />
                    {spectators}
                  </span>
                )}
                {refName && (
                  <span>
                    <Image src={Referee} alt="Ref" />
                    {refName}({refCountry})
                  </span>
                )}
              </div>
            </main>
          </section>
        )}
        <section className={classes['details-container']}>
          <header className={classes['link-container']}>
            {isFootball && (
              <NavLink
                to="summary"
                replace
                className={({ isActive }) => (isActive ? classes.active : '')}
              >
                Summary
              </NavLink>
            )}
            <NavLink
              to="stats"
              replace
              className={({ isActive }) => (isActive ? classes.active : '')}
            >
              Stats
            </NavLink>
            <NavLink
              to="lineups"
              replace
              className={({ isActive }) =>
                isActive
                  ? `${
                      isFootball ? classes.lineup : classes['basketball-lineup']
                    } ${classes.active}`
                  : `${
                      isFootball ? classes.lineup : classes['basketball-lineup']
                    }`
              }
            >
              Lineups
            </NavLink>
            <NavLink
              to="table"
              replace
              className={({ isActive }) =>
                isActive ? `${classes.active} ${classes.table}` : classes.table
              }
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
    </Fragment>
  );
}

export default MatchDetail;
