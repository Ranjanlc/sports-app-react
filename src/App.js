import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScoreList from './components/score/ScoreList';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ScoreList />} />
      </Routes>
    </Layout>
  );
}

export default App;
