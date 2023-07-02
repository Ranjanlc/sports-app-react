import classes from './FootballDetail.module.css';
import { Fragment, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FootballStandings from '../../components/standings/FootballStandings';
import MatchContext from '../../store/match-context';
import CompetitionContext from '../../store/competition-context';
import { getFootballMatches } from '../../components/competitionMatches/getCompMatches';
import ErrorHandler from '../../components/error/ErrorHandler';
import useHttp from '../../hooks/use-http';
import Image from '../../components/ui/Image';

const FootballDetail = (props) => {
  const [matches, setMatches] = useState(null);
  const [standings, setStandings] = useState([]);

  const navigate = useNavigate();
  const { loadState } = useParams();
  const { pathname } = useLocation();
  const [matchState, setMatchState] = useState(loadState);
  const baseUrl = pathname.split('/').slice(0, -1).join('/');
  const urlState = pathname.split('/').slice(-1).at(0);
  const ctx = useContext(MatchContext);
  const { matchDetailHandler, clearMatchDetailHandler } = ctx;
  const { competitionSet } = useContext(CompetitionContext);
  const { competitionName, venue, competitionImage, competitionId } =
    competitionSet;

  const backClickHandler = () => {
    navigate(-1);
  };
  const graphqlQuery = {
    query: `
      query FootballDetails($compId: Int!) {
        getFootballDetails(compId:$compId) {
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
      compId: +competitionId,
    },
  };
  const [data, isError, isLoading] = useHttp(
    graphqlQuery,
    'getFootballDetails',
    !matches
  );
  useEffect(() => {
    if (data) {
      const { matches, standings } = data;
      setMatches(matches);
      setStandings(standings);
      // If there is no matches left.
      if (matches.fixtures.length === 0) {
        navigate(`${baseUrl}/results`, { replace: true });
        setMatchState('results');
      }
    }
  }, [data, navigate, baseUrl]);
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
      matchDetailHandler,
      clearMatchDetailHandler,
      navigate
    );
  return (
    <Fragment>
      {isError && <ErrorHandler message={isError} />}
      {!isError && (
        <Fragment>
          <div className={classes['title-container']}>
            <span className={classes.arrow} onClick={backClickHandler}>
              &#8592;
            </span>
            <div className={classes.name}>
              <Image src={competitionImage} alt="Flag" />
              <div className={classes.title}>
                <span className={classes.competition}>{competitionName}</span>
                <span className={classes.country}>{venue}</span>
              </div>
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

            <div className={classes['standing-container']}>
              {isLoading && (
                <div className="centered">
                  <LoadingSpinner />
                </div>
              )}{' '}
              {!isLoading && standings.length && (
                <FootballStandings dirtyStandings={standings} />
              )}
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default FootballDetail;
