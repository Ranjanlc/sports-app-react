import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import datePicker, {
  apiDateConverter,
  getTimeZoneOffSet,
} from '../../helpers/date-picker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import classes from './ScoreList.module.css';
import liveicon from '../../assets/liveicon.png';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../UI/LoadingSpinner';
import FeaturedMatch from './FeaturedMatch';
import {
  URL,
  convertSlugToDisplay,
  matchClickHandler,
  slugMaker,
} from '../../helpers/helpers';
import Info from '../../assets/info';
import FootballContext from '../../store/football-context';
import getMatchList from './getMatchList';
import CompetitionContext from '../../store/competition-context';
import ErrorHandler from '../layout/ErrorHandler';

const scoreReducer = (state, { type, value }) => {
  if (type === 'SET_DATE') {
    return { ...state, date: value };
  }
  if (type === 'SET_START_DATE') {
    return { ...state, startDate: value };
  }
  if (type === 'SET_DATE_NOT_CLICKED') {
    return { ...state, dateNotClicked: value };
  }
  if (type === 'SET_LIVE') {
    return { ...state, isLive: value };
  }
  if (type === 'SET_LOADING') {
    return { ...state, isLoading: value };
  }
  if (type === 'SET_ERROR') {
    return { ...state, errorMsg: value };
  }
  if (type === 'SET_MATCHES') {
    return { ...state, matches: value };
  }
  if (type === 'SET_FEATURED_MATCH') {
    return { ...state, featuredMatch: value };
  }
};

