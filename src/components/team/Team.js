import classes from "./Team.module.css";

import cricketBat from "../../assets/scoreList/cricket-bat.png";
import Image from "../UI/Image";
import { refineCricketScores } from "../../helpers/helpers";

const getScoreEl = (sportName, homeScore, awayScore) => {
  if (sportName !== "cricket")
    return { homeScoreEl: homeScore, awayScoreEl: awayScore };
  const {
    cricketFormat,
    homeInnings,
    awayInnings,
    totalAwayScore,
    totalHomeScore,
  } = refineCricketScores(homeScore, awayScore); //object coz undefined would produce an error.
  if (cricketFormat === "one-day") {
    return { homeScoreEl: homeScore, awayScoreEl: awayScore };
  }
  return {
    homeScoreEl: (
      <>
        <span className={classes.innings}>{homeInnings}</span>
        <span className={classes.total}>{totalHomeScore}</span>
      </>
    ),
    awayScoreEl: (
      <>
        <span className={classes.innings}>{awayInnings}</span>
        <span className={classes.total}>{totalAwayScore}</span>
      </>
    ),
  };
};

function Team({
  sportName,
  matchStatus,
  winnerTeam,
  home,
  away,
  matchState = "results",
}) {
  const { homeTeamName, homeUrl, homeIsBatting, homeScore } = home;
  const { awayTeamName, awayUrl, awayIsBatting, awayScore } = away;
  const { homeScoreEl, awayScoreEl } = getScoreEl(
    sportName,
    homeScore,
    awayScore
  );
  console.log(winnerTeam);
  const matchFinished =
    matchStatus === "Ended" || matchStatus === "AET" || matchStatus === "FT";
  return (
    <div className={classes.teams}>
      <div
        className={`${classes.home} ${
          matchFinished && winnerTeam === 2 ? classes.loser : ""
        }`}
      >
        <div>
          <Image src={homeUrl} alt="Home" />
          {homeTeamName}
          {homeIsBatting && matchStatus !== "Ended" && (
            <Image src={cricketBat} className={classes.bat} alt="" />
          )}
        </div>
        {matchState === "results" && matchStatus !== "Abandoned" && (
          <div className={classes.score}>{homeScoreEl}</div>
        )}
      </div>
      <div
        className={`${classes.away} ${
          matchFinished && winnerTeam === 1 ? classes.loser : ""
        }`}
      >
        <div>
          <Image src={awayUrl} alt="Away" />
          {awayTeamName}
          {awayIsBatting && matchStatus !== "Ended" && (
            <Image src={cricketBat} alt="" />
          )}
        </div>
        {matchState === "results" && matchStatus !== "Abandoned" && (
          <div className={classes.score}>{awayScoreEl}</div>
        )}
      </div>
    </div>
  );
}

export default Team;
