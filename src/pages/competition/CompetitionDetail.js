import classes from './CompetitionDetail.module.css';
import StarJsx from '../../assets/scoreList/star-jsx';
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { URL } from '../../helpers/helpers';
import Dropdown from '../../components/dropdown/Dropdown';
import ErrorHandler from '../../components/error/ErrorHandler';
import CompetitionContext from '../../store/competition-context';
import getCompetitionMatches from '../../components/competitionMatches/getCompMatches';
import useHttp from '../../hooks/use-http';

const competitionReducer = (state, { type, value }) => {
  if (type === 'SET_MATCHES') {
    return { ...state, matches: value };
  }
  if (type === 'SET_STANDINGS') {
    return { ...state, standings: value };
  }
  if (type === 'SET_PAGE') {
    return { ...state, page: value };
  }
  if (type === 'SET_NEXT_PAGE') {
    return { ...state, nextPage: value };
  }
  if (type === 'SET_CUR_GROUP') {
    return { ...state, curGroup: value };
  }
  if (type === 'SET_GROUP_CONTAINER') {
    return { ...state, groupContainer: value };
  }
  if (type === 'SET_LOAD_MATCHES') {
    return { ...state, loadMatches: value };
  }
  if (type === 'SET_SEASON_ID') {
    return { ...state, seasonId: value };
  }
  if (type === 'SET_NO_FIXTURE') {
    return { ...state, noFixture: value };
  }
  if (type === 'SET_MATCH_STATE') {
    return { ...state, matchState: value };
  }
};

