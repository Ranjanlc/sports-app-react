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

//TODO:Add Game time instead of time if the game is started
//TODO:Special class while game is playing.
//TODO:Active class on selected games
//TODO:Make the algorithm for featured matches
//TODO:Loading Component
//TODO:If match is abandoned,do some styling
// FIXME:The match time which should be in next date is in the previous for ex:if the match is in 2023-02-14 1 am,it showing 1 am in 02-13.
// TODO:If a user is in football and he clicks football icon,he is gone back to top.
function App() {
  console.log('abcd'.charAt(0).toUpperCase() + 'abcd'.slice(1));
  return (
    <Layout>
      {/* The component is side by side of Routes because it is the equivalent of Routes */}
      <Routes>
        <Route path="/" element={<Navigate to={'cricket'} replace />} />
        {['/:sportName', '/:sportName/:dateId'].map((path, id) => (
          <Route path={path} element={<ScoreList />} key={id} />
        ))}
      </Routes>
    </Layout>
  );
}

export default App;
