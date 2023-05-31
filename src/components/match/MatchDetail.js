import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import classes from './MatchDetail.module.css';
import { URL, convertToReadableStatus } from '../../helpers/helpers';
import People from '../../assets/matchDetail/people';
import Stadium from '../../assets/matchDetail/stadium.svg';
import Referee from '../../assets/matchDetail/referee.svg';
import Calendar from '../../assets/matchDetail/calendar.svg';
import { NavLink, Outlet } from 'react-router-dom';
import FootballContext from '../../store/football-context';
import LoadingSpinner from '../UI/LoadingSpinner';
import ErrorHandler from '../layout/ErrorHandler';
// import Stadium from '../../assets/stadium';
const MatchDetail = () => {
  const ctx = useContext(FootballContext);
  const [matchInfo, setMatchInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
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
      matchId,
    },
  } = ctx;
  const graphqlQuery = {
    query: `
    query FootballInfo($matchId:ID!){
      getFootballMatchInfo(matchId: $matchId) {
        venue
        refName
        refCountry
        spectators
        startDate
      }
    }
  `,
    variables: {
      matchId,
    },
  };
  const fetchMatchInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify(graphqlQuery),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error('Cant fetch details');
      }
      const data = await res.json();
      if (data.errors) throw new Error(data.errors.at(0).message);
      const {
        data: { getFootballMatchInfo },
      } = data;
      setMatchInfo(getFootballMatchInfo);
      setIsLoading(false);
    } catch (err) {
      setIsError(err.message);
    }
  }, []);
  useEffect(() => {
    fetchMatchInfo();
  }, [fetchMatchInfo]);
  const { spectators, refName, refCountry, venue, startDate } = matchInfo;
  return (
    <main className={classes.container}>
      {isError && <ErrorHandler message={isError} />}
      {isLoading && !isError && (
        <div className="centered">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
        <section className={classes['match-container']}>
          <span className={classes['competition-title']}>
            {competitionName}
          </span>
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
                <img src={Stadium} alt="stadium" /> {venue}
              </span>
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
                  <img src={Referee} alt="Ref" />
                  {refName}({refCountry})
                </span>
              )}
            </div>
          </main>
        </section>
      )}
      <section className={classes['details-container']}>
        <header className={classes['link-container']}>
          <NavLink
            to="summary"
            replace
            className={({ isActive }) => (isActive ? classes.active : '')}
          >
            Summary
          </NavLink>
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
              isActive ? `${classes.lineup} ${classes.active}` : classes.lineup
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
  );
};

export default MatchDetail;
