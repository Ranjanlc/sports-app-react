import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import FootballDetail from './pages/competition/FootballDetail';
import CompetitionDetail from './pages/competition/CompetitionDetail';
import FootballMatchDetail from './pages/footballDetail/FootballMatchDetail';
import FootballSummary from './pages/footballDetail/footballSummary/FootballSummary';
import FootballLineup from './pages/footballDetail/footballLineup/FootballLineup';
import FootballTable from './pages/footballDetail/footballTable/FootballTable';
import FootballStats from './pages/footballDetail/footballStats/FootballStats';
import FootballScore from './pages/score/FootballScore';
import CricketScore from './pages/score/CricketScore';
import BasketballScore from './pages/score/BasketballScore';
import LiveMatches from './pages/live/LiveMatches';
import CricketMatchDetail from './pages/cricketDetail/CricketMatchDetail';
import CricketInnings from './pages/cricketDetail/CricketInnings';
import CricketTable from './pages/cricketDetail/CricketTable';
import BasketballMatchDetail from './pages/basketballDetail/BasketballMatchDetail';
import BasketballLineup from './pages/basketballDetail/basketballLineup/BasketballLineup';
import BasketballStats from './pages/basketballDetail/basketballStats/BasketballStats';
import BasketballTable from './pages/basketballDetail/basketballTable/BasketballTable';

// LOVE-TO-HAVE: Sorting button in each stats of basketball lineups(th tag doesnt allow button element)
//LOVE-TO-HAVE: Shirt number on a shirt svg
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to={'football'} replace />} />
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
        <Route
          path="/football/match/:matchId"
          element={<FootballMatchDetail />}
        >
          <Route index element={<Navigate to="summary" replace />} />
          <Route path="summary" element={<FootballSummary />}></Route>
          <Route path="stats" element={<FootballStats />}></Route>
          <Route path="lineups" element={<FootballLineup />}></Route>
          <Route path="table" element={<FootballTable />}></Route>
        </Route>
        <Route path="/cricket/match/:matchId" element={<CricketMatchDetail />}>
          <Route index element={<Navigate to="innings" replace />} />
          <Route path="innings" element={<CricketInnings />} />
          <Route path="table" element={<CricketTable />}></Route>
        </Route>
        <Route
          path="/basketball/match/:matchId"
          element={<BasketballMatchDetail />}
        >
          <Route index element={<Navigate to="lineups" replace />} />
          <Route path="lineups" element={<BasketballLineup />} />
          <Route path="stats" element={<BasketballStats />} />
          <Route path="table" element={<BasketballTable />} />
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;
