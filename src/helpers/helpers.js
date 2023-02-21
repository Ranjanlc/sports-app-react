export const refineCricketScores = (homeScore, awayScore) => {
  const splittedHomeScore = homeScore !== 'Yet to bat' && homeScore?.split(' ');
  const splittedAwayScore = awayScore !== 'Yet to bat' && awayScore?.split(' ');
  if (splittedHomeScore?.length === 3 || splittedAwayScore?.length === 3) {
    const homeInnings = splittedHomeScore?.slice(0, 2).join(' ');
    const totalHomeScore = splittedHomeScore?.at(2);
    const awayInnings = splittedAwayScore?.slice(0, 2).join(' ');
    const totalAwayScore = splittedAwayScore?.at(2);
    return {
      cricketFormat: 'test',
      homeInnings,
      awayInnings,
      totalHomeScore,
      totalAwayScore,
    };
  } else {
    return { cricketFormat: 'one-day' };
  }
};
