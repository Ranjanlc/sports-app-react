import { DUMMY_LINEUPS } from '../../helpers/DUMMY';
import classes from './FootballLineup.module.css';
import PlayerCircle from '../UI/PlayerCircle';
import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import FootballContext from '../../store/football-context';
import SubOut from '../../assets/sub-out';
import SubIn from '../../assets/sub-in';
import LoadingSpinner from '../UI/LoadingSpinner';
const FootballLineup = (props) => {
  //   const { subs, lineups } = DUMMY_LINEUPS;
  const [isLoading, setIsLoading] = useState(false);
  const URL = 'http://localhost:8080/graphql';
  const {
    matchDetail: {
      homeImageUrl,
      homeTeamName,
      awayTeamName,
      awayImageUrl,
      matchId,
    },
    setLineupHandler,
    lineupContainer,
  } = useContext(FootballContext);
  const graphqlQuery = {
    query: `
  {
    getFootballMatchLineup(matchId: ${matchId}) {
      lineups {
        team
        coach
        players {
          playerId
          playerName
          playerNumber
          formatPosition
        }
      }
      subs {
        minute
        minuteExtended
        team
        subInPlayerId
        subOutPlayerId
        subInPlayerName
        subOutPlayerName
      }
    }
  }
  `,
  };

  const fetchMatchLineup = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify(graphqlQuery),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const {
      data: { getFootballMatchLineup },
    } = await res.json();
    console.log(getFootballMatchLineup);
    setLineupHandler(getFootballMatchLineup);
    setIsLoading(false);
  }, []);
  useEffect(() => {
    lineupContainer.lineups.length === 0 && fetchMatchLineup();
  }, [fetchMatchLineup]);

  const { lineups, subs } = lineupContainer;
  const { players: homePlayers, coach: homeCoach } =
    lineupContainer.lineups.length !== 0
      ? lineups.find((el) => el.team === 1)
      : { players: '', coach: '' };
  const { players: awayPlayers, coach: awayCoach } =
    lineupContainer.lineups.length !== 0
      ? lineups.find((el) => el.team === 2)
      : { players: '', coach: '' };
  //   TODO:While refining player names,take length of word into the account in the case of 3 or 4 player names.
  const lineupReducer = (playerSet) => {
    const reducedLineup = playerSet.reduce((acc, curPlayer) => {
      const { playerId, playerName, playerNumber, formatPosition } = curPlayer;
      const index =
        formatPosition === 'substitutePlayer'
          ? 'subs'
          : formatPosition.slice(0, 1);
      if (acc[index]) {
        acc[index].push({ playerId, playerName, playerNumber });
        return acc;
      }
      if (!acc[index]) {
        acc[index] = [{ playerId, playerName, playerNumber }];
        return acc;
      }
    }, {});
    return reducedLineup;
  };
  const getLineupEl = (lineupObj, away = false) => {
    // Slicing the substitue part
    const lineupEl = Object.values(lineupObj)
      .slice(0, -1)
      .map((positionSet, i) => {
        const playerEl = positionSet.map((playerSet) => {
          const { playerName, playerNumber, playerId } = playerSet;
          const subOut = Object.values(subs)
            ?.flat()
            ?.some((el) => el?.subOutPlayerId === playerId);
          return (
            <PlayerCircle
              playerName={playerName}
              playerNumber={playerNumber}
              away={away}
              subOut={subOut}
              key={playerNumber}
            />
          );
        });
        return (
          <div className={classes.position} key={i}>
            {playerEl}
          </div>
        );
      });
    return lineupEl;
  };
  const subsArr = Object.values(subs).flat();
  const getIndvSubEl = (subSet, away = false) => {
    const subEl = subSet.map((el) => {
      const { playerId, playerNumber, playerName } = el;
      const isSubstituted = subsArr.some(
        (el) => el?.subInPlayerId === playerId
      );
      return (
        <li key={playerId}>
          <PlayerCircle onlyCircle playerNumber={playerNumber} />
          <span
            className={`${classes['sub-player']} ${away ? classes.away : ''}`}
          >
            {playerName}
            {isSubstituted && <SubIn />}
          </span>
        </li>
      );
    });
    return subEl;
  };
  const homeLineupObj =
    lineupContainer.lineups.length !== 0 && lineupReducer(homePlayers);
  const awayLineupObj =
    lineupContainer.lineups.length !== 0 && lineupReducer(awayPlayers);

  const homeLineupSet = getLineupEl(homeLineupObj);
  const awayLineupSet = getLineupEl(awayLineupObj, true);

  const homeSubEl =
    lineupContainer.lineups.length !== 0 && getIndvSubEl(homeLineupObj.subs);
  const awaySubEl =
    lineupContainer.lineups.length !== 0 &&
    getIndvSubEl(awayLineupObj.subs, true);

  const subsEl = Object.values(subs)
    .flat()
    .map((subContainer) => {
      const {
        minute,
        team,
        subOutPlayerName,
        subInPlayerName,
        subOutPlayerId,
        minuteExtended,
      } = subContainer;
      return (
        <li key={subOutPlayerId} className={classes['subs-list']}>
          <span className={classes.time}>
            {minute}
            {minuteExtended ? `+${minuteExtended}` : ``}'
          </span>
          <span>
            <img src={team === 1 ? homeImageUrl : awayImageUrl} />
          </span>
          <span className={classes['sub-out']}>
            <span>{subOutPlayerName}</span>
            <SubOut />
          </span>
          <span className={classes['sub-in']}>
            <SubIn /> {subInPlayerName}
          </span>
        </li>
      );
    });

  return (
    <Fragment>
      {isLoading && (
        <div className="centered">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
        <article className={classes.container}>
          <main className={classes['lineup-container']}>
            <div className={classes['lineups']}>
              <div className={classes.summary}>
                <span>
                  <img src={homeImageUrl} />
                  {homeTeamName}
                </span>
                <span>Coach : {homeCoach}</span>
              </div>
              <section className={classes['home-lineups']}>
                {homeLineupSet}
              </section>
              <section className={classes['away-lineups']}>
                <div className={classes.summary}>
                  <span>
                    <img src={awayImageUrl} />
                    {awayTeamName}
                  </span>
                  <span>Coach : {awayCoach}</span>
                </div>
                {awayLineupSet}
              </section>
            </div>
            <main className={classes['subs-container']}>
              <span className={classes.title}>Substitutions :</span>
              <ul>{subsEl}</ul>
            </main>
            <span className={classes.title}>Substitute Players :</span>
            <div className={classes['team-name__container']}>
              <span>
                <img src={homeImageUrl} />
                {homeTeamName}
              </span>
              <span className={classes.away}>
                <img src={awayImageUrl} />
                {awayTeamName}
              </span>
            </div>
            <main className={classes['sub__player-container']}>
              <div className={classes['home__sub']}>{homeSubEl}</div>
              <div className={classes['away__sub']}>{awaySubEl}</div>
            </main>
          </main>
        </article>
      )}
    </Fragment>
  );
};

export default FootballLineup;
