import { Fragment, useCallback, useEffect } from 'react';
import datePicker, {
  apiDateConverter,
  convertDateForDisplay,
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
import { refineCricketScores } from '../../helpers/helpers';
const ScoreList = (props) => {
  const URL = 'http://localhost:8080/graphql';
  const navigate = useNavigate();
  const { dateId, sportName } = useParams();
  const { pathname: urlPath } = useLocation();
  const { changeCompetition } = props;
  // startDate's type is date because that is what accepted by datePicker
  const [startDate, setStartDate] = useState(
    dateId ? new Date(dateId) : new Date()
  );
  const curDay = apiDateConverter(new Date());
  // This date is for api uses.
  const [date, setDate] = useState(dateId);
  const [matches, setMatches] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // For initial rendering of active class on todays date.
  const [isLive, setIsLive] = useState();
  const [dateNotClicked, setDateNotClicked] = useState(true);
  // This two if clauses for loading data when user clicks back button.
  console.log(dateId, date, curDay);
  if (!dateId && date !== curDay) {
    console.log('nice');
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
    document.title = `BallScore | ${
      sportName.charAt(0).toUpperCase() + sportName.slice(1)
    } scores`;
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
  const sportForApi = `get${urlPath.includes('live') ? 'Live' : ''}${
    sportName.charAt(0).toUpperCase() + sportName.slice(1)
  }Matches`;
  console.log(date);
  const graphqlQuery = {
    query: `
     {
      ${sportForApi}${urlPath.includes('live') ? '' : `(date:"${date}")`} {
         competitionId competitionName competitionImage venue ${
           sportName === 'cricket' ? 'uniqueId' : ''
         }
         events {
           matchId matchStatus
           homeTeam {
             name imageUrl ${sportName === 'cricket' ? 'isBatting' : ''}
           },awayTeam {
             name imageUrl ${sportName === 'cricket' ? 'isBatting' : ''}
           } 
           startTime homeScore awayScore winnerTeam 
           ${sportName === 'cricket' ? 'note' : ''}
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
      data: { [sportForApi]: MatchesList }, //[] for computed property
    } = await res.json();
    console.log(MatchesList);
    setMatches(MatchesList);
    setIsLoading(false);
    //We send another request whenever date changes.
  }, [sportName, date, isLive]);
  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);
  const competitionClickHandler = (compDetails) => {
    // TO convert it to url compatible form
    const { competitionName: compName } = compDetails;
    const compSlug = compName.toLowerCase().split(' ').join('-');
    changeCompetition(compDetails);
    navigate(`/${sportName}/${compSlug}/fixtures`);
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
          homeTeam: {
            imageUrl: homeImageUrl,
            name: homeTeamName,
            isBatting: homeIsBatting,
          },
          awayTeam: {
            imageUrl: awayImageUrl,
            name: awayTeamName,
            isBatting: awayIsBatting,
          },
        } = event;
        const homeUrl = homeImageUrl.includes(undefined)
          ? dummyLogo
          : homeImageUrl;
        const awayUrl = awayImageUrl.includes(undefined)
          ? dummyLogo
          : awayImageUrl;
        const { displayTime } = convertDateForDisplay(startTime);
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
            <div className={classes.score}>
              <div className={classes['first-score']}>{homeScore}</div>
              <div className={classes['second-score']}>{awayScore}</div>
            </div>
          ));
        return (
          <div className={classes['match-container']} key={matchId}>
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
                  <div>
                    <img src={`${homeUrl}`} alt="Home" />
                    {homeTeamName}
                    {homeIsBatting && matchStatus !== 'Ended' && (
                      <img src={cricketBat} className={classes.bat} alt="" />
                    )}
                  </div>
                  <div>
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
                      <div className={classes['first-score']}>{homeScore}</div>
                      <div className={classes['second-score']}>{awayScore}</div>
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
        <Fragment key={competitionId}>
          <div className={classes['title-container']}>
            <img src={`${competitionImage}`} alt="Flag" />
            <div className={classes.title}>
              <span
                className={classes.competition}
                onClick={competitionClickHandler.bind(null, compDetails)}
              >
                {competitionName}{' '}
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

      <main className={classes.container}>
        <div className={classes['match-list']}>
          {isLoading && (
            <div className="centered">
              <LoadingSpinner />
            </div>
          )}
          {!isLoading && <Fragment>{competitionSet}</Fragment>}
        </div>
        <div className={classes.featured}>
          <span className={classes['featured-title']}>Featured Match</span>
          <div className={classes['featured-match']}>
            <div className={classes['featured-lhs']}>
              Arsenal
              <img
                src="https://api.sofascore.app/api/v1/team/65676/image"
                alt="dasd"
              />
            </div>
            <div className={classes['featured-score']}>0 - 0</div>
            <div className={classes['featured-rhs']}>
              Brentford
              <img
                src="https://api.sofascore.app/api/v1/team/3203/image"
                alt=""
              />
            </div>
          </div>
        </div>
      </main>
    </Fragment>
  );
};

export default ScoreList;
