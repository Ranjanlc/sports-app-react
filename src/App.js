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
// MAjOR___TODO:Make lineups responsive for various sizes
// QLI_TODO:Add a send report button while showing error and send the report to database with the path where the error happened.
// TODO:Maybe handle errrors.
// TODO:Make graphql variable passing blending with the convention
// TODO:Refactor matchClickHandler
// MAJOR-TODO:When fetching fixtures,if its not available which is the case of finished tournaments,just load standings and results but dont load Error component.It is for competitionDetail,set similar for footballDetail too.
function App() {
  return (
    <Layout>
      <Routes>
        {/* <Route path="/" element={<Navigate to={'cricket'} replace />} /> */}
        <Route path="/" element={<Navigate to={'football'} replace />} />
        {['/:sportName', '/:sportName/live', '/:sportName/:dateId'].map(
          (path, id) => (
            <Route path={path} element={<ScoreList />} key={id} />
          )
        )}
        <Route
          path="/football/:compName/:loadState"
          element={<FootballDetail />}
        ></Route>
        <Route
          path="/:sportName/:compName/:loadState"
          element={<CompetitionDetail />}
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
