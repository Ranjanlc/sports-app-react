// import './ChartBar.css';
import classes from './ChartBar.module.css';
const ChartBar = (props) => {
  const { homeValue, maxValue, awayValue } = props;
  let homeBarFillWidth,
    awayBarFillWidth = '0%';
  if (maxValue > 0) {
    homeBarFillWidth = `${Math.round((homeValue / maxValue) * 100)}%`;
    awayBarFillWidth = `${Math.round((awayValue / maxValue) * 100)}%`;
  }
  return (
    <div className={classes['chart-bar']}>
      <span className={classes.value}>{homeValue}</span>
      <div className={`${classes['chart-bar__inner']} ${classes.home}`}>
        <div
          className={classes['chart-bar__fill']}
          style={{ width: homeBarFillWidth }}
        ></div>
        {/* This div is responsible for how much to fill the bars */}
      </div>
      <div className={classes['chart-bar__label']}>{props.label}</div>
      <div className={classes['chart-bar__inner']}>
        <div
          className={`${classes['chart-bar__fill']} ${classes['away-fill']}`}
          style={{ width: awayBarFillWidth }}
        ></div>
        {/* This div is responsible for how much to fill the bars */}
      </div>
      <span className={classes.value}>{awayValue}</span>
    </div>
  );
};
export default ChartBar;
