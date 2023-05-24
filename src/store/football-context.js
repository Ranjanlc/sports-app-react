import { createContext, useState } from 'react';

const FootballContext = createContext({
  matchDetail: {},
  matchDetailHandler: () => {},
});
export const FootballContextProvider = (props) => {
  const storedMatchDetail = JSON.parse(localStorage.getItem('matchDetail'));
  const [matchDetail, setMatchDetail] = useState(storedMatchDetail || {});
  const matchDetailHandler = (matchDetail) => {
    localStorage.setItem('matchDetail', JSON.stringify(matchDetail));
    setMatchDetail(matchDetail);
  };
  const matchContainer = { matchDetail, matchDetailHandler };
  return (
    <FootballContext.Provider value={matchContainer}>
      {props.children}
    </FootballContext.Provider>
  );
};
export default FootballContext;