const CompetitionDetail = (props) => {
  const navigate = useNavigate();
  const { loadState, sportName } = useParams();
  const { pathname } = useLocation();
  const urlState = pathname.split('/').slice(-1).at(0);

  const [competitionState, dispatchCompetition] = useReducer(
    competitionReducer,
    {
      matches: null,
      standings: null,
      page: 0,
      seasonId: null,

      curGroup: null,
      groupContainer: null,
      nextPage: null,

      loadMatches: false,
      noFixture: false,
      matchState: loadState,
    }
  );
  const {
    matches,
    standings,
    page,
    seasonId,
    curGroup,
    groupContainer,
    nextPage,
    loadMatches,
    noFixture,
    matchState,
  } = competitionState;
  // THe whole competitionContext thing just to secure fixtures/results data when they dont have focus.
  const {
    competitionSet,
    fixtureContainer,
    resultContainer,
    setCurPage,
    setMatchContainerHandler,
    curFixturePage,
    curResultPage,
  } = useContext(CompetitionContext);
  // The useEffect is concerned with persistence of results and fixtures.
  useEffect(() => {
    if (matchState === 'results') {
      dispatchCompetition({ type: 'SET_PAGE', value: curResultPage });
      if (resultContainer.matches) {
        dispatchCompetition({
          type: 'SET_MATCHES',
          value: resultContainer.matches,
        });
        dispatchCompetition({
          type: 'SET_NEXT_PAGE',
          value: resultContainer.hasNextPage,
        });
        // setMatches(resultContainer.matches);
        // setNextPage(resultContainer.hasNextPage);
        // setPage(curResultPage);
      } else {
        dispatchCompetition({ type: 'SET_LOAD_MATCHES', value: !loadMatches });
        // setLoadMatches((prevState) => !prevState);
      }
    }
    if (matchState === 'fixtures') {
      dispatchCompetition({ type: 'SET_PAGE', value: curFixturePage });
      if (fixtureContainer.matches) {
        dispatchCompetition({
          type: 'SET_MATCHES',
          value: fixtureContainer.matches,
        });
        dispatchCompetition({
          type: 'SET_NEXT_PAGE',
          value: fixtureContainer.hasNextPage,
        });
        // setMatches(fixtureContainer.matches);
        // setNextPage(fixtureContainer.hasNextPage);
        // setPage(curFixturePage);
      } else {
        dispatchCompetition({ type: 'SET_LOAD_MATCHES', value: !loadMatches });
        // setLoadMatches((prevState) => !prevState);
      }
    }
  }, [matchState, curFixturePage, curResultPage]);

  const { competitionName, venue, competitionImage, competitionId, uniqueId } =
    competitionSet;

  const backClickHandler = () => {
    navigate(-1);
  };

  const graphqlQueryDetails = {
    query: `
    query CompDetail($dateState: String!,$competitionId:ID,$uniqueId:ID!, $isCricket: Boolean!) {
      getCompetitionDetails(compId:$competitionId,uniqueId:$uniqueId, dateState: $dateState,isCricket:$isCricket) {
        matchSet {
          matches {
            homeTeam {
              name
              imageUrl
              id
            }
            awayTeam {
              name
              imageUrl
              id
            }
            matchId
            matchStatus
            startTime
            note @include(if: $isCricket)
            awayScore
            homeScore
            winnerTeam
          }
          hasNextPage
        }
        seasonId
        standingSet {
          groupName
          standings {
            name
            teamId
            teamImageUrl
            position
            played
            wins
            losses
            points
            percentage @skip(if:$isCricket)
            netRunRate @include(if:$isCricket)
          }
        }
      }
    }`,
    variables: {
      dateState: matchState === 'fixtures' ? 'next' : 'last',
      isCricket: sportName === 'cricket',
      // It is done because while storing id of basketball competition,we only fetch uniqueId and set it in competitionId.
      uniqueId: sportName === 'cricket' ? uniqueId : competitionId,
      // If cricket we are supposed to provide both uniqueId and tournament id for api reasons and for basketball,the competitionId is itself the uniqueId as we set in scoreList component.
      competitionId: sportName === 'cricket' ? competitionId : null,
    },
  };

  const [data, isError, isLoading] = useHttp(
    graphqlQueryDetails,
    'getCompetitionDetails',
    !matches
  );
  useEffect(() => {
    console.log('execute bhacha ra?');
    if (data) {
      if (!data.matchSet) {
        console.log('surely yahaaa chirena');
        dispatchCompetition({ type: 'SET_MATCH_STATE', value: 'results' });
        // dispatchCompetition({ type: 'SET_LOADING', value: false });
        dispatchCompetition({ type: 'SET_NO_FIXTURE', value: true });
        return;
      }
      const {
        matchSet: { matches, hasNextPage },
        standingSet,
        seasonId,
      } = data;
      console.log('yaaaha?');
      setMatchContainerHandler({ matches, hasNextPage }, matchState);

      dispatchCompetition({ type: 'SET_MATCHES', value: matches });
      dispatchCompetition({ type: 'SET_STANDINGS', value: standingSet });
      dispatchCompetition({ type: 'SET_SEASON_ID', value: seasonId });
      dispatchCompetition({ type: 'SET_NEXT_PAGE', value: hasNextPage });
      if (standingSet?.length > 1) {
        const groupSet = standingSet.map((set) => set.groupName);
        dispatchCompetition({ type: 'SET_GROUP_CONTAINER', value: groupSet });
        dispatchCompetition({ type: 'SET_CUR_GROUP', value: groupSet[0] });
      }
    }
  }, [data]);

  const graphqlQueryMatches = {
    query: `
     query FetchCompMatches($dateState:String!,$seasonId:ID!,$page:Int,$uniqueId:ID!,$isCricket:Boolean!){
        getCompMatches(uniqueId:$uniqueId,appSeasonId:$seasonId,page:$page,dateState:$dateState,isCricket:$isCricket) {
          matches {
              homeTeam {
              name imageUrl id
              }
              awayTeam {
                  name imageUrl id
              } matchId matchStatus startTime homeScore awayScore winnerTeam 
              note @include(if: $isCricket)
          } hasNextPage
        } 
       
    }`,
    variables: {
      dateState: matchState === 'fixtures' ? 'next' : 'last',
      isCricket: sportName === 'cricket',
      page: +page,
      seasonId,
      // It is done because while storing id of basketball competition,we only fetch uniqueId and set it in competitionId.
      uniqueId: sportName === 'cricket' ? uniqueId : competitionId,
    },
  };
  const [matchData, matchError, matchLoading] = useHttp(
    graphqlQueryMatches,
    'getCompMatches',
    matches,
    loadMatches
  );
  useEffect(() => {
    if (matchData) {
      const { matches, hasNextPage } = matchData;
      dispatchCompetition({ type: 'SET_MATCHES', value: matches });
      dispatchCompetition({ type: 'SET_NEXT_PAGE', value: hasNextPage });
      setMatchContainerHandler({ matches, hasNextPage }, matchState);
      setMatchContainerHandler({ matches, hasNextPage }, matchState);
    }
  }, [matchData]);

  const groupChangeHandler = (option) => {
    dispatchCompetition({ type: 'SET_CUR_GROUP', value: option });
  };
  const matchStateChangeHandler = (state, e) => {
    // To replace fixtures/results with results/fixtures resp.
    const baseUrl = pathname.split('/').slice(0, -1).join('/');
    if (state === 'fixtures' && urlState !== 'fixtures') {
      // setPage(0);
      // Coz we have to pass the current page and when changing to fixtures,it becomes of results.
      setCurPage(page, 'results');
      dispatchCompetition({ type: 'SET_MATCH_STATE', value: 'fixtures' });
      // setMatchState('fixtures');
      navigate(`${baseUrl}/fixtures`, { replace: true });
    }
    if (state === 'results' && urlState !== 'results') {
      // setPage(0);
      dispatchCompetition({ type: 'SET_MATCH_STATE', value: 'results' });
      setCurPage(page, 'fixtures');
      // setMatchState('results');
      navigate(`${baseUrl}/results`, { replace: true });
    }
  };
  const events =
    matches && getCompetitionMatches(matches, sportName, matchState);
  const curStandingSet = groupContainer
    ? standings.find((standingData) => standingData.groupName === curGroup)
    : standings?.at(0);
  const curStandings = curStandingSet?.standings;
  //   To check if point data exists.
  const pointExists = curStandings?.at(0).points;

  const standingList = curStandings?.map((teamData) => {
    const {
      position,
      name,
      teamId,
      teamImageUrl,
      wins,
      losses,
      played,
      percentage,
      netRunRate,
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
        <span>{losses}</span>
        {sportName === 'cricket' ? (
          <span>{netRunRate}</span>
        ) : (
          <span>{percentage}</span>
        )}
        {points && <span>{points}</span>}
      </article>
    );
  });
  const previousClickHandler = () => {
    // dispatchCompetition({ type: 'SET_PAGE_CHANGE', value: !pageChange });
    dispatchCompetition({ type: 'SET_LOAD_MATCHES', value: !loadMatches });
    // setPageChange((prevVal) => !prevVal);
    if (urlState === 'results') {
      dispatchCompetition({ type: 'SET_PAGE', value: page + 1 });
      // setPage((previousPage) => ++previousPage);
    }
    if (urlState === 'fixtures' && page > 0) {
      dispatchCompetition({ type: 'SET_PAGE', value: page + 1 });
      // setPage((previousPage) => --previousPage);
    }
  };
  const nextClickHandler = () => {
    dispatchCompetition({ type: 'SET_LOAD_MATCHES', value: !loadMatches });
    // dispatchCompetition({ type: 'SET_PAGE_CHANGE', value: !pageChange });
    // setPageChange((prevVal) => !prevVal);
    if (urlState === 'fixtures') {
      dispatchCompetition({ type: 'SET_PAGE', value: page + 1 });
      // setPage((previousPage) => ++previousPage);
    }
    if (urlState === 'results' && page > 0) {
      dispatchCompetition({ type: 'SET_PAGE', value: page - 1 });
      // setPage((previousPage) => --previousPage);
    }
  };
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
      {(isError || matchError) && (
        <ErrorHandler message={isError || matchError} />
      )}
      {!isError && !matchError && (
        <Fragment>
          <nav className={classes.navigation}>
            <div className={classes['navigation--matches']}>
              <span>Matches</span>
            </div>
            {standings && <div className={classes.standings}>Standings</div>}
          </nav>
          <div className={classes['container']}>
            <div className={classes['matches-container']}>
              {/* <hr /> */}
              <div className={classes['state-container']}>
                {/* If theres no fixture we dont give user a button to toggle there actually. */}
                {!noFixture && (
                  <div
                    className={`${classes.state} ${
                      urlState === 'fixtures' && classes.active
                    }`}
                    onClick={matchStateChangeHandler.bind(null, 'fixtures')}
                  >
                    Fixtures
                  </div>
                )}
                <div
                  className={`${classes.state} ${
                    urlState === 'results' && classes.active
                  }`}
                  onClick={matchStateChangeHandler.bind(null, 'results')}
                >
                  Results
                </div>
              </div>
              <div className={classes.switch}>
                {nextPage && urlState === 'results' && (
                  <span onClick={previousClickHandler}> &#8592;Previous</span>
                )}
                {urlState === 'fixtures' && page > 0 && (
                  <span onClick={previousClickHandler}> &#8592;Previous</span>
                )}
                {urlState === 'results' && page > 0 && (
                  <span onClick={nextClickHandler}> Next&#8594;</span>
                )}
                {nextPage && urlState === 'fixtures' && (
                  <span onClick={nextClickHandler}> Next&#8594;</span>
                )}
              </div>
              {(isLoading || matchLoading) && (
                <div className="centered">
                  <LoadingSpinner />
                </div>
              )}
              {!matchLoading && <Fragment>{events}</Fragment>}
            </div>
            <div className={classes.table}>
              {groupContainer && (!isLoading || standings) && (
                <Dropdown
                  optionSet={groupContainer}
                  groupChangeHandler={groupChangeHandler}
                />
              )}
              {isLoading && !standings && (
                <div className="centered">
                  <LoadingSpinner />
                </div>
              )}
              {!isLoading && standings && (
                <Fragment>
                  <header className={classes.header}>
                    <div className={classes['team-details']}>
                      <span>#</span>
                      <span className={classes['header-name']}>Team</span>
                    </div>
                    <span>P</span>
                    <span>W</span>
                    <span>L</span>
                    {sportName === 'cricket' ? (
                      <span>NRR</span>
                    ) : (
                      <span>PCT</span>
                    )}
                    {pointExists && <span>Pts</span>}
                  </header>
                  <hr />
                  {standingList}
                </Fragment>
              )}
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default CompetitionDetail;
