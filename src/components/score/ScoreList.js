import { Fragment } from 'react';
import datePicker from '../../helpers/date-picker';
import classes from './ScoreList.module.css';
import favourites from './star.svg';
const ScoreList = (props) => {
  const dateContainer = datePicker();
  const dateChangeHandler = (e) => {
    console.log('fired');
  };
  const dateList = dateContainer.map((date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const curDate = [day, month].join(' ');
    return <li key={date.toISOString()}>{curDate}</li>;
  });
  return (
    <Fragment>
      <ul className={classes.date}>
        <img src="./liveicon.png" className={classes.icon} />
        {dateList}
        <input
          type="date"
          className={classes['date-picker']}
          onChange={dateChangeHandler}
        ></input>
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
