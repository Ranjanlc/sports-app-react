import { useContext, useEffect } from 'react';
import ErrorHandler from '../../../components/error/ErrorHandler';
import CompetitionStandings from '../../../components/standings/CompetitionStandings';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import useHttp from '../../../hooks/use-http';
import MatchContext from '../../../store/match-context';

function BasketballTable() {
  const {
    matchDetail: { homeTeamId, awayTeamId, competitionId: compId },
    tableContainer,
    setMatchDetailHandler,
    setMatchDetailError,
    matchDetailError: { tableError },
  } = useContext(MatchContext);
  const graphqlQuery = {
    query: `
    query FetchTable($uniqueId:ID!){
      getBasketballMatchTable(uniqueId:$uniqueId){
        standings {
          position
          name
          played
          wins
          losses 
          teamId
          teamImageUrl
          percentage
        }
        groupName
      }
    }
    `,
    variables: { uniqueId: compId },
  };
  const [data, isError, isLoading] = useHttp(
    graphqlQuery,
    'getBasketballMatchTable',
    !tableContainer.length && !tableError
  );
  useEffect(() => {
    data && setMatchDetailHandler(data, 'table');
    isError && setMatchDetailError(isError, 'table');
  }, [data, setMatchDetailHandler, isError, setMatchDetailError]);
  return (
    <>
      {tableError && <ErrorHandler message={tableError} />}
      {isLoading && !tableError && (
        <div className="centered">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && !tableError && (
        <CompetitionStandings
          standings={tableContainer}
          sportName="basketball"
          homeTeamId={homeTeamId}
          awayTeamId={awayTeamId}
        />
      )}
    </>
  );
}

export default BasketballTable;
