import { useCallback, useContext, useEffect, useState } from 'react';
import FootballStandings from '../UI/FootballStandings';
import classes from './FootballTable.module.css';
import FootballContext from '../../store/football-context';
import LoadingSpinner from '../UI/LoadingSpinner';
const FootballTable = (props) => {
  const URL = 'http://localhost:8080/graphql';
  const [isLoading, setIsLoading] = useState(false);
  const {
    matchDetail: { competitionId, homeTeamId, awayTeamId },
    tableContainer,
    setTableHandler,
  } = useContext(FootballContext);
  const graphqlQuery = {
    query: `
  {
    getFootballMatchTable(compId: ${competitionId}) {
      group
      teamId
      teamImageUrl
      position
      name
      GF
      GA
      GD
      wins
      loses
      draws
      points
      played
    }
  }
  
  `,
  };
  const fetchMatchTable = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify(graphqlQuery),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const {
      data: { getFootballMatchTable },
    } = await res.json();
    setTableHandler(getFootballMatchTable);
    setIsLoading(false);
  }, []);
  useEffect(() => {
    tableContainer.length === 0 && fetchMatchTable();
  }, [fetchMatchTable]);
  return (
    <div
      className={tableContainer[0]?.group ? classes.group : classes.container}
    >
      {isLoading && (
        <div className="centered">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
        <FootballStandings
          dirtyStandings={tableContainer}
          homeTeamId={homeTeamId}
          awayTeamId={awayTeamId}
        />
      )}
    </div>
  );
};

export default FootballTable;