const ScoreList = (props) => {
  // const [matches, setMatches] = useState(null);
  // const [featuredMatch, setFeaturedMatch] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  // For initial rendering of active class on todays date.
  // const [isLive, setIsLive] = useState();
  // const [dateNotClicked, setDateNotClicked] = useState(true);
  // const [errorMsg, setErrorMsg] = useState(null);
  const { dateId, sportName } = useParams();
  const { pathname: urlPath } = useLocation();
  // startDate's type is date because that is what accepted by datePicker
  // const [startDate, setStartDate] = useState(
  //   dateId ? new Date(dateId) : new Date()
  // );
  // This date is for api uses.
  // const [date, setDate] = useState(dateId);
  const [scoreState, dispatchScore] = useReducer(scoreReducer, {
    matches: null,
    featuredMatch: null,
    isLoading: false,
    isLive: null,
    dateNotClicked: true,
    errorMsg: null,
    startDate: dateId ? new Date(dateId) : new Date(),
    date: dateId,
  });
  const {
    date,
    startDate,
    dateNotClicked,
    errorMsg,
    isLoading,
    isLive,
    featuredMatch,
    matches,
  } = scoreState;
  const curDay = apiDateConverter(new Date());
  const ctx = useContext(FootballContext);
  const navigate = useNavigate();
  const { matchDetailHandler, clearFootballDetailHandler } = ctx;
  const { setCompetitionHandler, clearCompetitionSet } =
    useContext(CompetitionContext);
  // This two if clauses for loading data when user clicks back button.
  if (!dateId && date !== curDay) {
    dispatchScore({ type: 'SET_DATE', value: curDay });
  }
  if (dateId && dateId !== date) {
    dispatchScore({ type: 'SET_DATE', value: dateId });
  }
  // FOr loading data if it is set to live
  if (!isLive && urlPath.includes('live')) {
    dispatchScore({ type: 'SET_LIVE', value: true });
  }
  // If user clicks back an gets redirected to /sportName when isLive is true,we need to change state to again fetch data
  if (isLive && !urlPath.includes('live')) {
    dispatchScore({ type: 'SET_LIVE', value: false });
  }
  const changeStateHandler = (date) => {
    dispatchScore({ type: 'SET_START_DATE', value: new Date(date) });
    dispatchScore({ type: 'SET_DATE', value: date });
    dispatchScore({ type: 'SET_DATE_NOT_CLICKED', value: false });
  };
  // To set title of document.
  useEffect(() => {
    document.title = `BallScore | ${convertSlugToDisplay(sportName)} scores`;
  }, [sportName]);
  const dateContainer = datePicker(date);
  const dateList = dateContainer?.map((date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const convertedDate = apiDateConverter(date);
    if (!dateId && convertedDate === curDay && dateNotClicked) {
      return (
        <NavLink
          key={date.toISOString()}
          className={({ isActive }) =>
            [
              dateNotClicked ? classes.active : null,
              isActive ? classes.active : null,
            ]
              .filter(Boolean)
              .join(' ')
          }
          onClick={changeStateHandler.bind(null, convertedDate)}
          to={`/${sportName}/${convertedDate}`}
        >
          <span>{day}</span>
          <span>{month}</span>
          {/* {formattedDate} */}
        </NavLink>
      );
    }
    return (
      <NavLink
        key={date.toISOString()}
        className={({ isActive }) => (isActive ? classes.active : '')}
        onClick={changeStateHandler.bind(null, convertedDate)}
        to={`/${sportName}/${convertedDate}`}
      >
        <span>{day}</span>
        <span>{month}</span>
        {/* {formattedDate} */}
      </NavLink>
    );
  });
  const timeZoneOffsetHour = getTimeZoneOffSet();
  // `(date:"${date}"${
  //   sportName === 'football'
  //     ? `,timeZoneDiff:"${timeZoneOffsetHour}")`
  //     : ')'
  // }`
  const graphqlQuery = {
    query: `
     query FetchScoreList($isLive:Boolean!,$date:String!,$timeZoneDiff:String,$isCricket:Boolean!,$sportName:String!){
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
      isLive: urlPath.includes('live'),
      date,
      timeZoneDiff: timeZoneOffsetHour,
    },
  };
  const fetchMatches = useCallback(async () => {
    try {
      // For the situation where either livescore or sofascore is used up and user switches to another sport.
      dispatchScore({ type: 'SET_ERROR', value: null });
      dispatchScore({ type: 'SET_LOADING', value: true });
      const res = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify(graphqlQuery),
        headers: { 'Content-Type': 'application/json' },
      });
      // console.log(await res.json());
      if (!res.ok) {
        throw new Error("Sorry, Can't fetch matches rn.");
      }
      const data = await res.json();
      console.log(data);
      if (data.errors) throw new Error(data.errors[0].message);
      const {
        data: {
          getMatchesList: { matches, featuredMatch },
        }, //[] for computed property
      } = data;
      // console.log(matches, featuredMatch);
      dispatchScore({ type: 'SET_MATCHES', value: matches });
      // IN case we load live matches
      featuredMatch &&
        dispatchScore({ type: 'SET_FEATURED_MATCH', value: featuredMatch });
      dispatchScore({ type: 'SET_LOADING', value: false });
      // setIsLoading(false);
    } catch (err) {
      dispatchScore({ type: 'SET_ERROR', value: err.message });
    }
    //We send another request whenever date changes.
  }, [sportName, date, isLive]);
  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);
  const dateChangeHandler = (dateValue) => {
    const convertedDate = apiDateConverter(dateValue);
    dispatchScore({ type: 'SET_DATE', value: convertedDate });
    dispatchScore({ type: 'SET_START_DATE', value: dateValue });
    // setDate(convertedDate);
    // setStartDate(dateValue);
    navigate(`/${sportName}/${convertedDate}`);
  };
  const liveClickHandler = (e) => {
    navigate(`/${sportName}/live`);
  };
  const competitionClickHandler = (compDetails) => {
    // TO convert it to url compatible form
    const { competitionName: compName } = compDetails;
    const compSlug = slugMaker(compName);
    // For resetting the fixtures/results and page once another competition is clicked
    clearCompetitionSet();

    setCompetitionHandler(compDetails);
    navigate(`/${sportName}/${compSlug}/fixtures`);
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
      <ul className={classes.date}>
        {/* <NavLink to={`/${sportName}/live`}> */}
        <img
          src={liveicon}
          className={classes.icon}
          onClick={liveClickHandler}
          alt="Live icon"
        />
        {/* </NavLink> */}
        <li className={classes['date-container']}>{dateList}</li>
        <li className={classes['date-picker__container']}>
          <DatePicker
            // Conditional selector to display placeHolder text on initial loading
            selected={dateId ? startDate : null}
            className={classes['date-picker']}
            todayButton="Set to Today"
            closeOnScroll={true}
            placeholderText="mm/dd/yy&#8617;"
            value={startDate}
            // To disable keyboard
            onFocus={(e) => e.target.blur()}
            onChange={dateChangeHandler}
          />
        </li>
      </ul>
      {!isLoading && (matches?.length === 0 || !matches) && (
        <div className={classes.fallback}>
          <Info /> There are no live matches as of now.
        </div>
      )}
      <main
        className={
          urlPath.includes('live')
            ? classes['live-container']
            : classes.container
        }
      >
        {errorMsg && <ErrorHandler message={errorMsg} />}
        <div className={classes['match-list']}>
          {isLoading && !errorMsg && (
            <div className="centered">
              <LoadingSpinner />
            </div>
          )}
          {!isLoading && <Fragment>{competitionSet}</Fragment>}
        </div>
        {!urlPath.includes('live') && !errorMsg && (
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
