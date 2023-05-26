import { Fragment, useCallback, useContext, useEffect } from 'react';
import datePicker, {
  apiDateConverter,
  convertDateForDisplay,
  getTimeZoneOffSet,
} from '../../helpers/date-picker';
import DatePicker from 'react-datepicker';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import classes from './ScoreList.module.css';
import favourites from '../../assets/star.svg';
import dummyLogo from '../../assets/dummy-logo.png';
import cricketBat from '../../assets/cricket-bat.png';
import liveicon from '../../assets/liveicon.png';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../UI/LoadingSpinner';
import FeaturedMatch from './FeaturedMatch';
import {
  convertSlugToDisplay,
  refineCricketScores,
  slugMaker,
} from '../../helpers/helpers';
import Info from '../../assets/info';
import FootballContext from '../../store/football-context';
const ScoreList = (props) => {
  const URL = 'http://localhost:8080/graphql';
  const navigate = useNavigate();
  const { dateId, sportName } = useParams();
  const { pathname: urlPath } = useLocation();
  const { changeCompetition } = props;
  const ctx = useContext(FootballContext);
  const {
    matchDetailHandler: setMatchDetailHandler,
    setStatsHandler,
    setSummaryHandler,
    setTableHandler,
    setLineupHandler,
  } = ctx;
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
  // console.log(dateId, date, curDay);
  if (!dateId && date !== curDay) {
    // console.log('nice');
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
    // console.log(convertedDate, curDay);
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
  // console.log(date);
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
            matchId matchStatus 
            homeTeam {
              name imageUrl id
            },awayTeam {
              name imageUrl id
            } 
            startTime homeScore awayScore winnerTeam 
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
    // console.log(matches, featuredMatch);
    setMatches(matches);
    // IN case we load live matches
    featuredMatch && setFeaturedMatch(featuredMatch);
    setIsLoading(false);
    //We send another request whenever date changes.
  }, [sportName, date, isLive]);
  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);
  const competitionClickHandler = (compDetails) => {
    // TO convert it to url compatible form
    const { competitionName: compName } = compDetails;
    const compSlug = slugMaker(compName);
    changeCompetition(compDetails);
    navigate(`/${sportName}/${compSlug}/fixtures`);
  };
  const matchClickHandler = (matchDetail) => {
    const { matchStatus, homeTeamName, awayTeamName, matchId } = matchDetail;
    setStatsHandler([]);
    setTableHandler([]);
    setSummaryHandler({ firstHalfIncidents: [], secondHalfIncidents: [] });
    setLineupHandler({lineups:[],subs:[]})
    setMatchDetailHandler(matchDetail);
    if (matchStatus === 'NS') {
      navigate(`/${sportName}/match/${matchId}/lineups`);
      return;
    }
    navigate(`/${sportName}/match/${matchId}/summary`);
  };

  const competitionSet =
    matches?.length >= 1 &&
    matches?.map((competition) => {
      const {
        competitionId,
        competitionName,
        competitionImage,
        venue,
        events,
        uniqueId,
      } = competition;
      const compDetails = {
        competitionName,
        competitionImage,
        venue,
        competitionId,
      };
      if (sportName === 'cricket') compDetails.uniqueId = uniqueId;
      const eventsList = events.map((event) => {
        const {
          matchId,
          matchStatus,
          startTime,
          awayScore,
          homeScore,
          winnerTeam,
          homeTeam: {
            imageUrl: homeImageUrl,
            name: homeTeamName,
            isBatting: homeIsBatting,
            id: homeTeamId,
          },
          awayTeam: {
            imageUrl: awayImageUrl,
            name: awayTeamName,
            isBatting: awayIsBatting,
            id: awayTeamId,
          },
        } = event;
        console.log(event);
        const homeUrl = homeImageUrl.includes(undefined)
          ? dummyLogo
          : homeImageUrl;
        const awayUrl = awayImageUrl.includes(undefined)
          ? dummyLogo
          : awayImageUrl;
        // console.log(startTime);
        const { displayTime } =
          sportName === 'football'
            ? convertDateForDisplay(startTime, 'football')
            : convertDateForDisplay(startTime);
        // TODO:Add winning class.
        // Logic to separate test scores with odi&t20i scores.
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
        const cricketScore =
          sportName === 'cricket' &&
          (cricketFormat === 'test' ? (
            <div className={classes.score}>
              <div
                className={`${classes['first-score']} ${
                  matchStatus === 'Ended' && winnerTeam !== 1
                    ? classes.loser
                    : ''
                }`}
              >
                <span className={classes.innings}>{homeInnings}</span>
                <span className={classes.total}>{totalHomeScore}</span>
              </div>
              <div
                className={`${classes['second-score']} ${
                  matchStatus === 'Ended' && winnerTeam !== 2
                    ? classes.loser
                    : ''
                } `}
              >
                <span className={classes.innings}>{awayInnings}</span>
                <span className={classes.total}>{totalAwayScore}</span>
              </div>
            </div>
          ) : (
            <div className={classes.score}>
              <div
                className={`${classes['first-score']} ${
                  matchStatus === 'Ended' && winnerTeam !== 1
                    ? classes.loser
                    : ''
                }`}
              >
                {homeScore}
              </div>
              <div
                className={`${classes['second-score']} ${
                  matchStatus === 'Ended' && winnerTeam !== 2
                    ? classes.loser
                    : ''
                } `}
              >
                {awayScore}
              </div>
            </div>
          ));
        const matchDetail = {
          matchId,
          matchStatus,
          homeTeamName,
          awayTeamName,
          homeImageUrl,
          awayImageUrl,
          homeScore,
          awayScore,
          winnerTeam,
          displayTime,
          competitionName,
          competitionId,
          homeTeamId,
          awayTeamId,
        };
        return (
          <div
            className={classes['match-container']}
            key={matchId}
            onClick={matchClickHandler.bind(null, matchDetail)}
          >
            <div className={classes['match-item']}>
              <div className={classes.lhs}>
                {sportName === 'cricket' && (
                  <span className={classes['time']}>{displayTime}</span>
                )}
                {sportName !== 'cricket' && (
                  <span
                    className={`${classes.time} ${
                      sportName === 'basketball'
                        ? classes['basketball-time']
                        : classes.time
                    }`}
                  >
                    {matchStatus === 'NS' || matchStatus === 'Not started'
                      ? displayTime
                      : matchStatus}
                  </span>
                )}
                <div className={classes.teams}>
                  <div
                    className={
                      (matchStatus === 'FT' || matchStatus === 'Ended') &&
                      winnerTeam !== 1
                        ? classes.loser
                        : ''
                    }
                  >
                    <img src={`${homeUrl}`} alt="Home" />
                    {homeTeamName}
                    {homeIsBatting && matchStatus !== 'Ended' && (
                      <img src={cricketBat} className={classes.bat} alt="" />
                    )}
                  </div>
                  <div
                    className={
                      matchStatus === 'FT' && winnerTeam !== 2
                        ? classes.loser
                        : ''
                    }
                  >
                    <img src={`${awayUrl}`} alt="Away" />
                    {awayTeamName}
                    {awayIsBatting && matchStatus !== 'Ended' && (
                      <img src={cricketBat} className={classes.bat} alt="" />
                    )}
                  </div>
                </div>
              </div>
              <div className={classes.rhs}>
                {!(
                  matchStatus === 'NS' ||
                  matchStatus === 'Not started' ||
                  matchStatus === 'Postponed'
                ) &&
                  sportName !== 'cricket' && (
                    <div className={classes.score}>
                      <div
                        className={`${classes['first-score']} ${
                          (matchStatus === 'FT' || matchStatus === 'Ended') &&
                          winnerTeam !== 1
                            ? classes.loser
                            : ''
                        }`}
                      >
                        {homeScore}
                      </div>
                      <div
                        className={`${classes['second-score']} ${
                          (matchStatus === 'FT' || matchStatus === 'Ended') &&
                          winnerTeam !== 2
                            ? classes.loser
                            : ''
                        }`}
                      >
                        {awayScore}
                      </div>
                    </div>
                  )}
                {sportName === 'cricket' &&
                  !(
                    matchStatus === 'Not Started' ||
                    matchStatus === 'Interrupted' ||
                    matchStatus === 'Abandoned'
                  ) &&
                  cricketScore}
                <img src={favourites} alt="star" />
              </div>
            </div>
            {event.note && <div className={classes.note}>{event.note}</div>}
          </div>
        );
      });

      return (
        <Fragment
          key={`${competitionId}.${
            Math.ceil(Math.random() * 100) + Math.floor(Math.random() * 100)
          }`}
        >
          <div className={classes['title-container']}>
            <img src={`${competitionImage}`} alt="Flag" />
            <div className={classes.title}>
              <span
                className={classes.competition}
                onClick={competitionClickHandler.bind(null, compDetails)}
              >
                {competitionName}
              </span>
              <span className={classes.country}>{venue}</span>
            </div>
          </div>
          {eventsList}
        </Fragment>
      );
    });
  const dateChangeHandler = (dateValue) => {
    const convertedDate = apiDateConverter(dateValue);
    setDate(convertedDate);
    setStartDate(dateValue);
    navigate(`/${sportName}/${convertedDate}`);
  };
  const liveClickHandler = (e) => {
    navigate(`/${sportName}/live`);
  };
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
          {!isLoading && matches.length === 0 && (
            <div className={classes.fallback}>
              <Info /> There are no live matches as of now.
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
              <FeaturedMatch event={featuredMatch} sportName={sportName} />
            )}
          </div>
        )}
      </main>
    </Fragment>
  );
};

export default ScoreList;
