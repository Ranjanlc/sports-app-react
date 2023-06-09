import { useParams } from 'react-router-dom';
import ScoreList from '../../components/scoreList/ScoreList';

const FootballScore = (props) => {
  const { dateId } = useParams();
  return <ScoreList sportName="football" dateId={dateId} />;
};

export default FootballScore;
