// import './ChartBar.css';
import classes from './ChartBar.module.css';
const ChartBar = (props) => {
  const { homeValue, maxValue, awayValue } = props;
  // Two variables just to make sure taht one doesnt become loser when both are square
  const homeLess = awayValue > homeValue;
  const awayLess = homeValue > awayValue;
  let homeBarFillWidth,
    awayBarFillWidth = '0%';
  if (maxValue > 0) {
    homeBarFillWidth = `${Math.round(((homeValue * 1.5) / maxValue) * 100)}%`;
    awayBarFillWidth = `${Math.round(((awayValue * 1.5) / maxValue) * 100)}%`;
  }
  return (
    <div className={classes['chart-bar']}>
      <span className={`${classes.value} ${homeLess ? classes.loser : ''}`}>
        {homeValue}
      </span>
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
      <span className={`${classes.value} ${awayLess ? classes.loser : ''}`}>
        {awayValue}
      </span>
    </div>
  );
};
export default ChartBar;
