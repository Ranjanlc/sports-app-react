import { useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useRoutes,
} from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScoreList from './components/score/ScoreList';
import FootballDetail from './components/competition/FootballDetail';
import CompetitionDetail from './components/competition/CompetitionDetail';
//TODO:Special class while game is playing.
//TODO:Make the algorithm for featured matches
//TODO:If match is abandoned,do some styling
// FIXME:The match time which should be in next date is in the previous for ex:if the match is in 2023-02-14 1 am,it showing 1 am in 02-13.
// TODO:If a user is in football and he clicks football icon,he is gone back to top.
function App() {
  const [competitionDetail, setCompetitionDetail] = useState(null);
  const changeCompetition = (competitionSet) => {
    console.log('aayo aayo', competitionSet);
    setCompetitionDetail(competitionSet);
  };
  return (
    <Layout>
      <Routes>
        {/* <Route path="/" element={<Navigate to={'cricket'} replace />} /> */}
        <Route path="/" element={<Navigate to={'cricket'} replace />} />
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
      </Routes>
    </Layout>
  );
}

export default App;
