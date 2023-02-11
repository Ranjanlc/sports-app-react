import { Fragment, useEffect } from 'react';
import datePicker, { apiDateConverter } from '../../helpers/date-picker';
import DatePicker from 'react-datepicker';
import { useState } from 'react';

import 'react-datepicker/dist/react-datepicker.css';
import classes from './ScoreList.module.css';
import favourites from '../../assets/star.svg';
const ScoreList = (props) => {
  const URL = 'http://localhost:8080/graphql';
  // let dateContainer;
  const [startDate, setStartDate] = useState(null);
  let dateContainer = datePicker(startDate);
  const dateList = dateContainer.map((date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const curDate = [day, month].join(' ');
    return <li key={date.toISOString()}>{curDate}</li>;
  });
  const curDay = String(new Date().toISOString().split('T').at(0));
  const newDay = apiDateConverter(startDate);
  console.log(typeof curDay);
  const graphqlQuery = {
    query: `
     query {
      getFootballMatches(date:"${startDate ? newDay : curDay}") {
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
  const fetchMatches = async () => {
    const res = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify(graphqlQuery),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    console.log(data);
  };
  useEffect(() => {
    fetchMatches();
  }, []);
  const dateChangeHandler = (dateValue) => {
    // const date = new Date(+new Date(dateValue) + 60000000);
    setStartDate(dateValue);
  };
  return (
    <Fragment>
      <ul className={classes.date}>
        <img src="./liveicon.png" className={classes.icon} />
        {dateList}
        <li>
          <DatePicker
            selected={startDate}
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
          <div className={classes['title-container']}>
            <img src="https://static.livescore.com/i2/fh/england.jpg" alt="" />
            <div className={classes.title}>
              <span className={classes.competition}>Premier League </span>
              <span className={classes.country}>England</span>
            </div>
          </div>
          <div className={classes['match-item']}>
            <div className={classes.lhs}>
              <span className={classes.time}>18:15</span>
              <div className={classes.teams}>
                <div>
                  <img
                    src="https://lsm-static-prod.livescore.com/high/enet/8654.png"
                    alt="dasdc"
                  />
                  West Ham United
                </div>
                <div>
                  <img
                    src="https://lsm-static-prod.livescore.com/high/enet/8455.png"
                    alt="dasdc"
                  />
                  Chelsea
                </div>
              </div>
            </div>
            <div className={classes.rhs}>
              <div className={classes.score}>
                <span className={classes['first-score']}>1</span>
                <span className={classes['second-score']}>2</span>
              </div>
              <img src={favourites} alt="star" />
            </div>
          </div>
          <div className={classes['title-container']}>
            <img src="https://static.livescore.com/i2/fh/england.jpg" alt="" />
            <div className={classes.title}>
              <span className={classes.competition}>Premier League </span>
              <span className={classes.country}>England</span>
            </div>
          </div>
          <div className={classes['match-item']}>
            <div className={classes.lhs}>
              <span className={classes.time}>18:15</span>
              <div className={classes.teams}>
                <div>
                  <img
                    src="https://lsm-static-prod.livescore.com/high/enet/8654.png"
                    alt="dasdc"
                  />
                  West Ham United
                </div>
                <div>
                  <img
                    src="https://lsm-static-prod.livescore.com/high/enet/8455.png"
                    alt="dasdc"
                  />
                  Chelsea
                </div>
              </div>
            </div>
            <div className={classes.rhs}>
              <div className={classes.score}>
                <span className={classes['first-score']}>1</span>
                <span className={classes['second-score']}>2</span>
              </div>
              <img src={favourites} alt="star" />
            </div>
          </div>
          <div className={classes['match-item']}>
            <div className={classes.lhs}>
              <span className={classes.time}>FT</span>
              <div className={classes.teams}>
                <div>
                  <img
                    src="https://lsm-static-prod.livescore.com/high/enet/8654.png"
                    alt="dasdc"
                  />
                  West Ham United
                </div>
                <div>
                  <img
                    src="https://lsm-static-prod.livescore.com/high/enet/8455.png"
                    alt="dasdc"
                  />
                  Chelsea
                </div>
              </div>
            </div>
            <div className={classes.rhs}>
              {/* <div className={classes.score}>
                <span>1</span>
                <span>2</span>
              </div> */}
              <img src={favourites} alt="star" />
            </div>
          </div>
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
