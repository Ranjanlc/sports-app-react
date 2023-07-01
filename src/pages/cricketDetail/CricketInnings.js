import { useContext, useEffect, useState } from 'react';
import Dropdown from '../../components/dropdown/Dropdown';
import classes from './CricketInnings.module.css';

import cricketBat from '../../assets/scoreList/cricket-bat.png';
import CricketBall from '../../assets/matchDetail/cricket-ball';
import Image from '../../components/ui/Image';
import MatchContext from '../../store/match-context';
import useHttp from '../../hooks/use-http';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorHandler from '../../components/error/ErrorHandler';
import Info from '../../assets/scoreList/info';
function CricketInnings() {
  const {
    matchDetail: { matchId, matchStatus },
    inningsContainer,
    setMatchDetailHandler,
    setMatchDetailError,
    matchDetailError: { inningsError },
  } = useContext(MatchContext);
  // To store user's index preferences
  const [curIndex, setCurIndex] = useState(
    localStorage.getItem('curIndex') || 0
  );
  const graphqlQuery = {
    query: `
    query FetchInnings($matchId:ID!){
      getCricketMatchInnings(matchId:$matchId){
        extras
        bowlingTeam
        battingTeam
        currentBowlerId
        currentBatsmanId
        bowlers {
          player{
            name id
          } over maiden run economy wicket
        }
        batsmen{
          player {
            id name 
          }
          fours sixes score wicket {
            type catcher bowler
          } balls 
        }
        fallOfWickets
      }
    }
    `,
    variables: {
      matchId,
    },
  };
  console.log(inningsContainer);
  const [data, isError, isLoading] = useHttp(
    graphqlQuery,
    'getCricketMatchInnings',
    !inningsContainer.length &&
      !(
        matchStatus === 'Not started' ||
        matchStatus === 'Abandoned' ||
        matchStatus === 'Start delayed'
      )
  );
  useEffect(() => {
    data && setMatchDetailHandler(data, 'innings');
    isError && setMatchDetailError(isError, 'innings');
  }, [data, setMatchDetailHandler, setMatchDetailError, isError]);

  const options = inningsContainer.map((inning, i) => {
    if (inningsContainer.length > 2) {
      if (i >= 2) {
        return `2nd Inning,${inning.battingTeam}`;
      }
      return `1st Inning,${inning.battingTeam}`;
    }
    return `${inning.battingTeam}'s Inning`;
  });
  const inningsChangeHandler = (option) => {
    let refinedIndex;
    if (inningsContainer.length > 2) {
      const reversedContainer = inningsContainer.slice().reverse();
      const inningsObj = {
        inningsContainer,
        reversedContainer,
      };
      const index = inningsObj[
        option.includes('1st Inning') ? 'inningsContainer' : 'reversedContainer'
      ].findIndex((inning) => option.includes(inning.battingTeam));
      refinedIndex = option.includes('1st Inning')
        ? index
        : inningsContainer.length - (index + 1);
    }
    if (inningsContainer.length <= 2) {
      refinedIndex = inningsContainer.findIndex((inning) =>
        option.includes(inning.battingTeam)
      );
    }
    localStorage.setItem('curIndex', String(refinedIndex));
    setCurIndex(refinedIndex);
  };
  const curInning = inningsContainer.at(curIndex);

  const curBatsmen = curInning?.batsmen.reduce(
    (acc, batsman) => {
      const {
        wicket: { type },
        player: { name },
      } = batsman;
      if (type === 'Did not bat') {
        acc.noBat.push(name);
      } else {
        acc.batted.push(batsman);
      }
      return acc;
    },
    {
      noBat: [],
      batted: [],
    }
  );
  const batsmenEl = curBatsmen?.batted.map((batsman) => {
    const {
      player: { id, name },
      balls,
      fours,
      sixes,
      score,
      wicket,
    } = batsman;
    const { type, catcher, bowler } = wicket;
    const strikeRate =
      balls !== 0 ? ((score / balls) * 100).toFixed(2) : `0.00`;
    const caughtAndBowled = catcher && bowler === catcher;
    const wicketTakerEl = (
      <div className={classes['wicket-taker']}>
        {type === 'Retired out' ? (
          'Retired Out'
        ) : (
          <>
            {type === 'Batting' && (
              <span>
                Batting
                {id === curInning.currentBatsmanId && (
                  <img src={cricketBat} alt="Bat" />
                )}
              </span>
            )}
            {type === 'LBW' && 'lbw'}
            {caughtAndBowled && <span>c&b {bowler}</span>}
            {catcher && !caughtAndBowled && <span>c {catcher}</span>}
            {bowler && !caughtAndBowled && type !== 'Batting' && (
              <span>b {bowler}</span>
            )}
          </>
        )}
      </div>
    );

    return (
      <li key={id} className={classes['batsmen-list']}>
        <div className={classes['player-container']}>
          <Image
            src={`https://api.sofascore.app/api/v1/player/${id}/image`}
            alt="Player"
            isPlayer={true}
          />
          <div>
            <div>{name}</div>
            {wicketTakerEl}
          </div>
        </div>
        {type !== 'Did not bat' && (
          <div className={classes['property-container']}>
            <div className={classes.property}>{score}</div>
            <div className={classes.property}>{balls}</div>
            <div className={classes.property}>{fours}</div>
            <div className={classes.property}>{sixes}</div>
            <div className={classes['strike-rate']}>{strikeRate}</div>
          </div>
        )}
      </li>
    );
  });
  const bowlerEl = curInning?.bowlers.map((bowler) => {
    const {
      run,
      over,
      maiden,
      economy,
      player: { id, name },
      wicket,
    } = bowler;
    return (
      <li key={id} className={classes['batsmen-list']}>
        <div className={classes['player-container']}>
          <Image
            src={`https://api.sofascore.app/api/v1/player/${id}/image`}
            alt="Player"
            isPlayer={true}
          />
          <div className={classes.player}>
            <div>{name}</div>
            {curInning.currentBowlerId === id && <CricketBall />}
          </div>
        </div>

        <div className={classes['property-container']}>
          <div className={classes.property}>{over}</div>
          <div className={classes.property}>{maiden}</div>
          <div className={classes.property}>{run}</div>
          <div className={classes.property}>{wicket}</div>
          <div className={classes['strike-rate']}>{economy}</div>
        </div>
      </li>
    );
  });
  if (
    matchStatus === 'Not started' ||
    matchStatus === 'Abandoned' ||
    matchStatus === 'Start delayed'
  ) {
    return (
      <div className={classes.fallback}>
        <Info /> Innings will be shown once the match starts.
      </div>
    );
  }
  return (
    <>
      {inningsError && <ErrorHandler message={inningsError} />}
      {isLoading && !inningsError && (
        <div className="centered">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && curInning && (
        <main className={classes.container}>
          <Dropdown
            optionSet={options}
            groupChangeHandler={inningsChangeHandler}
            startingOption={options.at(curIndex)}
          />
          <article className={classes.header}>
            <span className={classes.batsmen}>Batsmen</span>
            <div className={classes['property-container']}>
              <div data-full="Runs" className={classes.property}>
                R
              </div>
              <div data-full="Balls" className={classes.property}>
                B
              </div>
              <div data-full="Fours" className={classes.property}>
                4s
              </div>
              <div data-full="Sixes" className={classes.property}>
                6s
              </div>
              <div data-full="Strike rate" className={classes['strike-rate']}>
                S/R
              </div>
            </div>
          </article>
          <ul className={classes['player-list-container']}>{batsmenEl}</ul>
          <div className={classes.extras}>{curInning.extras}</div>
          <article className={classes['general-container']}>
            <div className={classes.title}>Did not Bat:</div>
            <div>{curBatsmen.noBat.join(',')}</div>
          </article>
          <article className={classes['general-container']}>
            <div className={classes.title}>Fall of wickets:</div>
            <div>{curInning.fallOfWickets.join(' , ')}</div>
          </article>
          <article className={classes.header}>
            <span>Bowler</span>
            <div className={classes['property-container']}>
              <div data-full="Overs" className={classes.property}>
                O
              </div>
              <div data-full="Maiden" className={classes.property}>
                M
              </div>
              <div data-full="Runs" className={classes.property}>
                R
              </div>
              <div data-full="Wickets" className={classes.property}>
                W
              </div>
              <div data-full="Economy" className={classes['strike-rate']}>
                Econ.
              </div>
            </div>
          </article>
          <ul className={classes['player-list-container']}>{bowlerEl}</ul>
        </main>
      )}
    </>
  );
}

export default CricketInnings;
