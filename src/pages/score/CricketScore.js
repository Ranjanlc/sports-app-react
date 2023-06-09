import { useParams } from 'react-router-dom';
import ScoreList from '../../components/scoreList/ScoreList';

const CricketScore = (props) => {
  const { dateId } = useParams();
  return <ScoreList sportName="cricket" dateId={dateId} />;
};
export default CricketScore;
