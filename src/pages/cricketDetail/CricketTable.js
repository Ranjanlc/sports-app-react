import { useContext, useEffect } from "react";
import CompetitionStandings from "../../components/standings/CompetitionStandings";
import MatchContext from "../../store/match-context";
import useHttp from "../../hooks/use-http";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import ErrorHandler from "../../components/error/ErrorHandler";

function CricketTable() {
  const {
    matchDetail: { homeTeamId, awayTeamId, competitionId: compId, uniqueId },
    tableContainer,
    setMatchDetailHandler,
    setMatchDetailError,
    matchDetailError: { tableError },
  } = useContext(MatchContext);
  const graphqlQuery = {
    query: `
    query FetchTable($compId:ID!,$uniqueId:ID!){
      getCricketMatchTable(compId:$compId,uniqueId:$uniqueId){
        standings {
          position
          points
          name
          wins
          losses
          played 
          teamId
          teamImageUrl
          netRunRate
        }
        groupName
      }
    }
    `,
    variables: { compId, uniqueId },
  };
  const [data, isError, isLoading] = useHttp(
    graphqlQuery,
    "getCricketMatchTable",
    !tableContainer.length && !tableError
  );
  useEffect(() => {
    data && setMatchDetailHandler(data, "table");
    isError && setMatchDetailError(isError, "table");
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
          sportName="cricket"
          homeTeamId={homeTeamId}
          awayTeamId={awayTeamId}
        />
      )}
    </>
  );
}

export default CricketTable;
