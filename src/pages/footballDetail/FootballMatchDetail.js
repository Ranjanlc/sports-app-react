import { useContext } from 'react';

import MatchContext from '../../store/match-context';

import MatchDetail from '../../components/matchDetail/MatchDetail';
const FootballMatchDetail = () => {
  const ctx = useContext(MatchContext);
  const {
    matchDetail: { matchId },
  } = ctx;
  const graphqlQuery = {
    query: `
      query FootballInfo($matchId:ID!){
        getFootballMatchInfo(matchId: $matchId) {
          venue
          refName
          refCountry
          spectators
          startDate
        }
      }
    `,
    variables: {
      matchId,
    },
  };
  return <MatchDetail query={graphqlQuery} endpoint="getFootballMatchInfo" />;
};

export default FootballMatchDetail;
