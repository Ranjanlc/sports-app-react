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
  lineupContainer: { lineups: [], subs: [] },
  setLineupHandler: () => {},
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
  const [lineup, setLineup] = useState({ lineups: [], subs: [] });
  const matchDetailHandler = (matchDetail) => {
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
  const setLineupHandler = (lineupContainer) => {
    setLineup(lineupContainer);
  };
  const matchContainer = {
    matchDetail,
    matchDetailHandler,
    summaryContainer: summary,
    statsContainer: stats,
    lineupContainer: lineup,
    tableContainer: table,
    setSummaryHandler,
    setStatsHandler,
    setLineupHandler,
    setTableHandler,
  };
  return (
    <FootballContext.Provider value={matchContainer}>
      {props.children}
    </FootballContext.Provider>
  );
};
export default FootballContext;
