import { Fragment, useCallback, useContext, useEffect } from 'react';
import datePicker, {
  apiDateConverter,
  getTimeZoneOffSet,
} from '../../helpers/date-picker';
import DatePicker from 'react-datepicker';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import classes from './ScoreList.module.css';
import liveicon from '../../assets/liveicon.png';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../UI/LoadingSpinner';
import FeaturedMatch from './FeaturedMatch';
import { URL, convertSlugToDisplay, slugMaker } from '../../helpers/helpers';
import Info from '../../assets/info';
import FootballContext from '../../store/football-context';
import getMatchList from './getMatchList';
import CompetitionContext from '../../store/competition-context';
const ScoreList = (props) => {
  const navigate = useNavigate();
  const { dateId, sportName } = useParams();
  const { pathname: urlPath } = useLocation();
  // const { changeCompetition } = props;
  const ctx = useContext(FootballContext);
  const {
    matchDetailHandler: setMatchDetailHandler,
    setStatsHandler,
    setSummaryHandler,
    setTableHandler,
    setLineupHandler,
  } = ctx;
  const {
    setCompetitionHandler,
    setCurFixturePage,
    setCurResultPage,
    setFixtureContainerHandler,
    setResultContainerHandler,
  } = useContext(CompetitionContext);
  // startDate's type is date because that is what accepted by datePicker
  const [startDate, setStartDate] = useState(
    dateId ? new Date(dateId) : new Date()
  );
  const curDay = apiDateConverter(new Date());
  // This date is for api uses.
  const [date, setDate] = useState(dateId);
  const [matches, setMatches] = useState(null);
  const [featuredMatch, setFeaturedMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // For initial rendering of active class on todays date.
  const [isLive, setIsLive] = useState();
  const [dateNotClicked, setDateNotClicked] = useState(true);
  // This two if clauses for loading data when user clicks back button.
  if (!dateId && date !== curDay) {
    setDate(curDay);
  }
  if (dateId && dateId !== date) {
    setDate(dateId);
  }
  // FOr loading data if it is set to live
  if (!isLive && urlPath.includes('live')) {
    setIsLive(true);
  }
  // If user clicks back an gets redirected to /sportName when isLive is true,we need to change state to again fetch data
  if (isLive && !urlPath.includes('live')) {
    setIsLive(false);
  }
  const changeStateHandler = (date) => {
    setStartDate(new Date(date));
    setDate(date);
    setDateNotClicked(false);
  };
  // To set title of document.
  useEffect(() => {
    document.title = `BallScore | ${convertSlugToDisplay(sportName)} scores`;
  }, [sportName]);
  const dateContainer = datePicker(date);
  const dateList = dateContainer?.map((date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const formattedDate = [day, month].join(' ');
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
          {formattedDate}
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
        {formattedDate}
      </NavLink>
    );
  });
  const sportForApi = `get${
    urlPath.includes('live') ? 'Live' : ''
  }${convertSlugToDisplay(sportName)}Matches`;
  const timeZoneOffsetHour = getTimeZoneOffSet();
  const graphqlQuery = {
    query: `
     {
      ${sportForApi}${
      urlPath.includes('live')
        ? ''
        : `(date:"${date}"${
            sportName === 'football'
              ? `,timeZoneDiff:"${timeZoneOffsetHour}")`
              : ')'
          }`
    }{
        matches {
          competitionId competitionName competitionImage venue ${
            sportName === 'cricket' ? 'uniqueId' : ''
          }
          events {
            matchId matchStatus
            homeTeam {
              name imageUrl ${sportName === 'cricket' ? 'isBatting' : ''} id
            },awayTeam {
              name imageUrl ${sportName === 'cricket' ? 'isBatting' : ''} id
            } 
            startTime homeScore awayScore winnerTeam 
            ${sportName === 'cricket' ? 'note' : ''}
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
  };
  const fetchMatches = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify(graphqlQuery),
      headers: { 'Content-Type': 'application/json' },
    });
    const {
      data: {
        [sportForApi]: { matches, featuredMatch },
      }, //[] for computed property
    } = await res.json();
    setMatches(matches);
    // IN case we load live matches
    featuredMatch && setFeaturedMatch(featuredMatch);
    setIsLoading(false);
    //We send another request whenever date changes.
  }, [sportName, date, isLive]);
  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);
  const dateChangeHandler = (dateValue) => {
    const convertedDate = apiDateConverter(dateValue);
    setDate(convertedDate);
    setStartDate(dateValue);
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
    setFixtureContainerHandler({});
    setResultContainerHandler({});
    setCurFixturePage(0);
    setCurResultPage(0);
    setCompetitionHandler(compDetails);
    navigate(`/${sportName}/${compSlug}/fixtures`);
  };
  const matchClickHandler = (matchDetail) => {
    const { matchStatus, homeTeamName, awayTeamName, matchId } = matchDetail;
    // setStatsHandler([]);
    // setTableHandler([]);
    // setSummaryHandler({ firstHalfIncidents: [], secondHalfIncidents: [] });
    // setLineupHandler({ lineups: [], subs: [] });
    setMatchDetailHandler(matchDetail);
    if (matchStatus === 'NS') {
      navigate(`/${sportName}/match/${matchId}/lineups`);
      return;
    }
    navigate(`/${sportName}/match/${matchId}/summary`);
  };

  const competitionSet =
    matches?.length >= 1 &&
    getMatchList(
      matches,
      sportName,
      matchClickHandler,
      competitionClickHandler
    );

  return (
    <Fragment>
      <ul className={classes.date}>
        {/* <NavLink to={`/${sportName}/live`}> */}
        <img
          src={liveicon}
          className={classes.icon}
          onClick={liveClickHandler}
        />
        {/* </NavLink> */}
        {dateList}
        <li>
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
        <div className={classes['match-list']}>
          {isLoading && (
            <div className="centered">
              <LoadingSpinner />
            </div>
          )}
          {!isLoading && <Fragment>{competitionSet}</Fragment>}
        </div>
        {!urlPath.includes('live') && (
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
