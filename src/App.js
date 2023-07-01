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
//TODO:Special class while game is playing.
//NOT-IMP-TODO:If match is abandoned,do some styling
// MAjOR___TODO:Make lineups responsive for various sizes
// QLI_TODO:Add a send report button while showing error and send the report to database with the path where the error happened.
// Major-TODO:Make competitionDetail page overflowing only in matches container. And make standings a table container
// MAJOR_TODO:Add features like showing info on hover using position relative and absolute on cricket innings and many other pages.
// LOVE-TO-Have: Sorting button in each stats of basketball lineups(th tag doesnt allow button element)
//LOVE-TO-HAVE: Shirt number on a shirt svg
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
