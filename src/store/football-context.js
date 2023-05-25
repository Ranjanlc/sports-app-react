import { createContext, useState } from 'react';

const FootballContext = createContext({
  matchDetail: {},
  matchDetailHandler: () => {},
  statsContainer: [],
  setStatsHandler: () => {},
  summaryContainer: {},
  setSummaryHandler: () => {},
  tableContainer: [],
  setTableHandler: () => {},
});
export const FootballContextProvider = (props) => {
  const storedMatchDetail = JSON.parse(localStorage.getItem('matchDetail'));
  const [matchDetail, setMatchDetail] = useState(storedMatchDetail || {});
  const [stats, setStats] = useState([]);
  const [summary, setSummary] = useState({
    firstHalfIncidents: [],
    secondHalfIncidents: [],
  });
  const [table, setTable] = useState([]);
  const matchDetailHandler = (matchDetail) => {
    // console.log(matchDetail);
    localStorage.setItem('matchDetail', JSON.stringify(matchDetail));
    setMatchDetail(matchDetail);
  };
  const setStatsHandler = (statSet) => {
    setStats(statSet);
  };
  const setSummaryHandler = (summaryContainer) => {
    setSummary(summaryContainer);
  };
  const setTableHandler = (tableContainer) => {
    setTable(tableContainer);
  };
  const matchContainer = {
    matchDetail,
    matchDetailHandler,
    statsContainer: stats,
    setStatsHandler,
    summaryContainer: summary,
    setSummaryHandler,
    setTableHandler,
    tableContainer: table,
  };
  return (
    <FootballContext.Provider value={matchContainer}>
      {props.children}
    </FootballContext.Provider>
  );
};
export default FootballContext;
