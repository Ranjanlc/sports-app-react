import { createContext, useCallback, useReducer } from 'react';

const MatchContext = createContext({
  matchDetail: {},
  matchDetailHandler: () => {},
  statsContainer: [],
  summaryContainer: {},
  tableContainer: [],
  lineupContainer: { lineups: [], subs: [] },
  inningsContainer: [],
  matchDetailError: {
    lineupError: null,
    statsError: null,
    summaryError: null,
    tableError: null,
    inningsError: null,
  },

  setMatchDetailHandler: () => {},
  setMatchDetailError: () => {},
  clearMatchDetailHandler: () => {},
});

const errorReducer = (state, { type, value }) => {
  if (type === 'SET_TABLE_ERROR') {
    return { ...state, tableError: value };
  }
  if (type === 'SET_STATS_ERROR') {
    return { ...state, statsError: value };
  }
  if (type === 'SET_SUMMARY_ERROR') {
    return { ...state, summaryError: value };
  }
  if (type === 'SET_LINEUP_ERROR') {
    return { ...state, lineupError: value };
  }
  if (type === 'SET_INNINGS_ERROR') {
    return { ...state, inningsError: value };
  }
  if (type === 'CLEAR_ERROR_DETAIL') {
    return { ...value };
  }
};

const matchReducer = (state, { type, value }) => {
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

  if (type === 'SET_INNINGS') {
    return { ...state, innings: value };
  }

  if (type === 'CLEAR_MATCH_DETAIL') {
    return { ...value };
  }
};

export const MatchContextProvider = (props) => {
  const initialState = {
    matchDetail: JSON.parse(localStorage.getItem('matchDetail')) || {},
    table: [],
    lineup: { lineups: [], subs: [] },
    stats: null,
    summary: { firstHalfIncidents: [], secondHalfIncidents: [] },
    innings: [],
  };
  const initialErrorState = {
    lineupError: null,
    summaryError: null,
    statsError: null,
    tableError: null,
    inningsError: null,
  };

  const [matchDetailState, dispatchMatchDetail] = useReducer(
    matchReducer,
    initialState
  );
  // This thing just to avoid re-fetching when we know there is error.
  const [errorDetailState, dispatchErrorDetail] = useReducer(
    errorReducer,
    initialErrorState
  );
  const { table, lineup, stats, summary, matchDetail, innings } =
    matchDetailState;
  const matchDetailHandler = (matchDetail) => {
    dispatchMatchDetail({ type: 'SET_MATCH_DETAIL', value: matchDetail });
    localStorage.setItem('matchDetail', JSON.stringify(matchDetail));
  };
  const setMatchDetailHandler = useCallback((container, detail) => {
    dispatchMatchDetail({
      type: `SET_${detail.toUpperCase()}`,
      value: container,
    });
  }, []);
  const setMatchDetailError = useCallback((error, detail) => {
    dispatchErrorDetail({
      type: `SET_${detail.toUpperCase()}_ERROR`,
      value: error,
    });
  }, []);
  const clearMatchDetailHandler = () => {
    dispatchMatchDetail({ type: 'CLEAR_MATCH_DETAIL', value: initialState });
    dispatchErrorDetail({
      type: 'CLEAR_ERROR_DETAIL',
      value: initialErrorState,
    });
    localStorage.setItem('curIndex', 0);
  };
  const matchContainer = {
    matchDetail,
    matchDetailHandler,
    summaryContainer: summary,
    statsContainer: stats,
    lineupContainer: lineup,
    tableContainer: table,
    inningsContainer: innings,
    matchDetailError: errorDetailState,
    setMatchDetailHandler,
    clearMatchDetailHandler,
    setMatchDetailError,
  };
  return (
    <MatchContext.Provider value={matchContainer}>
      {props.children}
    </MatchContext.Provider>
  );
};
export default MatchContext;
