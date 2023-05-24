import { useContext } from 'react';
import FootballContext from '../../store/football-context';
import { DUMMY_SUMMARY } from '../../helpers/DUMMY';
import classes from './FootballSummary.module.css';
import Card from '../../assets/card';
import FootballIcon from '../../assets/football-icon';
import { Fragment } from 'react';
import Boot from '../../assets/boot-icon';

const FootballSummary = (props) => {
  const ctx = useContext(FootballContext);
  const { matchDetail } = ctx;
  console.log(DUMMY_SUMMARY);
  const { homeImageUrl, awayImageUrl } = matchDetail;
  console.log(matchDetail);
  const {
    firstHalfIncidents,
    secondHalfIncidents,
    homeHTScore,
    awayHTScore,
    awayFTScore,
    homeFTScore,
  } = DUMMY_SUMMARY;
  const firstHalfEl = firstHalfIncidents.map((incidentSet) => {
    const {
      minute,
      team,
      incident,
      hasAssisted,
      score,
      scorer,
      assister,
      playerName,
    } = incidentSet;
    if (!score && team === 1) {
      return (
        <div className={`${classes.card} ${classes.home}`} key={minute}>
          <span className={classes.minute}>18'</span>
          <img src={homeImageUrl} />
          <span className={classes.player}>{playerName}</span>
          {incident === 'yellowCard' ? (
            <Card color="yellow" />
          ) : (
            <Card color="red" />
          )}
        </div>
      );
    }
    if (score && team === 1) {
      return (
        <div
          className={`${classes['left-goal']} ${classes.goal} ${classes.card}`}
          key={minute}
        >
          <span className={classes.minute}>18'</span>
          <div className={classes.left}>
            <img src={team === 1 ? homeImageUrl : awayImageUrl} alt="dcas" />
            <span
              className={`${classes.player} ${
                hasAssisted ? classes.assist : ''
              }`}
            >
              <span>{playerName ? playerName : scorer}</span>
              {hasAssisted && (
                <span className={classes.assister}>
                  {assister}
                  <Boot />
                </span>
              )}
            </span>
            {incident === 'ownGoal' ? (
              <FootballIcon color="red" />
            ) : (
              <FootballIcon />
            )}
          </div>
          <span className={classes.center}>
            {score[0]}-{score[1]}
          </span>
          <div className={classes.away}></div>
        </div>
      );
    }
    if (!score && team === 2) {
      return (
        <div className={`${classes.card} ${classes.away}`} key={minute}>
          <span className={classes.minute}>18'</span>
          <div className={classes.right}>
            {incident === 'yellowCard' ? (
              <Card color="yellow" />
            ) : (
              <Card color="red" />
            )}
            <span className={classes.player}>{playerName}</span>
            <img src={awayImageUrl} />
          </div>
        </div>
      );
    }
    if (score && team === 2) {
      return (
        <div
          className={`${classes['right-goal']} ${classes.card} ${classes.goal}`}
          key={minute}
        >
          <span className={classes.minute}>18'</span>
          <span className={classes.center}>
            {score[0]}-{score[1]}
          </span>
          <div className={classes.right}>
            {incident === 'ownGoal' ? (
              <FootballIcon color="red" />
            ) : (
              <FootballIcon />
            )}
            <span
              className={`${classes.player} ${
                hasAssisted ? classes.assist : ''
              }`}
            >
              <span>{playerName ? playerName : scorer}</span>
              {hasAssisted && (
                <span className={classes.assister}>
                  {assister}
                  <Boot />
                </span>
              )}
            </span>
            <img src={awayImageUrl} alt="dcas" />
          </div>
        </div>
      );
    }
  });
  const secondHalfEl = secondHalfIncidents.map((incidentSet) => {
    const {
      minute,
      team,
      incident,
      hasAssisted,
      score,
      scorer,
      assister,
      playerName,
    } = incidentSet;
    if (!score && team === 1) {
      return (
        <div className={`${classes.card} ${classes.home}`} key={minute}>
          <span className={classes.minute}>18'</span>
          <img src={homeImageUrl} />
          <span className={classes.player}>{playerName}</span>
          {incident === 'yellowCard' ? (
            <Card color="yellow" />
          ) : (
            <Card color="red" />
          )}
        </div>
      );
    }
    if (score && team === 1) {
      return (
        <div
          className={`${classes['left-goal']} ${classes.goal} ${classes.card}`}
          key={minute}
        >
          <span className={classes.minute}>18'</span>
          <div className={classes.left}>
            <img src={homeImageUrl} alt="dcas" />
            <span
              className={`${classes.player} ${
                hasAssisted ? classes.assist : ''
              }`}
            >
              <span>{playerName ? playerName : scorer}</span>
              {hasAssisted && (
                <span className={classes.assister}>
                  <Boot />
                  {assister}
                </span>
              )}
            </span>
            {incident === 'ownGoal' ? (
              <FootballIcon color="red" />
            ) : (
              <FootballIcon />
            )}
          </div>
          <span className={classes.center}>
            {score[0]}-{score[1]}
          </span>
          <div className={classes.away}></div>
        </div>
      );
    }
    if (!score && team === 2) {
      return (
        <div className={`${classes.card} ${classes.away}`} key={minute}>
          <span className={classes.minute}>18'</span>
          <div className={classes.right}>
            {incident === 'yellowCard' ? (
              <Card color="yellow" />
            ) : (
              <Card color="red" />
            )}
            <span className={classes.player}>{playerName}</span>
            <img src={awayImageUrl} />
          </div>
        </div>
      );
    }
    if (score && team === 2) {
      return (
        <div
          className={`${classes['right-goal']} ${classes.card} ${classes.goal}`}
          key={minute}
        >
          <span className={classes.minute}>18'</span>
          <span className={classes.center}>
            {score[0]}-{score[1]}
          </span>
          <div className={classes.right}>
            <FootballIcon />
            <span
              className={`${classes.player} ${
                hasAssisted ? classes.assist : ''
              }`}
            >
              <span>{playerName ? playerName : scorer}</span>
              {hasAssisted && (
                <span className={classes.assister}>
                  <Boot />
                  {assister}
                </span>
              )}
            </span>
            <img src={awayImageUrl} alt="dcas" />
          </div>
        </div>
      );
    }
  });
  return (
    <Fragment>
      {firstHalfEl}
      <div className={`${classes.card} ${classes.time} ${classes.half}`}>
        <span className={classes.minute}>HT</span>
        {homeHTScore}-{awayHTScore}
      </div>
      {secondHalfEl}
      <div className={`${classes.card} ${classes.time} ${classes.full}`}>
        <span className={classes.minute}>FT</span>
        {homeFTScore}-{awayFTScore}
      </div>
    </Fragment>
  );
};

export default FootballSummary;
