# Ball Score

Ball Score is a web application that provides live scores and detailed information for various sports, including football, cricket, and basketball.

## Table of Contents

- Installation
- Usage
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- Components
- Hooks
- Context
- API

## Installation

To install the dependencies, run:

```sh
npm install
```

## Usage

To start the development server, run:

```sh
npm start
```

To create a production build, run:

```sh
npm run build
```

## Project Structure

```
.DS_Store
.gitignore
build/
asset-manifest.json
index.html
manifest.json
robots.txt
static/
css/
js/
media/
package.json
public/
index.html
manifest.json
robots.txt
src/
App.js
assets/
layout/
matchDetail/
scoreList/
components/
chart/
competitionMatches/
dateNav/
dropdown/
error/
featuredMatch/
matchDetail/
scoreList/
standings/
team/
UI/
helpers/
date-picker.js
helpers.js
hooks/
use-http.js
index.css
index.js
layout/
pages/
store/
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the

build

folder.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run eject`

Ejects the app from Create React App configuration.

## Components

### FeaturedMatch

Displays the featured match with details such as teams, scores, and match status.

### ScoreList

Displays a list of matches with their scores and statuses.

### CompetitionStandings

Displays the standings of teams in a competition.

## Hooks

### useHttp

A custom hook for making HTTP requests.

```js
const [data, isError, isLoading] = useHttp(query, endpoint, toFetch, reFetch);
```

## Context

### MatchContext

Provides match details and handlers for managing match state.

```js
const MatchContext = createContext({
  matchDetail: {},
  matchDetailHandler: () => {},
  statsContainer: [],
  summaryContainer: {},
  tableContainer: [],
  lineupContainer: { lineups: [], subs: [] },
  inningsContainer: [],
  matchDetailError: {
    lineupError: null,
    statsError: null,
    summaryError: null,
    tableError: null,
    inningsError: null,
  },
  setMatchDetailHandler: () => {},
  setMatchDetailError: () => {},
  clearMatchDetailHandler: () => {},
});
```

## API

The application uses a GraphQL API to fetch data. The base URL for the API is defined in

helpers.js

:

```js
export const URL = "https://main.novocreation.com/graphql";
```

### Example Query

```js
const graphqlQuery = {
  query: `
query FetchScoreList($isLive:Boolean!,$date:String!,$timeZoneDiff:String,$isCricket:Boolean!,$sportName:String!){
getMatchesList(date:$date,timeZoneDiff:$timeZoneDiff,sportName:$sportName,isLive:$isLive,isCricket:$isCricket)
{
matches {
competitionId competitionName competitionImage venue
uniqueId @include (if:$isCricket)
events {
matchId matchStatus
homeTeam {
name imageUrl
id
isBatting @include(if:$isCricket)
},awayTeam {
name imageUrl
id
isBatting @include(if:$isCricket)
}
startTime homeScore awayScore winnerTeam
note @include(if:$isCricket)
}
}
featuredMatch {
event {
matchId matchStatus
homeTeam {
name imageUrl
id
isBatting @include(if:$isCricket)
},awayTeam {
name imageUrl
id
isBatting @include(if:$isCricket)
}
startTime homeScore awayScore winnerTeam
note @include(if:$isCricket)
}
}
}
}
`,
  variables: {
    isLive: true,
    date: "2023-10-10",
    timeZoneDiff: "+05:30",
    isCricket: false,
    sportName: "football",
  },
};
```

## License

This project is licensed under the MIT License.
