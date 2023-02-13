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
import { useNavigate, useParams } from 'react-router-dom';
const ScoreList = (props) => {
  const URL = 'http://localhost:8080/graphql';
  // let dateContainer;
  const navigate = useNavigate();
  const { dateId } = useParams();
  // startDate's type is date because that is what accepted by datePicker
  const [startDate, setStartDate] = useState(
    dateId ? new Date(dateId) : new Date()
  );
  const curDay = apiDateConverter(new Date());
  const [date, setDate] = useState(dateId || curDay);
  const [matches, setMatches] = useState(null);
  let dateContainer = datePicker(date);
  const loadMatchByDate = (date) => {
    setDate(date);
    console.log(new Date(date));
    setStartDate(new Date(date));
    navigate(`/${date}`);
  };
  const dateList = dateContainer?.map((date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const curDate = [day, month].join(' ');
    const convertedDate = apiDateConverter(date);
    return (
      <li
        key={date.toISOString()}
        id={convertedDate}
        onClick={loadMatchByDate.bind(null, convertedDate)}
      >
        {curDate}
      </li>
    );
  });
  // Used conditional setState to avoid infinite re-rendering
  if (apiDateConverter(startDate) !== date) {
    setDate(apiDateConverter(startDate));
  }

  // const newDay = apiDateConverter(startDate);
  const graphqlQuery = {
    query: `
     query {
      getFootballMatches(date:"${date}") {
        competitionName,
        competitionId,
        venue,
        events {
        matchId,homeTeam {
           name
          imageUrl
        },awayTeam {
          name imageUrl
        },startTime, matchStatus,homeScore,awayScore
      },
      competitionImage
      }
     }
    `,
  };
  const fetchMatches = useCallback(async () => {
    console.log('REquest to get data????');
    const res = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify(graphqlQuery),
      headers: { 'Content-Type': 'application/json' },
    });
    const {
      data: { getFootballMatches: MatchesList },
    } = await res.json();
    setMatches(MatchesList);
    //We send another request whenever date changes.
  }, [date]);
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
        homeTeam: { imageUrl: homeImageUrl, name: homeTeamName },
        awayTeam: { imageUrl: awayImageUrl, name: awayTeamName },
      } = event;
      const homeUrl = homeImageUrl.includes(undefined)
        ? dummyLogo
        : homeImageUrl;
      const awayUrl = awayImageUrl.includes(undefined)
        ? dummyLogo
        : awayImageUrl;
      const { displayTime } = convertDateForDisplay(startTime);
      // console.log(startTimeConverted);
      return (
        <div className={classes['match-item']}>
          <div className={classes.lhs}>
            <span className={classes.time}>{displayTime}</span>
            <div className={classes.teams}>
              <div>
                <img src={`${homeUrl}`} alt="Home" />
                {homeTeamName}
              </div>
              <div>
                <img src={`${awayUrl}`} alt="Away" />
                {awayTeamName}
              </div>
            </div>
          </div>
          <div className={classes.rhs}>
            {matchStatus !== 'NS' && (
              <div className={classes.score}>
                <span className={classes['first-score']}>{homeScore}</span>
                <span className={classes['second-score']}>{awayScore}</span>
              </div>
            )}
            <img src={favourites} alt="star" />
          </div>
        </div>
      );
    });
    return (
      <Fragment>
        <div className={classes['title-container']}>
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
    navigate(`/${convertedDate}`);
  };
  return (
    <Fragment>
      <ul className={classes.date}>
        <img src="./liveicon.png" className={classes.icon} />
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
