import { useCallback, useContext, useEffect, useState } from 'react';
import FootballStandings from '../UI/FootballStandings';
import classes from './FootballTable.module.css';
import FootballContext from '../../store/football-context';
import LoadingSpinner from '../UI/LoadingSpinner';
import { URL } from '../../helpers/helpers';
import ErrorHandler from '../layout/ErrorHandler';

const FootballTable = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const {
    matchDetail: { competitionId, homeTeamId, awayTeamId },
    tableContainer,
    setFootballDetailHandler,
  } = useContext(FootballContext);
  const graphqlQuery = {
    query: `
  query FootballTable($competitionId:ID!){
    getFootballMatchTable(compId:$competitionId) {
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
    variables: {
      competitionId,
    },
  };
  const fetchMatchTable = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify(graphqlQuery),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!res.ok || data.errors) {
        throw new Error(data.errors.at(0).message);
      }
      const {
        data: { getFootballMatchTable },
      } = data;
      setFootballDetailHandler(getFootballMatchTable, 'table');
      setIsLoading(false);
    } catch (err) {
      setIsError(err.message);
    }
  }, []);
  useEffect(() => {
    tableContainer.length === 0 && fetchMatchTable();
  }, [competitionId]);
  return (
    <div
      className={tableContainer[0]?.group ? classes.group : classes.container}
    >
      {isError && <ErrorHandler message={isError} />}
      {isLoading && !isError && (
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
