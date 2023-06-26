import { useState } from 'react';
import classes from './FootballStandings.module.css';
import Dropdown from '../dropdown/Dropdown';
import { Fragment } from 'react';
import { convertSlugToDisplay } from '../../helpers/helpers';
import Image from '../ui/Image';
const FootballStandings = (props) => {
  const { dirtyStandings, homeTeamId, awayTeamId } = props;
  const [standings, setStandings] = useState();
  const [curGroup, setCurGroup] = useState();
  const [groupContainer, setGroupContainer] = useState();
  const groupChangeHandler = (option) => {
    setCurGroup(option);
  };
  //   guard clause for avoiding multiple re-renders
  if (dirtyStandings[0]?.group && !curGroup) {
    const totalGroups = [];
    const refinedStandings = dirtyStandings.reduce((acc, curStanding) => {
      const { group } = curStanding;
      // Avoiding unnecessary work if competitionId already exists.

      if (acc[group]) {
        acc[group].push(curStanding);
      }
      if (!acc[group]) {
        totalGroups.push(group);
        acc[group] = [curStanding];
      }
      return acc;
    }, {});
    // For determining starting position for standings in case of standings from match
    const standingsArr = Object.values(refinedStandings);
    let position = 0;
    homeTeamId &&
      standingsArr.forEach((el, i) => {
        // + to convert it to number
        const pos = el.findIndex((team) => {
          return team.teamId === homeTeamId;
        });
        if (pos !== -1) {
          // pos just gives the ranking of the team in the table,i gives what is the iteration which gives group number
          position = i;
        }
      });
    setStandings(refinedStandings);
    setGroupContainer(totalGroups);
    setCurGroup(totalGroups.at(position));
  } else {
    !standings && setStandings(dirtyStandings);
  }
  const standingSet = groupContainer ? standings[curGroup] : standings;
  const standingList = standingSet?.map((teamData) => {
    const {
      position,
      name,
      teamId,
      teamImageUrl,
      wins,
      draws,
      loses,
      played,
      GF,
      GA,
      GD,
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
        <span>{draws}</span>
        <span>{loses}</span>
        <span>{GF}</span>
        <span>{GA}</span>
        <span>{GD}</span>
        <span>{points}</span>
      </article>
    );
  });
  return (
    <div className={classes.table}>
      {groupContainer && (
        <Dropdown
          startingOption={convertSlugToDisplay(curGroup)}
          optionSet={groupContainer}
          groupChangeHandler={groupChangeHandler}
          isFootball={true}
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
          <span>D</span>
          <span>L</span>
          <span>GF</span>
          <span>GA</span>
          <span>GD</span>
          <span>Pts</span>
        </header>
        <hr />
        {standingList}
      </Fragment>
    </div>
  );
};

export default FootballStandings;
