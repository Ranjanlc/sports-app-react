import { useParams } from 'react-router-dom';
import ScoreList from '../../components/scoreList/ScoreList';

const BasketballScore = (props) => {
  const { dateId } = useParams();
  return <ScoreList sportName="basketball" dateId={dateId} />;
};

export default BasketballScore;
