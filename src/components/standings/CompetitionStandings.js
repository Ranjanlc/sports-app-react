import { Fragment, useEffect, useState } from 'react';
import classes from './CompetitionStandings.module.css';
import Dropdown from '../dropdown/Dropdown';
import Image from '../ui/Image';
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
        className={`${classes['team-data']} ${
          teamId === homeTeamId || teamId === awayTeamId
            ? classes.highlight
            : ''
        }`}
        key={teamId}
      >
        <div className={classes['team-data__details']}>
          <span className={classes.position}>{position}</span>
          <span className={classes.name}>
            <Image src={teamImageUrl} alt="" />
            {name}
          </span>
        </div>
        <span>{played}</span>
        <span>{wins}</span>
        <span>{losses}</span>
        {sportName === 'cricket' ? (
          <span>{netRunRate}</span>
        ) : (
          <span>{percentage}</span>
        )}
        {points && <span>{points}</span>}
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
          <div className={classes['team-details']}>
            <span>#</span>
            <span className={classes['header-name']}>Team</span>
          </div>
          <span>P</span>
          <span>W</span>
          <span>L</span>
          {sportName === 'cricket' ? <span>NRR</span> : <span>PCT</span>}
          {pointExists && <span>Pts</span>}
        </header>
        <hr />
        {standingList}
      </Fragment>
    </div>
  );
}

export default CompetitionStandings;
