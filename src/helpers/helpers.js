// export const URL = "http://localhost:8080/graphql"; //
export const URL = "https://main.novocreation.com/graphql";

export const refineCricketScores = (homeScore, awayScore) => {
  const splittedHomeScore = homeScore !== "Yet to bat" && homeScore?.split(" ");
  const splittedAwayScore = awayScore !== "Yet to bat" && awayScore?.split(" ");
  if (splittedHomeScore?.length === 3 || splittedAwayScore?.length === 3) {
    const homeInnings = splittedHomeScore?.slice(0, 2).join("");
    const totalHomeScore = splittedHomeScore?.at(2);
    const awayInnings = splittedAwayScore?.slice(0, 2).join("");
    const totalAwayScore = splittedAwayScore?.at(2);
    return {
      cricketFormat: "test",
      homeInnings,
      awayInnings,
      totalHomeScore,
      totalAwayScore,
    };
  } else {
    return { cricketFormat: "one-day" };
  }
};
export const convertSlugToDisplay = (slug) => {
  let refinedSlug = slug.charAt(0).toUpperCase() + slug.slice(1);
  if (slug.includes("-")) {
    const [firstString, secondString] = refinedSlug.split("-");
    refinedSlug = `${firstString}-${secondString.toUpperCase()}`;
  }
  return refinedSlug;
};

export const slugMaker = (title) => {
  return title.toLowerCase().split(" ").join("-");
};
export const convertToReadableStatus = (status) => {
  const statusMap = new Map([
    ["FT", "Full Time"],
    ["AET", "Full Time"],
    ["HT", "Half Time"],
    ["NS", "Yet to Start"],
  ]);
  return statusMap.get(status);
};
export const matchClickHandler = (
  matchDetail,
  matchDetailHandler,
  clearMatchDetailHandler,
  navigate,
  sport
) => {
  clearMatchDetailHandler();
  const { matchId } = matchDetail;
  matchDetailHandler(matchDetail);
  navigate(`/${sport}/match/${matchId}`);
};
export const checkGreaterStat = (home, away, type) => {
  if (type === "lead") {
    if (home.includes(":")) {
      const [min, homeSec] = home.split(":");
      const [awayMin, awaySec] = away.split(":");
      const homeTotalSec = parseInt(min) * 60 + parseInt(homeSec);
      const awayTotalSec = parseInt(awayMin) * 60 + parseInt(awaySec);
      return {
        homeGreater: homeTotalSec > awayTotalSec,
        awayGreater: awayTotalSec > homeTotalSec,
      };
    }
    return {
      homeGreater: parseInt(home) > parseInt(away),
      awayGreater: parseInt(away) > parseInt(home),
    };
  }
  if (type === "scoring") {
    const homePct = home.split("(")[1];
    const awayPct = away.split("(")[1];
    return {
      homeGreater: parseInt(homePct) > parseInt(awayPct),
      awayGreater: parseInt(awayPct) > parseInt(homePct),
    };
  }
};
export const getFullPosition = (position) => {
  const positionMap = new Map([
    ["FC", "Forward-Center"],
    ["F", "Forward"],
    ["G", "Guard"],
    ["FG", "Forward-Guard"],
    ["CF", "Center-Forward"],
    ["GF", "Guard-Forward"],
    ["C", "Center"],
  ]);
  return positionMap.get(position);
};
