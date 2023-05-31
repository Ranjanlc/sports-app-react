import classes from './CompetitionDetail.module.css';
import StarJsx from '../../assets/star-jsx';
import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../UI/LoadingSpinner';
import { URL, convertSlugToDisplay } from '../../helpers/helpers';
import Dropdown from '../layout/Dropdown';
import ErrorHandler from '../layout/ErrorHandler';
import CompetitionContext from '../../store/competition-context';
import getCompetitionMatches from './getCompMatches';
const CompetitionDetail = (props) => {
  const navigate = useNavigate();
  const { loadState, sportName } = useParams();
  const { pathname } = useLocation();
  const [matches, setMatches] = useState(null);
  const [matchState, setMatchState] = useState(loadState);
  const [standings, setStandings] = useState();
  const [page, setPage] = useState(0);
  const [seasonId, setSeasonId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [curGroup, setCurGroup] = useState(null);
  const [groupContainer, setGroupContainer] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [error, setError] = useState(null);
  const [loadMatches, setLoadMatches] = useState(false);
  const [pageChange, setPageChange] = useState(false);
  const urlState = pathname.split('/').slice(-1).at(0);
  // THe whole competitionContext thing just to secure fixtures/results data when they dont have focus.
  const {
    competitionSet,
    setFixtureContainerHandler,
    fixtureContainer,
    resultContainer,
    setResultContainerHandler,
    setCurFixturePage,
    setCurResultPage,
    curFixturePage,
    curResultPage,
  } = useContext(CompetitionContext);
  // The useEffect is concerned with persistence of results and fixtures.
  useEffect(() => {
    console.log(curResultPage, curFixturePage, page, matchState);
    if (matchState === 'results') {
      if (resultContainer.matches) {
        setMatches(resultContainer.matches);
        setNextPage(resultContainer.hasNextPage);
        setPage(curResultPage);
      } else {
        setLoadMatches((prevState) => !prevState);
      }
    }
    if (matchState === 'fixtures') {
      if (fixtureContainer.matches) {
        setMatches(fixtureContainer.matches);
        setNextPage(fixtureContainer.hasNextPage);
        setPage(curFixturePage);
      } else {
        setLoadMatches((prevState) => !prevState);
      }
    }
    // fixtureContainer && matchState === 'fixtures'
    //   ? setMatches(fixtureContainer)
    //   : setLoadMatches((prevState) => !prevState);
    // resultContainer && matchState === 'results'
    //   ? setMatches(resultContainer)
    //   : setLoadMatches((prevState) => !prevState);
  }, [matchState]);

  const { competitionName, venue, competitionImage, competitionId, uniqueId } =
    competitionSet;

  const backClickHandler = () => {
    navigate(-1);
  };
  const sportForDetails = `get${convertSlugToDisplay(sportName)}Details`;
  // If cricket we are supposed to provide both uniqueId and tournament id for api reasons and for basketball,the competitionId is itself the uniqueId as we set in scoreList component.
  const compOrUniqueId =
    sportName === 'cricket'
      ? `compId:${competitionId},uniqueId:${uniqueId}`
      : `uniqueId:${competitionId}`;
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
      competitionId: sportName === 'cricket' ? competitionId : null,
    },
  };

  const fetchCompDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify(graphqlQueryDetails),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data);
        throw new Error("Sorry Couldn't fetch competition details");
      }
      const {
        data: {
          getCompetitionDetails: {
            matchSet: { matches, hasNextPage },
            standingSet,
            seasonId,
          },
        },
      } = data;
      matchState === 'fixtures'
        ? setFixtureContainerHandler({ matches, hasNextPage })
        : setResultContainerHandler({ matches, hasNextPage });
      setMatches(matches);
      setStandings(standingSet);
      setSeasonId(seasonId);
      setNextPage(hasNextPage);
      if (standingSet?.length > 1) {
        const groupSet = standingSet.map((set) => set.groupName);
        setGroupContainer(groupSet);
        //   Setting first element to show in first
        setCurGroup(groupSet[0]);
      }
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
    }
  }, []);
  useEffect(() => {
    fetchCompDetails();
  }, [fetchCompDetails]);
  const sportForMatches = `get${convertSlugToDisplay(sportName)}CompMatches`;
  console.log(seasonId);
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
  const fetchMatchesHandler = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify(graphqlQueryMatches),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const {
      data: {
        getCompMatches: { matches, hasNextPage },
      },
    } = await res.json();
    matchState === 'fixtures'
      ? setFixtureContainerHandler({ matches, hasNextPage })
      : setResultContainerHandler({ matches, hasNextPage });
    setMatches(matches);
    setNextPage(hasNextPage);
    setIsLoading(false);
  }, [pageChange, loadMatches, competitionId]);
  useEffect(() => {
    // To prevent initial loading
    matches && fetchMatchesHandler();
  }, [fetchMatchesHandler]);
  const groupChangeHandler = (option) => {
    setCurGroup(option);
  };
  const matchStateChangeHandler = (state, e) => {
    // To replace fixtures/results with results/fixtures resp.
    const baseUrl = pathname.split('/').slice(0, -1).join('/');
    if (state === 'fixtures' && urlState !== 'fixtures') {
      // setPage(0);
      setCurResultPage(page);
      setMatchState('fixtures');
      navigate(`${baseUrl}/fixtures`, { replace: true });
    }
    if (state === 'results' && urlState !== 'results') {
      // setPage(0);
      setCurFixturePage(page);
      setMatchState('results');
      navigate(`${baseUrl}/results`, { replace: true });
    }
  };
  const events =
    matches && getCompetitionMatches(matches, sportName, matchState);
  // TODO:Address the situation when there is no standings or there is a group-wise standings.
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
      draws,
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
    setPageChange((prevVal) => !prevVal);
    if (urlState === 'results') {
      setPage((previousPage) => ++previousPage);
    }
    if (urlState === 'fixtures' && page > 0) {
      setPage((previousPage) => --previousPage);
    }
  };
  const nextClickHandler = () => {
    setPageChange((prevVal) => !prevVal);
    if (urlState === 'fixtures') {
      setPage((previousPage) => ++previousPage);
    }
    if (urlState === 'results' && page > 0) {
      setPage((previousPage) => --previousPage);
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
      {error && <ErrorHandler message={error} />}
      {!error && (
        <Fragment>
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
              {isLoading && (
                <div className="centered">
                  <LoadingSpinner />
                </div>
              )}
              {!isLoading && <Fragment>{events}</Fragment>}
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
              {(!isLoading || standings) && (
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
