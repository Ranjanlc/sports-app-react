import ChartBar from './ChartBar';
import classes from './FootballStats.module.css';
import { DUMMY_STATS } from '../../helpers/DUMMY';
import { Fragment, useContext } from 'react';
import FootballContext from '../../store/football-context';
const FootballStats = () => {
  const ctx = useContext(FootballContext);
  const {
    matchDetail: {
      matchStatus,
      homeTeamName,
      awayTeamName,
      awayImageUrl,
      homeImageUrl,
    },
  } = ctx;
  return (
    <Fragment>
      <nav className={classes['team-container']}>
        <div className={classes.home}>
          <img src={homeImageUrl} alt="hehe" />
          <span>{homeTeamName}</span>
        </div>
        <div className={classes.away}>
          <img src={awayImageUrl} alt="hehe" />
          <span>{awayTeamName}</span>
        </div>
      </nav>
      <div className={classes.chart}>
        {DUMMY_STATS.map((statContainer) => {
          const { stat, home, away } = statContainer;
          const capitalizedStat =
            stat.slice(0, 1).toUpperCase() + stat.slice(1);
          const totalMaximum = home + away;
          return (
            <ChartBar
              key={stat}
              homeValue={home}
              awayValue={away}
              maxValue={totalMaximum}
              label={capitalizedStat}
            />
          );
        })}
      </div>
    </Fragment>
  );
};

export default FootballStats;
