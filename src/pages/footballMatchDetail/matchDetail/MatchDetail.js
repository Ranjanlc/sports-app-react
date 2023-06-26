import { Fragment, useContext, useState } from 'react';
import classes from './MatchDetail.module.css';
import { convertToReadableStatus } from '../../../helpers/helpers';
import People from '../../../assets/matchDetail/people';
import Stadium from '../../../assets/matchDetail/stadium.svg';
import Referee from '../../../assets/matchDetail/referee.svg';
import Calendar from '../../../assets/matchDetail/calendar.svg';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import MatchContext from '../../../store/match-context';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ErrorHandler from '../../../components/error/ErrorHandler';
import useHttp from '../../../hooks/use-http';
import Image from '../../../components/ui/Image';
// import Stadium from '../../assets/stadium';
const MatchDetail = () => {
  const [matchInfo, setMatchInfo] = useState({});
  // const [isLoading, setIsLoading] = useState(false);
  // const [isError, setIsError] = useState(null);
  const navigate = useNavigate();
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
  const [data, isError, isLoading] = useHttp(
    graphqlQuery,
    'getFootballMatchInfo'
  );
  if (data && Object.values(matchInfo).length === 0) {
    setMatchInfo(data);
  }
  const backClickHandler = () => {
    navigate(-1);
  };

  const { spectators, refName, refCountry, venue, startDate } = matchInfo;
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
        {!isLoading && (
          <section className={classes['match-container']}>
            <span className={classes['competition-title']}>
              {competitionName}
            </span>
            <article className={classes['match']}>
              <div className={classes['match-lhs']}>
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
                          matchStatus === 'FT' && winnerTeam !== 1
                            ? classes.loser
                            : ''
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
                <Image src={awayImageUrl} alt="" />
              </div>
            </article>
            <main className={classes.info}>
              <div>
                <span>
                  <Image src={Calendar} alt="dcsa" />
                  {startDate}
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
                isActive
                  ? `${classes.lineup} ${classes.active}`
                  : classes.lineup
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
};

export default MatchDetail;
