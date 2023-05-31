import classes from './FootballDetail.module.css';
import StarJsx from '../../assets/star-jsx';
import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../UI/LoadingSpinner';
import FootballStandings from '../UI/FootballStandings';
import FootballContext from '../../store/football-context';
import { URL, matchClickHandler } from '../../helpers/helpers';
import CompetitionContext from '../../store/competition-context';
import { getFootballMatches } from './getCompMatches';

const FootballDetail = (props) => {
  const navigate = useNavigate();
  const { loadState } = useParams();
  const { pathname } = useLocation();
  const baseUrl = pathname.split('/').slice(0, -1).join('/');
  const urlState = pathname.split('/').slice(-1).at(0);

  const [matches, setMatches] = useState(null);
  const [matchState, setMatchState] = useState(loadState);
  const [standings, setStandings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const ctx = useContext(FootballContext);
  const {
    matchDetailHandler,
    setSummaryHandler,
    setStatsHandler,
    setTableHandler,
    setLineupHandler,
  } = ctx;
  const { competitionSet } = useContext(CompetitionContext);
  // const [groupContainer, setGroupContainer] = useState();
  // const [curGroup, setCurGroup] = useState();
  // let competitionSet;
  // For the case if user reloads the page from FootballDetail page.
  // if (props.competitionSet) {
  //   competitionSet = props.competitionSet;
  //   localStorage.setItem(
  //     'competitionSet',
  //     JSON.stringify(props.competitionSet)
  //   );
  // }
  // if (!props.competitionSet) {
  //   competitionSet = JSON.parse(localStorage.getItem('competitionSet'));
  // }
  const { competitionName, venue, competitionImage, competitionId } =
    competitionSet;

  const backClickHandler = () => {
    navigate(-1);
  };
  const graphqlQuery = {
    query: `
      query FootballDetails($competitionId: Int!) {
        getFootballDetails(compId:$competitionId) {
          matches {
            fixtures {
               matchId homeTeam {
               name imageUrl id
                } awayTeam {
                  name imageUrl id
                }startTime matchStatus homeScore awayScore winnerTeam 
            }
            results {
              matchId homeTeam {
                name imageUrl id
              }awayTeam { 
                name imageUrl id
              } startTime matchStatus homeScore awayScore winnerTeam
            }
          } standings {
            position name group teamId teamImageUrl played wins draws loses GF GA GD points
            }
        }
      }
    `,
    variables: {
      competitionId: +competitionId,
    },
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
    setMatches(matches);
    // If there is no matches left.
    if (matches.fixtures.length === 0) {
      navigate(`${baseUrl}/results`, { replace: true });
      setMatchState('results');
    }
    setStandings(standings);
    setIsLoading(false);
  }, []);
  useEffect(() => {
    fetchCompDetails();
  }, [fetchCompDetails]);
  // const groupChangeHandler = (option) => {
  //   setCurGroup(option);
  // };
  const matchStateChangeHandler = (state) => {
    // To replace fixtures/results with results/fixtures resp.
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
    getFootballMatches(
      matches,
      matchState,
      competitionId,
      competitionName,
      matchClickHandler,
      matchDetailHandler,
      setSummaryHandler,
      setStatsHandler,
      setLineupHandler,
      setTableHandler,
      navigate
    );
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
            {matches?.fixtures.length !== 0 && (
              <div
                className={`${classes.state} ${
                  urlState === 'fixtures' && classes.active
                }`}
                onClick={matchStateChangeHandler.bind(null, 'fixtures')}
              >
                Fixtures
              </div>
            )}
            {matches?.results.length !== 0 && (
              <div
                className={`${classes.state} ${
                  urlState === 'results' && classes.active
                }`}
                onClick={matchStateChangeHandler.bind(null, 'results')}
              >
                Results
              </div>
            )}
          </div>
          {isLoading && (
            <div className="centered">
              <LoadingSpinner />
            </div>
          )}
          {!isLoading && <Fragment>{events}</Fragment>}
        </div>
        {
          <div className={classes['standing-container']}>
            {isLoading && (
              <div className="centered">
                <LoadingSpinner />
              </div>
            )}{' '}
            {!isLoading && <FootballStandings dirtyStandings={standings} />}
          </div>
        }
      </div>
    </Fragment>
  );
};

export default FootballDetail;
