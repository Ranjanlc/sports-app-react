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
export const convertSlugToDisplay = (slug) => {
  let refinedSlug = slug.charAt(0).toUpperCase() + slug.slice(1);
  if (slug.includes('-')) {
    const [firstString, secondString] = refinedSlug.split('-');
    refinedSlug = `${firstString}-${secondString.toUpperCase()}`;
  }
  return refinedSlug;
};

export const slugMaker = (title) => {
  return title.toLowerCase().split(' ').join('-');
};
export const convertToReadableStatus = (status) => {
  const statusMap = new Map([
    ['FT', 'Full Time'],
    ['AET', 'Full Time'],
    ['HT', 'Half Time'],
    ['NS', 'Yet to Start'],
  ]);
  return statusMap.get(status);
};
