import { useContext } from 'react';
import MatchDetail from '../../components/matchDetail/MatchDetail';
import MatchContext from '../../store/match-context';
function BasketballMatchDetail() {
  const {
    matchDetail: { matchId },
  } = useContext(MatchContext);
  const graphqlQuery = {
    query: `
    query FetchInfo($matchId:ID!){
      getBasketballMatchInfo(matchId: $matchId) {
        venue
        startDate
        homeScore {
          period1
          period2
          period3
          period4
        }
        awayScore {
          period1
          period2
          period3
          period4
        }
      }
    }
    `,
    variables: {
      matchId,
    },
  };
  return <MatchDetail query={graphqlQuery} endpoint="getBasketballMatchInfo" />;
}

export default BasketballMatchDetail;
