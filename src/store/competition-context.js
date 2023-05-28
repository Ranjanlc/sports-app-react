import { createContext, useState } from 'react';

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
  setCurResultPage: () => {},
});

export const CompetitionContextProvider = (props) => {
  const storedCompSet =
    JSON.parse(localStorage.getItem('competitionSet')) || {};
  const [compContainer, setCompetitionContainer] = useState(
    storedCompSet || {
      competitionName: '',
      venue: '',
      competitionImage: '',
      competitionId: '',
    }
  );
  const [fixtures, setFixtures] = useState({});
  const [results, setResults] = useState({});
  const [fixturePage, setFixturePage] = useState(0);
  const [resultPage, setResultPage] = useState(0);
  const setCompetitionSetHandler = (compSet) => {
    setCompetitionContainer(compSet);
    localStorage.setItem('competitionSet', JSON.stringify(compSet));
  };
  const setFixtureHandler = (fixtureSet) => {
    setFixtures(fixtureSet);
  };
  const setResultHandler = (resultSet) => {
    setResults(resultSet);
  };
  const setCurResultPage = (page) => {
    setResultPage(page);
  };
  const setCurFixturePage = (page) => {
    setFixturePage(page);
  };
  const competitionObj = {
    competitionSet: compContainer,
    setCompetitionHandler: setCompetitionSetHandler,
    setFixtureContainerHandler: setFixtureHandler,
    setResultContainerHandler: setResultHandler,
    resultContainer: results,
    fixtureContainer: fixtures,
    setCurFixturePage,
    setCurResultPage,
    curFixturePage: fixturePage,
    curResultPage: resultPage,
  };
  return (
    <CompetitionContext.Provider value={competitionObj}>
      {props.children}
    </CompetitionContext.Provider>
  );
};
export default CompetitionContext;
