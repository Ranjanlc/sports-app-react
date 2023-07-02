import { createContext, useCallback, useReducer } from 'react';

const CompetitionContext = createContext({
  competitionSet: {},
  setCompetitionHandler: () => {},
  fixtureContainer: {},
  resultContainer: {},
  setFixtureContainerHandler: () => {},
  setResultContainerHandler: () => {},
  curFixturePage: '',
  setCurFixturePage: () => {},
  curResultPage: '',
  setCurPage: () => {},
  setMatchContainerHandler: () => {},
  setCurResultPage: () => {},
  clearCompetitionSet: () => {},
});

const competitionReducer = (state, { type, value }) => {
  if (type === 'SET_COMPETITION') {
    return { ...state, compContainer: value };
  }
  if (type === 'SET_FIXTURES') {
    return { ...state, fixtures: value };
  }
  if (type === 'SET_RESULTS') {
    return { ...state, results: value };
  }
  if (type === 'SET_FIXTURES_PAGE') {
    return { ...state, fixturePage: value };
  }
  if (type === 'SET_RESULTS_PAGE') {
    return { ...state, resultPage: value };
  }
  if (type === 'DEFAULT_STATE') {
    return { ...value };
  }
};

export const CompetitionContextProvider = (props) => {
  const initialState = {
    fixtures: {},
    results: {},
    compContainer: JSON.parse(localStorage.getItem('competitionSet')) || {
      competitionName: '',
      venue: '',
      competitionImage: '',
      competitionId: '',
    },
    fixturePage: 0,
    resultPage: 0,
  };
  const [compContextState, dispatchCompContext] = useReducer(
    competitionReducer,
    initialState
  );
  const { fixtures, results, fixturePage, resultPage, compContainer } =
    compContextState;
  const setCompetitionSetHandler = (compSet) => {
    dispatchCompContext({ type: 'SET_COMPETITION', value: compSet });
    localStorage.setItem('competitionSet', JSON.stringify(compSet));
  };
  const setMatchContainerHandler = useCallback((matchSet, state) => {
    dispatchCompContext({
      type: `SET_${state.toUpperCase()}`,
      value: matchSet,
    });
  }, []);
  const setCurPage = (page, state) => {
    dispatchCompContext({
      type: `SET_${state.toUpperCase()}_PAGE`,
      value: page,
    });
  };
  const clearCompetitionSet = () => {
    dispatchCompContext({ type: 'DEFAULT_STATE', value: initialState });
  };
  const competitionObj = {
    competitionSet: compContainer,
    setCompetitionHandler: setCompetitionSetHandler,
    setMatchContainerHandler,
    resultContainer: results,
    fixtureContainer: fixtures,
    setCurPage,
    curFixturePage: fixturePage,
    curResultPage: resultPage,
    clearCompetitionSet,
  };
  return (
    <CompetitionContext.Provider value={competitionObj}>
      {props.children}
    </CompetitionContext.Provider>
  );
};
export default CompetitionContext;
