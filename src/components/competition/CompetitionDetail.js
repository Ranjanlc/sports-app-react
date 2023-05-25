import classes from './CompetitionDetail.module.css';
import StarJsx from '../../assets/star-jsx';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import dummyLogo from '../../assets/dummy-logo.png';
import cricketBat from '../../assets/cricket-bat.png';
import { competitionDateHandler } from '../../helpers/date-picker';
import LoadingSpinner from '../UI/LoadingSpinner';
import {
  convertSlugToDisplay,
  refineCricketScores,
} from '../../helpers/helpers';
import Dropdown from '../layout/Dropdown';
const CompetitionDetail = (props) => {
  const URL = 'http://localhost:8080/graphql';
  const navigate = useNavigate();
  const { loadState, sportName } = useParams();
  const { pathname } = useLocation();
  const urlState = pathname.split('/').slice(-1).at(0);
  const [matches, setMatches] = useState(null);
  const [matchState, setMatchState] = useState(loadState);
  const [standings, setStandings] = useState();
  const [page, setPage] = useState(0);
  const [seasonId, setSeasonId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [curGroup, setCurGroup] = useState(null);
  const [groupContainer, setGroupContainer] = useState(null);
  const [nextPage, setNextPage] = useState(null);
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
    {
        ${sportForDetails}(${compOrUniqueId},dateState:"${
      matchState === 'fixtures' ? 'next' : 'last'
    }") {
            matchSet {
                matches {
                    homeTeam {
                    name imageUrl id 
                    }
                    awayTeam {
                        name imageUrl id
                    } matchId matchStatus startTime ${
                      sportName === 'cricket' ? 'note' : ''
                    } awayScore homeScore winnerTeam
                } hasNextPage 
            } seasonId
            standingSet {
                groupName
                standings {
                name teamId teamImageUrl position played wins losses points
                ${sportName === 'basketball' ? 'percentage' : 'netRunRate'}
              }       
            }
       }
    }`,
  };

  const fetchCompDetails = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify(graphqlQueryDetails),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const {
      data: {
        [sportForDetails]: {
          matchSet: { matches, hasNextPage },
          standingSet,
          seasonId,
        },
      },
    } = await res.json();
    console.log(matches, standingSet, hasNextPage);
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
  }, []);
  useEffect(() => {
    fetchCompDetails();
  }, [fetchCompDetails]);
  const sportForMatches = `get${convertSlugToDisplay(sportName)}CompMatches`;
  const graphqlQueryMatches = {
    query: `
    {
        ${sportForMatches}(${compOrUniqueId},appSeasonId:${seasonId},page:${page} dateState:"${
      matchState === 'fixtures' ? 'next' : 'last'
    }") {
          matches {
              homeTeam {
              name imageUrl id
              }
              awayTeam {
                  name imageUrl id
              } matchId matchStatus startTime homeScore awayScore winnerTeam ${
                sportName === 'cricket' ? 'note' : ''
              }
          } hasNextPage
        } 
       
    }`,
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
        [sportForMatches]: { matches, hasNextPage },
      },
    } = await res.json();
    console.log(matches);
    setMatches(matches);
    setNextPage(hasNextPage);
    setIsLoading(false);
  }, [page, urlState]);
  useEffect(() => {
    // To prevent initial loading
    if (matches) {
      fetchMatchesHandler();
    }
  }, [fetchMatchesHandler]);
  const groupChangeHandler = (option) => {
    setCurGroup(option);
  };
  const matchStateChangeHandler = (state, e) => {
    // To replace fixtures/results with results/fixtures resp.
    const baseUrl = pathname.split('/').slice(0, -1).join('/');
    if (state === 'fixtures' && urlState !== 'fixtures') {
      setPage(0);
      setMatchState('fixtures');
      navigate(`${baseUrl}/fixtures`, { replace: true });
    }
    if (state === 'results' && urlState !== 'results') {
      setPage(0);
      setMatchState('results');
      navigate(`${baseUrl}/results`, { replace: true });
    }
  };
  const events =
    matches &&
    matches.map((event) => {
      const {
        matchId,
        matchStatus,
        startTime,
        awayScore,
        homeScore,
        homeTeam: {
          imageUrl: homeImageUrl,
          name: homeTeamName,
          isBatting: homeIsBatting,
          id: homeTeamId,
        },
        awayTeam: {
          imageUrl: awayImageUrl,
          name: awayTeamName,
          id: awayTeamId,
          isBatting: awayIsBatting,
        },
      } = event;
      const homeUrl = homeImageUrl.includes('undefined')
        ? dummyLogo
        : homeImageUrl;
      const awayUrl = awayImageUrl.includes('undefined')
        ? dummyLogo
        : awayImageUrl;
      const { displayTime, displayDate } = competitionDateHandler(startTime);
      const {
        cricketFormat,
        homeInnings,
        awayInnings,
        totalAwayScore,
        totalHomeScore,
      } =
        sportName === 'cricket'
          ? refineCricketScores(homeScore, awayScore)
          : {}; //object coz undefined would produce an error.
      const displayScore =
        sportName === 'cricket' && cricketFormat === 'test' ? (
          <div className={classes.score}>
            <div className={classes['first-score']}>
              <span className={classes.innings}>{homeInnings}</span>
              <span className={classes.total}>{totalHomeScore}</span>
            </div>
            <div className={classes['second-score']}>
              <span className={classes.innings}>{awayInnings}</span>
              <span className={classes.total}>{totalAwayScore}</span>
            </div>
          </div>
        ) : (
          // Will reach here either it is one-day-cricket or basketball
          <div className={classes.score}>
            <div className={classes['first-score']}>{homeScore}</div>
            <div className={classes['second-score']}>{awayScore}</div>
          </div>
        );
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
                {homeIsBatting && matchStatus !== 'Ended' && (
                  <img src={cricketBat} className={classes.bat} alt="" />
                )}
              </div>
              <div>
                <img src={awayUrl} alt="Away" />
                {awayTeamName}
                {awayIsBatting && matchStatus !== 'Ended' && (
                  <img src={cricketBat} className={classes.bat} alt="" />
                )}
              </div>
            </div>
          </div>
          <div className={classes.rhs}>
            {matchState === 'results' && displayScore}
            <StarJsx />
          </div>
        </div>
      );
    });
  // TODO:Address the situation when there is no standings or there is a group-wise standings.
  const curStandingSet = groupContainer
    ? standings.find((standingData) => standingData.groupName === curGroup)
    : standings?.at(0);
  const curStandings = curStandingSet?.standings;
  console.log(curStandings);
  //   To check if point data exists.
  const pointExists = curStandings?.at(0).points;
  //   console.log(pointExists);

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
    console.log('execute ta bhacha');
    if (urlState === 'results') {
      setPage((previousPage) => ++previousPage);
    }
    if (urlState === 'fixtures' && page > 0) {
      console.log(page);
      setPage((previousPage) => --previousPage);
    }
  };
  const nextClickHandler = () => {
    console.log('yeta click bhooo');
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
                {sportName === 'cricket' ? <span>NRR</span> : <span>PCT</span>}
                {pointExists && <span>Pts</span>}
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

export default CompetitionDetail;
