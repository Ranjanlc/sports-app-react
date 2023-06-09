import { Fragment, useContext, useEffect, useReducer } from 'react';
import { apiDateConverter, getTimeZoneOffSet } from '../../helpers/date-picker';
import 'react-datepicker/dist/react-datepicker.css';
import classes from './ScoreList.module.css';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../ui/LoadingSpinner';
import FeaturedMatch from '../featuredMatch/FeaturedMatch';
import {
  convertSlugToDisplay,
  matchClickHandler,
  slugMaker,
} from '../../helpers/helpers';
import Info from '../../assets/scoreList/info';
import FootballContext from '../../store/football-context';
import getMatchList from '../matchList/getMatchList';
import CompetitionContext from '../../store/competition-context';
import ErrorHandler from '../error/ErrorHandler';
import DateList from '../dateNav/DateList';
import useHttp from '../../hooks/use-http';

const scoreReducer = (state, { type, value }) => {
  if (type === 'SET_DATE') {
    return { ...state, date: value };
  }
  if (type === 'SET_MATCHES') {
    return { ...state, matches: value };
  }
  if (type === 'SET_FEATURED_MATCH') {
    return { ...state, featuredMatch: value };
  }
  if (type === 'SET_LOAD_MATCHES') {
    return { ...state, loadMatches: value };
  }
  if (type === 'SET_LOADING') {
    return { ...state, isLoading: value };
  }
  if (type === 'SET_ERROR') {
    return { ...state, isError: value };
  }
};

const ScoreList = ({ sportName, isLive, dateId }) => {
  const curDay = apiDateConverter(new Date());
  const [scoreState, dispatchScore] = useReducer(scoreReducer, {
    matches: null,
    featuredMatch: null,
    date: dateId || curDay,
    loadMatches: true,
  });
  const { date, featuredMatch, matches, loadMatches } = scoreState;
  const ctx = useContext(FootballContext);
  const navigate = useNavigate();
  const { matchDetailHandler, clearFootballDetailHandler } = ctx;
  const { setCompetitionHandler, clearCompetitionSet } =
    useContext(CompetitionContext);
  // To set title of document.
  useEffect(() => {
    document.title = `BallScore | ${convertSlugToDisplay(sportName)} scores`;
  }, [sportName]);
  const timeZoneOffsetHour = getTimeZoneOffSet();
  const graphqlQuery = {
    query: `
     query FetchScoreList($isLive:Boolean!,$date:String,$timeZoneDiff:String,$isCricket:Boolean!,$sportName:String!){
      getMatchesList(date:$date,timeZoneDiff:$timeZoneDiff,sportName:$sportName,isLive:$isLive,isCricket:$isCricket)
      {
        matches {
          competitionId competitionName competitionImage venue 
          uniqueId @include (if:$isCricket)
          events {
            matchId matchStatus
            homeTeam {
              name imageUrl
              id
              isBatting @include(if:$isCricket)
            },awayTeam {
              name imageUrl
              id
              isBatting @include(if:$isCricket) 
            } 
            startTime homeScore awayScore winnerTeam 
            note @include(if:$isCricket)
          }
        }
        featuredMatch {
          event {
            matchId matchStatus 
            homeTeam {
              name imageUrl id
            },awayTeam {
              name imageUrl id
            } 
            startTime homeScore awayScore winnerTeam 
          } competitionName competitionId
        }
      }     
    }
     `,
    variables: {
      isCricket: sportName === 'cricket',
      sportName,
      isLive: isLive ? true : false,
      date,
      timeZoneDiff: timeZoneOffsetHour,
    },
  };
  console.log(date, matches);
  const [data, isError, isLoading] = useHttp(
    graphqlQuery,
    'getMatchesList',
    true,
    date
  );
  useEffect(() => {
    if (data) {
      // setFetchD(false);
      console.log('data bhitra kasari chiryoooo हँ', data);
      const { matches, featuredMatch } = data;
      dispatchScore({ type: 'SET_MATCHES', value: matches });
      // IN case we load live matches
      featuredMatch &&
        dispatchScore({ type: 'SET_FEATURED_MATCH', value: featuredMatch });
    }
  }, [data]);

  const competitionClickHandler = (compDetails) => {
    // TO convert it to url compatible form
    const { competitionName: compName } = compDetails;
    const compSlug = slugMaker(compName);
    // For resetting the fixtures/results and page once another competition is clicked
    clearCompetitionSet();
    setCompetitionHandler(compDetails);
    navigate(`/${sportName}/${compSlug}/fixtures`);
  };
  const setDateHandler = (dateValue) => {
    // setFetchD(true);
    // dispatchScore({ type: 'SET_MATCHES', value: null });
    // dispatchScore({ type: 'SET_LOAD_MATCHES', value: !loadMatches });
    dispatchScore({ type: 'SET_DATE', value: dateValue });
  };

  const competitionSet =
    matches?.length >= 1 &&
    getMatchList(
      matches,
      sportName,
      competitionClickHandler,
      matchClickHandler,
      matchDetailHandler,
      clearFootballDetailHandler,
      navigate
    );
  console.log(competitionSet);
  return (
    <Fragment>
      <DateList
        dateId={dateId}
        setDateHandler={setDateHandler}
        date={date}
        sportName={sportName}
      />
      {!isLoading && (matches?.length === 0 || !matches) && (
        <div className={classes.fallback}>
          <Info /> There are no live matches as of now.
        </div>
      )}
      <main className={isLive ? classes['live-container'] : classes.container}>
        {isError && <ErrorHandler message={isError} />}
        <div className={classes['match-list']}>
          {isLoading && !isError && (
            <div className="centered">
              <LoadingSpinner />
            </div>
          )}
          {!isLoading && <Fragment>{competitionSet}</Fragment>}
        </div>
        {!isLive && !isError && (
          <div className={classes.featured}>
            {isLoading && (
              <div className="centered">
                <LoadingSpinner />
              </div>
            )}
            {!isLoading && featuredMatch && (
              <FeaturedMatch
                featuredMatchContainer={featuredMatch}
                sportName={sportName}
              />
            )}
          </div>
        )}
      </main>
    </Fragment>
  );
};

export default ScoreList;
