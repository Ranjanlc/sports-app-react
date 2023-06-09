import { useParams } from 'react-router-dom';
import ScoreList from '../../components/scoreList/ScoreList';

const LiveMatches = (props) => {
  const { sportName } = useParams();
  return <ScoreList sportName={sportName} isLive={true} dateId={null} />;
};
export default LiveMatches;
