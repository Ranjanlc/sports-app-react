import { useContext, useEffect } from "react";
import FootballStandings from "../../../components/standings/FootballStandings";
import classes from "./FootballTable.module.css";
import MatchContext from "../../../store/match-context";
import LoadingSpinner from "../../../components/UI/LoadingSpinner";
import ErrorHandler from "../../../components/error/ErrorHandler";
import useHttp from "../../../hooks/use-http";

const FootballTable = (props) => {
  const {
    matchDetail: { competitionId, homeTeamId, awayTeamId },
    tableContainer,
    setMatchDetailHandler,
    setMatchDetailError,
    matchDetailError: { tableError },
  } = useContext(MatchContext);
  const graphqlQuery = {
    query: `
  query FootballTable($compId:ID!){
    getFootballMatchTable(compId:$compId) {
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
      compId: competitionId,
    },
  };
  const toFetch = !tableContainer.length && !tableError;
  const [data, isError, isLoading] = useHttp(
    graphqlQuery,
    "getFootballMatchTable",
    toFetch
  );
  useEffect(() => {
    if (data?.length === 0)
      return setMatchDetailError(
        "No standings available for this match",
        "table"
      );
    data && setMatchDetailHandler(data, "table");
    isError && setMatchDetailError(isError, "table");
  }, [data, setMatchDetailHandler, isError, setMatchDetailError]);
  return (
    <div
      className={tableContainer[0]?.group ? classes.group : classes.container}
    >
      {tableError && <ErrorHandler message={tableError} />}
      {isLoading && !tableError && (
        <div className="centered">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && !tableError && tableContainer.length !== 0 && (
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
