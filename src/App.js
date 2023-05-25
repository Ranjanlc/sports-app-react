import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScoreList from './components/score/ScoreList';
import FootballDetail from './components/competition/FootballDetail';
import CompetitionDetail from './components/competition/CompetitionDetail';
import MatchDetail from './components/match/MatchDetail';
import FootballSummary from './components/match/FootballSummary';
import FootballLineup from './components/match/FootballLineup';
import FootballTable from './components/match/FootballTable';
import FootballStats from './components/match/FootballStats';
//TODO:Special class while game is playing.
//NOT-IMP-TODO:If match is abandoned,do some styling
// Major-TODO:Make the site responsive
// Major-TODO:Make the team page working
// Major-TODO:Make the matches page working
// TODO:Refactor all graphql queries into one file,maybe
function App() {
  const [competitionDetail, setCompetitionDetail] = useState(null);
  // const [matchDetail, setMatchDetail] = useState(null);
  const changeCompetition = (competitionSet) => {
    setCompetitionDetail(competitionSet);
  };
  // const matchDetailHandler = (matchDetail) => {
  //   setMatchDetail(matchDetail);
  // };
  return (
    <Layout>
      <Routes>
        {/* <Route path="/" element={<Navigate to={'cricket'} replace />} /> */}
        <Route path="/" element={<Navigate to={'football'} replace />} />
        {['/:sportName', '/:sportName/live', '/:sportName/:dateId'].map(
          (path, id) => (
            <Route
              path={path}
              element={<ScoreList changeCompetition={changeCompetition} />}
              key={id}
            />
          )
        )}
        <Route
          path="/football/:compName/:loadState"
          element={<FootballDetail competitionSet={competitionDetail} />}
        ></Route>
        <Route
          path="/:sportName/:compName/:loadState"
          element={<CompetitionDetail competitionSet={competitionDetail} />}
        ></Route>
        <Route path="/football/match/:matchId" element={<MatchDetail />}>
          <Route path="summary" element={<FootballSummary />}></Route>
          <Route path="stats" element={<FootballStats />}></Route>
          <Route path="lineups" element={<FootballLineup />}></Route>
          <Route path="table" element={<FootballTable />}></Route>
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;
