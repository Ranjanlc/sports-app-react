import { useContext } from 'react';
import Card from '../../../assets/matchDetail/card';
import FootballIcon from '../../../assets/matchDetail/football-icon';
import classes from './FootballIncident.module.css';
import FootballContext from '../../../store/football-context';
import Boot from '../../../assets/matchDetail/boot-icon';
import missedGoal from '../../../assets/matchDetail/football-cross.png';
import football from '../../../assets/matchDetail/football.png';
const FootballIncident = (props) => {
  const {
    minute,
    team,
    incident,
    hasAssisted,
    score,
    scorer,
    assister,
    playerName,
    minuteExtended,
  } = props.incidentSet;
  const ctx = useContext(FootballContext);
  // const playerName=dirtyPlayerName.split(' ').length>3?dirtyPlayerName
  const {
    matchDetail: { homeImageUrl, awayImageUrl },
  } = ctx;
  const classifyGoal = (incident) => {
    if (incident === 'goal') {
      // return <FootballIcon />;
      return <img src={football} alt="football" />;
    }
    if (incident === 'ownGoal') {
      return <FootballIcon color="red" />;
    }
    if (incident === 'canceledGoal') {
      return (
        <div className={classes['goal-icon__container']}>
          VAR
          <img src={missedGoal} alt="VAR" />
        </div>
      );
    }
    if (incident === 'penalty') {
      return (
        <div className={classes['goal-icon__container']}>
          PEN
          <img src={football} alt="football" />
        </div>
      );
    }
    if (incident === 'missedPenalty') {
      return (
        <div className={classes['goal-icon__container']}>
          PEN
          <img src={missedGoal} alt="MissedPEN" />
        </div>
      );
    }
  };
  if (!score && team === 1) {
    return (
      <div className={`${classes.card}`} key={minute}>
        <span className={classes.minute}>{`${minute}${
          minuteExtended ? `+${minuteExtended}'` : `'`
        }`}</span>
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
        <span className={classes.minute}>{`${minute}${
          minuteExtended ? `+${minuteExtended}'` : `'`
        }`}</span>
        <div className={classes.left}>
          <img
            src={incident !== 'ownGoal' ? homeImageUrl : awayImageUrl}
            alt="dcas"
          />
          <span
            className={`${classes.player} ${hasAssisted ? classes.assist : ''}`}
          >
            <span>{playerName ? playerName : scorer}</span>
            {hasAssisted && (
              <span className={classes.assister}>
                {assister}
                <Boot />
              </span>
            )}
          </span>
          {classifyGoal(incident)}
        </div>
        <span className={classes.center}>
          {score[0]}-{score[1]}
        </span>
        {/* <div className={classes.away}></div> */}
      </div>
    );
  }
  if (!score && team === 2) {
    return (
      <div className={`${classes.card}`} key={minute}>
        <span className={classes.minute}>{`${minute}${
          minuteExtended ? `+${minuteExtended}'` : `'`
        }`}</span>
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
        <span className={classes.minute}>{`${minute}${
          minuteExtended ? `+${minuteExtended}'` : `'`
        }`}</span>
        <span className={classes.center}>
          {score[0]}-{score[1]}
        </span>
        <div className={classes.right}>
          {classifyGoal(incident)}
          <span
            className={`${classes.player} ${hasAssisted ? classes.assist : ''}`}
          >
            <span>{playerName ? playerName : scorer}</span>
            {hasAssisted && (
              <span
                className={`${classes.assister} ${classes['away-assister']}`}
              >
                <Boot />
                {assister}
              </span>
            )}
          </span>
          <img
            src={incident !== 'ownGoal' ? awayImageUrl : homeImageUrl}
            alt="dcas"
          />
        </div>
      </div>
    );
  }
};

export default FootballIncident;
