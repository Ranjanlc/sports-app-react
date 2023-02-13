import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScoreList from './components/score/ScoreList';

//TODO:Add Game time instead of time if the game is started
//TODO:Special class while game is playing.
//TODO:Active class on selected games
//TODO:Make the algorithm for featured matches
//TODO:Loading Component
// FIXME:The match time which should be in next date is in the previous for ex:if the match is in 2023-02-14 1 am,it showing 1 am in 02-13.
function App() {
  console.log(new Date('2023-02-15'));
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ScoreList />} />
        <Route path="/:dateId" element={<ScoreList />} />
      </Routes>
    </Layout>
  );
}

export default App;
