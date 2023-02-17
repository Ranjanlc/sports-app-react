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
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
const ScoreList = (props) => {
  const URL = 'http://localhost:8080/graphql';
  const navigate = useNavigate();
  const { dateId, sportName } = useParams();
  const { pathname: urlPath } = useLocation();
  // startDate's type is date because that is what accepted by datePicker
  const [startDate, setStartDate] = useState(
    dateId ? new Date(dateId) : new Date()
  );
  const curDay = apiDateConverter(new Date());
  // This date is for api uses.
  const [date, setDate] = useState(dateId);
  // This two if clauses for loading data when user clicks back button.
  if (!dateId && date !== curDay) {
    setDate(curDay);
  }
  if (dateId && dateId !== date) {
    setDate(dateId);
  }
  const [matches, setMatches] = useState(null);
  const changeStateHandler = (date) => {
    setStartDate(new Date(date));
    setDate(date);
  };
  const dateContainer = datePicker(date);
  const dateList = dateContainer?.map((date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const curDate = [day, month].join(' ');
    const convertedDate = apiDateConverter(date);
    return (
      <NavLink
        key={date.toISOString()}
        onClick={changeStateHandler.bind(null, convertedDate)}
        to={`/${sportName}/${convertedDate}`}
      >
        {curDate}
      </NavLink>
    );
  });
  const sportForApi = `get${urlPath.includes('live') ? 'Live' : ''}${
    sportName.charAt(0).toUpperCase() + sportName.slice(1)
  }Matches`;
  const graphqlQuery = {
    query: `
     {
      ${sportForApi}${urlPath.includes('live') ? '' : `(date:"${date}")`} {
         competitionId competitionName competitionImage venue
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
    //We send another request whenever date changes.
  }, [date, sportName]);
  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);
  const competitionSet = matches?.map((competition) => {
    const { competitionId, competitionName, competitionImage, venue, events } =
      competition;
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
      // console.log(startTimeConverted);
      // TODO:Add winning class.
      const splittedHomeScore =
        homeScore !== 'Yet to bat' && homeScore?.split(' ');
      const splittedAwayScore =
        awayScore !== 'Yet to bat' && awayScore?.split(' ');
      // Logic to separate test scores with odi&t20i scores.
      const cricketScore =
        sportName === 'cricket' &&
        (splittedHomeScore?.length === 3 || splittedAwayScore?.length === 3 ? (
          <div className={classes.score}>
            <div className={classes['first-score']}>
              <span className={classes.innings}>
                {splittedHomeScore?.slice(0, 2).join(' ')}
              </span>
              <span className={classes.total}>{splittedHomeScore?.at(2)}</span>
            </div>
            <div className={classes['second-score']}>
              <span className={classes.innings}>
                {splittedAwayScore?.slice(0, 2).join(' ')}
              </span>
              <span className={classes.total}>{splittedAwayScore?.at(2)}</span>
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
                <div className={classes['time']}>{displayTime}</div>
              )}
              {sportName !== 'cricket' && (
                <span className={classes.time}>{displayTime}</span>
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
              {matchStatus !== 'NS' && sportName !== 'cricket' && (
                <div className={classes.score}>
                  <div className={classes['first-score']}>{homeScore}</div>
                  <div className={classes['second-score']}>{awayScore}</div>
                </div>
              )}
              {sportName === 'cricket' &&
                matchStatus !== 'Not Started' &&
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
        <div className={classes['title-container']} key={competitionId}>
          <img src={`${competitionImage}`} alt="Flag" />
          <div className={classes.title}>
            <span className={classes.competition}>{competitionName} </span>
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
  return (
    <Fragment>
      <ul className={classes.date}>
        {/* <NavLink to={`/${sportName}/live`}> */}
        <img src="./liveicon.png" className={classes.icon} />
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
        <div className={classes['match-list']}>{competitionSet}</div>
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
