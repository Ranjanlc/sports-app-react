import { Fragment, useContext, useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import MatchContext from '../../store/match-context';
import useHttp from '../../hooks/use-http';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { competitionDateHandler } from '../../helpers/date-picker';

import classes from './CricketMatchDetail.module.css';
import ErrorHandler from '../../components/error/ErrorHandler';
import Calendar from '../../assets/matchDetail/calendar.svg';
import Referee from '../../assets/matchDetail/referee.svg';
import Stadium from '../../assets/matchDetail/stadium.svg';
import Image from '../../components/ui/Image';
function CricketMatchDetail() {
  const [matchInfo, setMatchInfo] = useState({ homeScore: {}, awayScore: {} });
  const navigate = useNavigate();
  const {
    matchDetail: {
      matchStatus,
      homeTeamName,
      awayTeamName,
      homeImageUrl,
      awayImageUrl,
      competitionName,
      displayTime,
      winnerTeam,
      matchId,
    },
  } = useContext(MatchContext);
  // Coz we are receiving note and if we receive note that means it has prolly ended.
  const matchEnded = matchStatus.split(' ').length > 4;
  const graphqlQuery = {
    query: `
      query FetchMatchInfo($matchId:ID!){
        getCricketMatchInfo(matchId:$matchId){
          venue
          homeScore {
            overs wickets {
              inning1 
              inning2
            }
            inning1Score inning2Score
          }
          awayScore {
            overs
            wickets {
              inning1 
              inning2
            }
            inning1Score
            inning2Score
          }
          startDate
          toss
          umpires
        }
        
      }
    `,
    variables: { matchId },
  };
  const [data, isError, isLoading] = useHttp(
    graphqlQuery,
    'getCricketMatchInfo',
    true
  );
  useEffect(() => {
    data && setMatchInfo(data);
  }, [data]);
  const backClickHandler = () => {
    navigate(-1);
  };

  const {
    umpires,
    venue,
    startDate,
    toss,
    homeScore: {
      inning1Score: homeInning1,
      inning2Score: homeInning2,
      wickets: homeWickets,
      overs: homeOvers,
    },
    awayScore: {
      inning1Score: awayInning1,
      inning2Score: awayInning2,
      wickets: awayWickets,
      overs: awayOvers,
    },
  } = matchInfo;
  let awayScoreEl, homeScoreEl;
  // Notice how i subtly putted space after and thats to avoid breaking up of name like 'Nandu'=> ['N','U']
  const [umpire1, umpire2] = umpires?.split('and ') ?? [];
  const getNormalScore = (won, inning1, wickets, overs) => {
    const { inning1: wicketInning1 } = wickets;
    return (
      <span
        className={
          matchEnded && !won
            ? `${classes.loser} ${classes['score-container']}`
            : classes['score-container']
        }
      >
        <span className={classes.score}>{`${inning1}${
          wicketInning1 ? `/${wicketInning1}` : ''
        }`}</span>
        <span className={classes.over}>{overs}</span>
      </span>
    );
  };
  const getTestScore = (won, inning1, inning2, wickets, overs) => {
    const { inning1: wicketInning1, inning2: wicketInning2 } = wickets;
    return (
      <span
        className={
          matchEnded && !won
            ? `${classes.loser} ${classes['score-container']}`
            : classes['score-container']
        }
      >
        <span className={classes.score}>
          {`${inning1}${wicketInning1 ? `/${wicketInning1}` : ''}`}
        </span>
        {inning2 && (
          <span className={classes.score}>
            {`${inning2}${wicketInning2 ? `/${wicketInning2}` : ''}`}
          </span>
        )}
        <span className={classes.over}>{overs}</span>
      </span>
    );
  };
  if (!homeInning2 && !awayInning2) {
    homeScoreEl = homeInning1
      ? getNormalScore(winnerTeam === 1, homeInning1, homeWickets, homeOvers)
      : '';
    awayScoreEl = awayInning1
      ? getNormalScore(winnerTeam === 2, awayInning1, awayWickets, awayOvers)
      : '';
  }
  if (homeInning2 || awayInning2) {
    // Test
    homeScoreEl = getTestScore(
      winnerTeam === 1,
      homeInning1,
      homeInning2,
      homeWickets,
      homeOvers
    );
    awayScoreEl = getTestScore(
      winnerTeam === 2,
      awayInning1,
      awayInning2,
      awayWickets,
      awayOvers
    );
  }

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
        {!isLoading && matchInfo.startDate && (
          <section className={classes['match-container']}>
            <span className={classes['competition-title']}>
              {competitionName}
            </span>
            <article className={classes['match-article']}>
              <div className={classes['match']}>
                <div className={classes['match-lhs']}>
                  <span>{homeTeamName}</span>
                  <Image src={homeImageUrl} alt="dasd" />
                </div>
                <main className={classes['score-container']}>
                  <div className={classes['match-score']}>
                    {matchStatus === 'NS' ? (
                      <Fragment>{displayTime}</Fragment>
                    ) : (
                      <Fragment>
                        {homeScoreEl}
                        <span className={matchEnded ? classes.loser : ''}>
                          -
                        </span>
                        {awayScoreEl}
                      </Fragment>
                    )}
                  </div>
                </main>

                <div className={classes['match-rhs']}>
                  <span>{awayTeamName}</span>
                  <Image src={awayImageUrl} alt="" />
                </div>
              </div>
              <div className={classes.status}>
                {matchEnded ? matchStatus : toss}
              </div>
            </article>
            <main className={classes.info}>
              <div>
                <span>
                  <Image src={Calendar} alt="dcsa" />
                  {`${competitionDateHandler(startDate).displayDate},
                  ${competitionDateHandler(startDate).displayTime}`}
                </span>
                {venue && (
                  <span>
                    <Image src={Stadium} alt="stadium" /> {venue}
                  </span>
                )}
              </div>
              <div>
                {umpire1 && (
                  <span>
                    <Image src={Referee} alt="Ref" />
                    {umpire1}
                  </span>
                )}
                {umpire2 && (
                  <span>
                    <Image src={Referee} alt="Ref" />
                    {umpire2}
                  </span>
                )}
              </div>
            </main>
          </section>
        )}
        <section className={classes['details-container']}>
          <header className={classes['link-container']}>
            <NavLink
              to="innings"
              replace
              className={({ isActive }) => (isActive ? classes.active : '')}
            >
              Innings
            </NavLink>
            <NavLink
              to="table"
              replace
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
    </Fragment>
  );
}

export default CricketMatchDetail;
