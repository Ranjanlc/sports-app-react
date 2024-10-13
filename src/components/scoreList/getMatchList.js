import { Fragment } from "react";
import { convertDateForDisplay } from "../../helpers/date-picker";
import dummyLogo from "../../assets/scoreList/dummy-logo.png";
import classes from "./getMatchList.module.css";
import { matchClickHandler } from "../../helpers/helpers";
import Image from "../UI/Image";
import Team from "../team/Team";

const getMatchList = (
  matches,
  sportName,
  competitionClickHandler,
  matchDetailHandler,
  clearMatchDetailHandler,
  navigate
) => {
  const matchList = matches.map((competition) => {
    const {
      competitionId,
      competitionName,
      competitionImage,
      venue,
      events,
      uniqueId,
    } = competition;
    const compDetails = {
      competitionName,
      competitionImage,
      venue,
      competitionId,
    };
    if (sportName === "cricket") compDetails.uniqueId = uniqueId;
    const eventsList = events.map((event) => {
      const {
        matchId,
        matchStatus,
        startTime,
        awayScore,
        homeScore,
        winnerTeam: dirtyWinnerTeam,
        note,
        homeTeam: {
          imageUrl: homeImageUrl,
          name: homeTeamName,
          isBatting: homeIsBatting,
          id: homeTeamId,
        },
        awayTeam: {
          imageUrl: awayImageUrl,
          name: awayTeamName,
          isBatting: awayIsBatting,
          id: awayTeamId,
        },
      } = event;
      const homeUrl = homeImageUrl.includes(undefined)
        ? dummyLogo
        : homeImageUrl;
      const awayUrl = awayImageUrl.includes(undefined)
        ? dummyLogo
        : awayImageUrl;
      // Noticed that in case of AET, we dont get refinedWinnerTeam
      console.log(dirtyWinnerTeam);
      let winnerTeam = dirtyWinnerTeam;
      if (
        dirtyWinnerTeam !== 0 &&
        !dirtyWinnerTeam &&
        sportName === "basketball"
      ) {
        // IF basketball's api sends null, it didnt calculated that of AET but in others, it means undecided
        winnerTeam = +homeScore > +awayScore ? 1 : 2;
      }
      console.log(winnerTeam);
      const { displayTime } =
        sportName === "football"
          ? convertDateForDisplay(startTime, "football")
          : convertDateForDisplay(startTime);
      const calculateMatchStatus = () => {
        if (sportName === "cricket") {
          return matchStatus === "Ended" ? note : matchStatus;
        }
        return matchStatus;
      };
      const matchDetail = {
        matchId,
        matchStatus: calculateMatchStatus(),
        homeTeamName,
        awayTeamName,
        homeImageUrl,
        awayImageUrl,
        homeScore,
        awayScore,
        winnerTeam,
        displayTime,
        competitionName,
        competitionId,
        uniqueId,
        homeTeamId,
        awayTeamId,
      };
      const home = { homeTeamName, homeUrl, homeScore, homeIsBatting };
      const away = { awayTeamName, awayUrl, awayScore, awayIsBatting };
      return (
        <div
          className={`${classes["match-container"]} ${
            // Three diff checks for three diff sports
            matchStatus === "Abandoned" ||
            matchStatus === "Canc." ||
            matchStatus === "Canceled"
              ? classes.abandoned
              : ""
          }
          ${
            matchStatus.includes("'") || matchStatus.includes("quarter")
              ? classes.playing
              : ""
          }`}
          key={matchId}
          onClick={matchClickHandler.bind(
            null,
            matchDetail,
            matchDetailHandler,
            clearMatchDetailHandler,
            navigate,
            sportName
          )}
        >
          <div className={classes["match-item"]}>
            {sportName === "cricket" && (
              <span className={classes["time"]}>{displayTime}</span>
            )}
            {sportName !== "cricket" && (
              <span
                className={`${classes.time} ${
                  sportName === "basketball"
                    ? classes["basketball-time"]
                    : classes.time
                }`}
              >
                {matchStatus === "NS" || matchStatus === "Not started"
                  ? displayTime
                  : matchStatus}
              </span>
            )}
            <Team
              home={home}
              away={away}
              matchStatus={matchStatus}
              sportName={sportName}
              winnerTeam={winnerTeam}
            />
          </div>
          {note && <div className={classes.note}>{note}</div>}
        </div>
      );
    });

    return (
      <Fragment
        key={`${competitionId}.${
          Math.ceil(Math.random() * 100) + Math.floor(Math.random() * 100)
        }`}
      >
        <div className={classes["title-container"]}>
          <Image src={`${competitionImage}`} alt="Flag" />
          <div className={classes.title}>
            <span
              className={classes.competition}
              onClick={competitionClickHandler.bind(null, compDetails)}
            >
              {competitionName}
            </span>
            <span className={classes.country}>{venue}</span>
          </div>
        </div>
        {eventsList}
      </Fragment>
    );
  });
  return matchList;
};
export default getMatchList;
