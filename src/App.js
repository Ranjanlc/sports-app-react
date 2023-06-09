import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import ScoreList from './components/scoreList/ScoreList';
import FootballDetail from './pages/competition/FootballDetail';
import CompetitionDetail from './pages/competition/CompetitionDetail';
import MatchDetail from './pages/footballMatchDetail/matchDetail/MatchDetail';
import FootballSummary from './pages/footballMatchDetail/footballSummary/FootballSummary';
import FootballLineup from './pages/footballMatchDetail/footballLineup/FootballLineup';
import FootballTable from './pages/footballMatchDetail/footballTable/FootballTable';
import FootballStats from './pages/footballMatchDetail/footballStats/FootballStats';
import FootballScore from './pages/score/FootballScore';
import CricketScore from './pages/score/CricketScore';
import BasketballScore from './pages/score/BasketballScore';
import LiveMatches from './pages/live/LiveMatches';
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
        {/* {['/:sportName', '/:sportName/:dateId'].map((path, id) => (
          <Route path={path} element={<ScoreList />} key={id} />
        ))} */}
        <Route path="/:sportName/live" element={<LiveMatches />} />
        <Route path="/football/:dateId?" element={<FootballScore />}></Route>
        <Route path="/cricket/:dateId?" element={<CricketScore />}></Route>
        <Route
          path="/basketball/:dateId?"
          element={<BasketballScore />}
        ></Route>
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
