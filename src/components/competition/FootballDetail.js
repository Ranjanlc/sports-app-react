import classes from './FootballDetail.module.css';
import StarJsx from '../../assets/star-jsx';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import dummyLogo from '../../assets/dummy-logo.png';
import { competitionDateHandler } from '../../helpers/date-picker';
import LoadingSpinner from '../UI/LoadingSpinner';
const FootballDetail = (props) => {
  const URL = 'http://localhost:8080/graphql';
  const navigate = useNavigate();
  const { loadState } = useParams();
  const { pathname } = useLocation();
  const urlState = pathname.split('/').slice(-1).at(0);
  const [matches, setMatches] = useState(null);
  const [matchState, setMatchState] = useState(loadState);
  const [standings, setStandings] = useState();
  const [isLoading, setIsLoading] = useState(true);
  let competitionSet;
  // For the case if user reloads the page from FootballDetail page.
  if (props.competitionSet) {
    competitionSet = props.competitionSet;
    localStorage.setItem(
      'competitionSet',
      JSON.stringify(props.competitionSet)
    );
  }
  if (!props.competitionSet) {
    competitionSet = JSON.parse(localStorage.getItem('competitionSet'));
  }
  const { competitionName, venue, competitionImage, competitionId } =
    competitionSet;

  const backClickHandler = () => {
    navigate(-1);
  };
  const graphqlQuery = {
    query: `
      {
        getFootballDetails(compId:${+competitionId}) {
          matches {
            fixtures {
               matchId homeTeam {
                name imageUrl
                } awayTeam {
                  name imageUrl
                }startTime matchStatus homeScore awayScore winnerTeam 
            }
            results {
              matchId homeTeam {
                name imageUrl
              }awayTeam {
                name imageUrl
              } startTime matchStatus homeScore awayScore winnerTeam
            }
          } standings {
            position name group teamId teamImageUrl played wins draws loses GF GA GD points
            }
        }
      }`,
  };
  const fetchCompDetails = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify(graphqlQuery),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const {
      data: {
        getFootballDetails: { matches, standings },
      },
    } = await res.json();
    console.log(matches, standings);
    setMatches(matches);
    setStandings(standings);
    setIsLoading(false);
  }, []);
  useEffect(() => {
    fetchCompDetails();
  }, [fetchCompDetails]);
  const matchStateChangeHandler = (state, e) => {
    // To replace fixtures/results with results/fixtures resp.
    const baseUrl = pathname.split('/').slice(0, -1).join('/');
    if (state === 'fixtures' && urlState !== 'fixtures') {
      setMatchState('fixtures');
      navigate(`${baseUrl}/fixtures`, { replace: true });
    }
    if (state === 'results' && urlState !== 'results') {
      setMatchState('results');
      navigate(`${baseUrl}/results`, { replace: true });
    }
  };
  const events =
    matches &&
    matches[matchState].map((event) => {
      const {
        matchId,
        matchStatus,
        startTime,
        awayScore,
        homeScore,
        homeTeam: { imageUrl: homeImageUrl, name: homeTeamName },
        awayTeam: { imageUrl: awayImageUrl, name: awayTeamName },
      } = event;
      const homeUrl = homeImageUrl.includes(undefined)
        ? dummyLogo
        : homeImageUrl;
      const awayUrl = awayImageUrl.includes(undefined)
        ? dummyLogo
        : awayImageUrl;
      const { displayTime, displayDate } = competitionDateHandler(startTime);
      return (
        <div className={classes['match-item']} key={matchId}>
          <div className={classes.lhs}>
            <div className={classes['date-container']}>
              <div className={classes.date}>{displayDate}</div>
              <div className={classes.time}>
                {matchState === 'fixtures' ? displayTime : matchStatus}
              </div>
            </div>
            <div className={classes.teams}>
              <div>
                <img src={homeUrl} alt="Home" />
                {homeTeamName}
              </div>
              <div>
                <img src={awayUrl} alt="Away" />
                {awayTeamName}
              </div>
            </div>
          </div>
          <div className={classes.rhs}>
            {matchState === 'results' && (
              <div className={classes.score}>
                <div className={classes['first-score']}>{homeScore}</div>
                <div className={classes['second-score']}>{awayScore}</div>
              </div>
            )}
            <StarJsx />
          </div>
        </div>
      );
    });
  // TODO:Address the situation when there is no standings or there is a group-wise standings.
  const standingList = standings?.map((teamData) => {
    const {
      position,
      name,
      teamId,
      teamImageUrl,
      wins,
      draws,
      loses,
      played,
      GF,
      GA,
      GD,
      points,
    } = teamData;
    return (
      <article className={classes['team-data']} key={teamId}>
        <div className={classes['team-data__details']}>
          <span className={classes.position}>{position}</span>
          <span className={classes.name}>
            <img src={teamImageUrl} alt="" />
            {name}
          </span>
        </div>
        <span>{played}</span>
        <span>{wins}</span>
        <span>{draws}</span>
        <span>{loses}</span>
        <span>{GF}</span>
        <span>{GA}</span>
        <span>{GD}</span>
        <span>{points}</span>
      </article>
    );
  });

  return (
    <Fragment>
      <div className={classes['title-container']}>
        <span className={classes.arrow} onClick={backClickHandler}>
          &#8592;
        </span>
        <div className={classes.name}>
          <img src={competitionImage} alt="Flag" />
          <div className={classes.title}>
            <span className={classes.competition}>{competitionName}</span>
            <span className={classes.country}>{venue}</span>
          </div>
          <StarJsx />
        </div>
      </div>
      <nav className={classes.navigation}>
        <div className={classes['navigation--matches']}>
          <span>Matches</span>
        </div>
        <div className={classes.standings}>Standings</div>
      </nav>
      <div className={classes['container']}>
        <div className={classes['matches-container']}>
          {/* <hr /> */}
          <div className={classes['state-container']}>
            <div
              className={`${classes.state} ${
                urlState === 'fixtures' && classes.active
              }`}
              onClick={matchStateChangeHandler.bind(null, 'fixtures')}
            >
              Fixtures
            </div>
            <div
              className={`${classes.state} ${
                urlState === 'results' && classes.active
              }`}
              onClick={matchStateChangeHandler.bind(null, 'results')}
            >
              Results
            </div>
          </div>
          {isLoading && (
            <div className="centered">
              <LoadingSpinner />
            </div>
          )}
          {!isLoading && <Fragment>{events}</Fragment>}
        </div>
        <div className={classes.table}>
          {isLoading && (
            <div className="centered">
              <LoadingSpinner />
            </div>
          )}
          {!isLoading && (
            <Fragment>
              <header className={classes.header}>
                <div className={classes['team-details']}>
                  <span>#</span>
                  <span className={classes['header-name']}>Team</span>
                </div>
                <span>P</span>
                <span>W</span>
                <span>D</span>
                <span>L</span>
                <span>GF</span>
                <span>GA</span>
                <span>GD</span>
                <span>Pts</span>
              </header>
              <hr />
              {standingList}
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default FootballDetail;
