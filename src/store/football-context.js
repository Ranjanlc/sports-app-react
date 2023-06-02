import { createContext, useReducer, useState } from 'react';

const FootballContext = createContext({
  matchDetail: {},
  matchDetailHandler: () => {},
  statsContainer: [],
  // setStatsHandler: () => {},
  summaryContainer: {},
  // setSummaryHandler: () => {},
  tableContainer: [],
  // setTableHandler: () => {},
  lineupContainer: { lineups: [], subs: [] },
  // setLineupHandler: () => {},
  setFootballDetailHandler: () => {},
  clearFootballDetailHandler: () => {},
});

const footballReducer = (state, { type, value }) => {
  if (type === 'SET_MATCH_DETAIL') {
    return { ...state, matchDetail: value };
  }
  if (type === 'SET_TABLE') {
    return { ...state, table: value };
  }
  if (type === 'SET_STATS') {
    return { ...state, stats: value };
  }
  if (type === 'SET_SUMMARY') {
    return { ...state, summary: value };
  }
  if (type === 'SET_LINEUP') {
    return { ...state, lineup: value };
  }
  if (type === 'CLEAR_FOOTBALL_DETAIL') {
    return { ...value };
  }
};

export const FootballContextProvider = (props) => {
  const storedMatchDetail = JSON.parse(localStorage.getItem('matchDetail'));
  const initialState = {
    matchDetail: storedMatchDetail || {},
    table: [],
    lineup: { lineups: [], subs: [] },
    stats: [],
    summary: { firstHalfIncidents: [], secondHalfIncidents: [] },
  };
  const [footballState, dispatchFootball] = useReducer(
    footballReducer,
    initialState
  );
  const { table, lineup, stats, summary, matchDetail } = footballState;
  // const [matchDetail, setMatchDetail] = useState(storedMatchDetail || {});
  // const [stats, setStats] = useState([]);
  // const [summary, setSummary] = {
  //   firstHalfIncidents: [],
  //   secondHalfIncidents: [],
  // };
  // const [table, setTable] = useState([]);
  // const [lineup, setLineup] = useState({ lineups: [], subs: [] });
  const matchDetailHandler = (matchDetail) => {
    dispatchFootball({ type: 'SET_MATCH_DETAIL', value: matchDetail });
    localStorage.setItem('matchDetail', JSON.stringify(matchDetail));
  };
  // const setStatsHandler = (statSet) => {
  //   setStats(statSet);
  // };
  // const setSummaryHandler = (summaryContainer) => {
  //   setSummary(summaryContainer);
  // };
  // const setTableHandler = (tableContainer) => {
  //   setTable(tableContainer);
  // };
  // const setLineupHandler = (lineupContainer) => {
  //   setLineup(lineupContainer);
  // };
  const setFootballDetailHandler = (container, detail) => {
    dispatchFootball({ type: `SET_${detail.toUpperCase()}`, value: container });
  };
  const clearFootballDetailHandler = () => {
    dispatchFootball({ type: 'CLEAR_FOOTBALL_DETAIL', value: initialState });
  };
  const matchContainer = {
    matchDetail,
    matchDetailHandler,
    summaryContainer: summary,
    statsContainer: stats,
    lineupContainer: lineup,
    tableContainer: table,
    setFootballDetailHandler,
    clearFootballDetailHandler,
    // setSummaryHandler,
    // setStatsHandler,
    // setLineupHandler,
    // setTableHandler,
  };
  return (
    <FootballContext.Provider value={matchContainer}>
      {props.children}
    </FootballContext.Provider>
  );
};
export default FootballContext;
