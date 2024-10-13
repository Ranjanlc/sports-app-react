import { Fragment, useEffect, useState } from "react";
import classes from "./CompetitionStandings.module.css";
import Dropdown from "../dropdown/Dropdown";
import Image from "../UI/Image";
function CompetitionStandings({
  sportName,
  standings,
  homeTeamId,
  awayTeamId,
}) {
  const [curGroup, setCurGroup] = useState();
  const [groupContainer, setGroupContainer] = useState();
  useEffect(() => {
    if (standings?.length > 1) {
      const groupSet = standings.map((set) => set.groupName);
      setGroupContainer(groupSet);
      let position = 0;
      homeTeamId &&
        standings.forEach((el, i) => {
          // No confusing here, el has a standings property
          const pos = el.standings.findIndex((team) => {
            return team.teamId === homeTeamId;
          });
          if (pos !== -1) {
            // pos just gives the ranking of the team in the table,i gives what is the iteration which gives group number
            position = i;
          }
        });
      setCurGroup(groupSet[position]);
    }
  }, [standings, homeTeamId]);

  const groupChangeHandler = (option) => {
    setCurGroup(option);
  };
  const curStandingSet = groupContainer
    ? standings.find((standingData) => standingData.groupName === curGroup)
    : standings?.at(0);
  const curStandings = curStandingSet?.standings;
  //   To check if point data exists.
  const pointExists = curStandings?.at(0).points;

  const standingList = curStandings?.map((teamData) => {
    const {
      position,
      name,
      teamId,
      teamImageUrl,
      wins,
      losses,
      played,
      percentage,
      netRunRate,
      points,
    } = teamData;
    return (
      <article
        className={`${classes["team-data"]} ${
          teamId === homeTeamId || teamId === awayTeamId
            ? classes.highlight
            : ""
        }`}
        key={teamId}
      >
        <div className={classes["team-data__details"]}>
          <div className={classes.property}>{position}</div>
          <div className={classes.name}>
            <Image src={teamImageUrl} alt="" />
            {name}
          </div>
        </div>
        <div className={classes["property-container"]}>
          <div className={classes.property}>{played}</div>
          <div className={classes.property}>{wins}</div>
          <div className={classes.property}>{losses}</div>
          {sportName === "cricket" ? (
            <div className={classes.nrr}>{netRunRate}</div>
          ) : (
            <div className={classes.nrr}>{percentage}</div>
          )}
          {/* Fixing a bug where property class wouldnt be applied on teams having 0 points */}
          {(points === 0 || points) && (
            <div className={classes.property}>{points}</div>
          )}
        </div>
      </article>
    );
  });
  return (
    <div className={classes.table}>
      {groupContainer && (
        <Dropdown
          optionSet={groupContainer}
          groupChangeHandler={groupChangeHandler}
          startingOption={curGroup}
        />
      )}

      <Fragment>
        <header className={classes.header}>
          <div className={classes["team-details"]}>
            <div className={classes.property}>#</div>
            <div className={classes["header-name"]}>Team</div>
          </div>
          <div className={classes["property-container"]}>
            <div data-full="Played" className={classes.property}>
              P
            </div>
            <div data-full="Wins" className={classes.property}>
              W
            </div>
            <div data-full="Losses" className={classes.property}>
              L
            </div>
            {sportName === "cricket" ? (
              <div data-full="Run rate" className={classes.nrr}>
                NRR
              </div>
            ) : (
              <div data-full="Winning %" className={classes.nrr}>
                PCT
              </div>
            )}
            {pointExists && (
              <div data-full="Points" className={classes.property}>
                Pts
              </div>
            )}
          </div>
        </header>
        <hr />
        {standingList}
      </Fragment>
    </div>
  );
}

export default CompetitionStandings;
