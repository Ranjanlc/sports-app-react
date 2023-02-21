import classes from './CompetitionDetail.module.css';
import StarJsx from '../../assets/star-jsx';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import dummyLogo from '../../assets/dummy-logo.png';
import { competitionDateHandler } from '../../helpers/date-picker';
import LoadingSpinner from '../UI/LoadingSpinner';
import { refineCricketScores } from '../../helpers/helpers';
import Dropdown from '../layout/Dropdown';
const CompetitionDetail = (props) => {
  const URL = 'http://localhost:8080/graphql';
  const navigate = useNavigate();
  const { loadState, sportName } = useParams();
  const { pathname } = useLocation();
  const urlState = pathname.split('/').slice(-1).at(0);
  const [matches, setMatches] = useState(null);
  const [matchState, setMatchState] = useState(loadState);
  const [standings, setStandings] = useState();
  const [page, setPage] = useState(0);
  const [seasonId, setSeasonId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [curGroup, setCurGroup] = useState(null);
  const [groupContainer, setGroupContainer] = useState(null);
  //   const [groupContainer, setGroupContainer] = useState(null);
  //   const DUMMY_MATCHES = [
  //     {
  //       homeTeam: {
  //         name: 'Indiana Pacers',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3419/image',
  //       },
  //       awayTeam: {
  //         name: 'Boston Celtics',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3422/image',
  //       },
  //       matchId: '10601895',
  //       matchStatus: 'Not started',
  //       startTime: '2023-2-24 0:0:0',
  //       homeScore: null,
  //       awayScore: null,
  //       winnerTeam: null,
  //     },
  //     {
  //       homeTeam: {
  //         name: 'Cleveland Cavaliers',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3432/image',
  //       },
  //       awayTeam: {
  //         name: 'Denver Nuggets',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3417/image',
  //       },
  //       matchId: '10600446',
  //       matchStatus: 'Not started',
  //       startTime: '2023-2-24 0:0:0',
  //       homeScore: null,
  //       awayScore: null,
  //       winnerTeam: null,
  //     },
  //     {
  //       homeTeam: {
  //         name: 'Orlando Magic',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3437/image',
  //       },
  //       awayTeam: {
  //         name: 'Detroit Pistons',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3424/image',
  //       },
  //       matchId: '10601963',
  //       matchStatus: 'Not started',
  //       startTime: '2023-2-24 0:0:0',
  //       homeScore: null,
  //       awayScore: null,
  //       winnerTeam: null,
  //     },
  //     {
  //       homeTeam: {
  //         name: 'Dallas Mavericks',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3411/image',
  //       },
  //       awayTeam: {
  //         name: 'San Antonio Spurs',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3429/image',
  //       },
  //       matchId: '10600592',
  //       matchStatus: 'Not started',
  //       startTime: '2023-2-24 1:30:0',
  //       homeScore: null,
  //       awayScore: null,
  //       winnerTeam: null,
  //     },
  //     {
  //       homeTeam: {
  //         name: 'Utah Jazz',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3434/image',
  //       },
  //       awayTeam: {
  //         name: 'Oklahoma City Thunder',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3418/image',
  //       },
  //       matchId: '10601896',
  //       matchStatus: 'Not started',
  //       startTime: '2023-2-24 2:0:0',
  //       homeScore: null,
  //       awayScore: null,
  //       winnerTeam: null,
  //     },
  //     {
  //       homeTeam: {
  //         name: 'Los Angeles Lakers',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3427/image',
  //       },
  //       awayTeam: {
  //         name: 'Golden State Warriors',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3428/image',
  //       },
  //       matchId: '10601975',
  //       matchStatus: 'Not started',
  //       startTime: '2023-2-24 3:0:0',
  //       homeScore: null,
  //       awayScore: null,
  //       winnerTeam: null,
  //     },
  //     {
  //       homeTeam: {
  //         name: 'Sacramento Kings',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3413/image',
  //       },
  //       awayTeam: {
  //         name: 'Portland Trail Blazers',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3414/image',
  //       },
  //       matchId: '10600792',
  //       matchStatus: 'Not started',
  //       startTime: '2023-2-24 3:0:0',
  //       homeScore: null,
  //       awayScore: null,
  //       winnerTeam: null,
  //     },
  //     {
  //       homeTeam: {
  //         name: 'Washington Wizards',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3431/image',
  //       },
  //       awayTeam: {
  //         name: 'New York Knicks',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3421/image',
  //       },
  //       matchId: '10600518',
  //       matchStatus: 'Not started',
  //       startTime: '2023-2-25 0:0:0',
  //       homeScore: null,
  //       awayScore: null,
  //       winnerTeam: null,
  //     },
  //     {
  //       homeTeam: {
  //         name: 'Milwaukee Bucks',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3410/image',
  //       },
  //       awayTeam: {
  //         name: 'Miami Heat',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3435/image',
  //       },
  //       matchId: '10600727',
  //       matchStatus: 'Not started',
  //       startTime: '2023-2-25 0:30:0',
  //       homeScore: null,
  //       awayScore: null,
  //       winnerTeam: null,
  //     },
  //     {
  //       homeTeam: {
  //         name: 'Atlanta Hawks',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3423/image',
  //       },
  //       awayTeam: {
  //         name: 'Cleveland Cavaliers',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3432/image',
  //       },
  //       matchId: '10601916',
  //       matchStatus: 'Not started',
  //       startTime: '2023-2-25 0:30:0',
  //       homeScore: null,
  //       awayScore: null,
  //       winnerTeam: null,
  //     },
  //     {
  //       homeTeam: {
  //         name: 'Chicago Bulls',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3409/image',
  //       },
  //       awayTeam: {
  //         name: 'Brooklyn Nets',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3436/image',
  //       },
  //       matchId: '10600537',
  //       matchStatus: 'Not started',
  //       startTime: '2023-2-25 1:0:0',
  //       homeScore: null,
  //       awayScore: null,
  //       winnerTeam: null,
  //     },
  //     {
  //       homeTeam: {
  //         name: 'Minnesota Timberwolves',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3426/image',
  //       },
  //       awayTeam: {
  //         name: 'Charlotte Hornets',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3430/image',
  //       },
  //       matchId: '10600743',
  //       matchStatus: 'Not started',
  //       startTime: '2023-2-25 1:0:0',
  //       homeScore: null,
  //       awayScore: null,
  //       winnerTeam: null,
  //     },
  //     {
  //       homeTeam: {
  //         name: 'Golden State Warriors',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3428/image',
  //       },
  //       awayTeam: {
  //         name: 'Houston Rockets',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3412/image',
  //       },
  //       matchId: '10600602',
  //       matchStatus: 'Not started',
  //       startTime: '2023-2-25 3:0:0',
  //       homeScore: null,
  //       awayScore: null,
  //       winnerTeam: null,
  //     },
  //     {
  //       homeTeam: {
  //         name: 'Phoenix Suns',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3416/image',
  //       },
  //       awayTeam: {
  //         name: 'Oklahoma City Thunder',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3418/image',
  //       },
  //       matchId: '10601878',
  //       matchStatus: 'Not started',
  //       startTime: '2023-2-25 3:0:0',
  //       homeScore: null,
  //       awayScore: null,
  //       winnerTeam: null,
  //     },
  //     {
  //       homeTeam: {
  //         name: 'Los Angeles Clippers',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3425/image',
  //       },
  //       awayTeam: {
  //         name: 'Sacramento Kings',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3413/image',
  //       },
  //       matchId: '10600512',
  //       matchStatus: 'Not started',
  //       startTime: '2023-2-25 3:30:0',
  //       homeScore: null,
  //       awayScore: null,
  //       winnerTeam: null,
  //     },
  //     {
  //       homeTeam: {
  //         name: 'Detroit Pistons',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3424/image',
  //       },
  //       awayTeam: {
  //         name: 'Toronto Raptors',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3433/image',
  //       },
  //       matchId: '10601856',
  //       matchStatus: 'Not started',
  //       startTime: '2023-2-25 17:0:0',
  //       homeScore: null,
  //       awayScore: null,
  //       winnerTeam: null,
  //     },
  //     {
  //       homeTeam: {
  //         name: 'Charlotte Hornets',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3430/image',
  //       },
  //       awayTeam: {
  //         name: 'Miami Heat',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3435/image',
  //       },
  //       matchId: '10602086',
  //       matchStatus: 'Not started',
  //       startTime: '2023-2-26 0:0:0',
  //       homeScore: null,
  //       awayScore: null,
  //       winnerTeam: null,
  //     },
  //     {
  //       homeTeam: {
  //         name: 'Orlando Magic',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3437/image',
  //       },
  //       awayTeam: {
  //         name: 'Indiana Pacers',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3419/image',
  //       },
  //       matchId: '10602081',
  //       matchStatus: 'Not started',
  //       startTime: '2023-2-26 0:0:0',
  //       homeScore: null,
  //       awayScore: null,
  //       winnerTeam: null,
  //     },
  //     {
  //       homeTeam: {
  //         name: 'New York Knicks',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/3421/image',
  //       },
  //       awayTeam: {
  //         name: 'New Orleans Pelicans',
  //         imageUrl: 'https://api.sofascore.app/api/v1/team/5539/image',
  //       },
  //       matchId: '10600401',
  //       matchStatus: 'Not started',
  //       startTime: '2023-2-26 0:30:0',
  //       homeScore: null,
  //       awayScore: null,
  //       winnerTeam: null,
  //     },
  //   ];
  //   const DUMMY_STANDINGS = [
  //     {
  //       groupName: 'Eastern Conference',
  //       standings: [
  //         {
  //           name: 'Boston Celtics',
  //           teamId: '3422',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3422/image',
  //           position: 1,
  //           played: 59,
  //           wins: 42,
  //           losses: 17,
  //           points: null,
  //           percentage: 0.712,
  //         },
  //         {
  //           name: 'Milwaukee Bucks',
  //           teamId: '3410',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3410/image',
  //           position: 2,
  //           played: 58,
  //           wins: 41,
  //           losses: 17,
  //           points: null,
  //           percentage: 0.707,
  //         },
  //         {
  //           name: 'Philadelphia 76ers',
  //           teamId: '3420',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3420/image',
  //           position: 3,
  //           played: 57,
  //           wins: 38,
  //           losses: 19,
  //           points: null,
  //           percentage: 0.667,
  //         },
  //         {
  //           name: 'Cleveland Cavaliers',
  //           teamId: '3432',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3432/image',
  //           position: 4,
  //           played: 61,
  //           wins: 38,
  //           losses: 23,
  //           points: null,
  //           percentage: 0.623,
  //         },
  //         {
  //           name: 'Brooklyn Nets',
  //           teamId: '3436',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3436/image',
  //           position: 5,
  //           played: 58,
  //           wins: 34,
  //           losses: 24,
  //           points: null,
  //           percentage: 0.586,
  //         },
  //         {
  //           name: 'New York Knicks',
  //           teamId: '3421',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3421/image',
  //           position: 6,
  //           played: 60,
  //           wins: 33,
  //           losses: 27,
  //           points: null,
  //           percentage: 0.55,
  //         },
  //       ],
  //     },
  //     {
  //       groupName: 'Western Conference',
  //       standings: [
  //         {
  //           name: 'Denver Nuggets',
  //           teamId: '3417',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3417/image',
  //           position: 1,
  //           played: 59,
  //           wins: 41,
  //           losses: 18,
  //           points: null,
  //           percentage: 0.695,
  //         },
  //         {
  //           name: 'Memphis Grizzlies',
  //           teamId: '3415',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3415/image',
  //           position: 2,
  //           played: 57,
  //           wins: 35,
  //           losses: 22,
  //           points: null,
  //           percentage: 0.614,
  //         },
  //         {
  //           name: 'Sacramento Kings',
  //           teamId: '3413',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3413/image',
  //           position: 3,
  //           played: 57,
  //           wins: 32,
  //           losses: 25,
  //           points: null,
  //           percentage: 0.561,
  //         },
  //         {
  //           name: 'Los Angeles Clippers',
  //           teamId: '3425',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3425/image',
  //           position: 4,
  //           played: 61,
  //           wins: 33,
  //           losses: 28,
  //           points: null,
  //           percentage: 0.541,
  //         },
  //         {
  //           name: 'Phoenix Suns',
  //           teamId: '3416',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3416/image',
  //           position: 5,
  //           played: 60,
  //           wins: 32,
  //           losses: 28,
  //           points: null,
  //           percentage: 0.533,
  //         },
  //         {
  //           name: 'Dallas Mavericks',
  //           teamId: '3411',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3411/image',
  //           position: 6,
  //           played: 60,
  //           wins: 31,
  //           losses: 29,
  //           points: null,
  //           percentage: 0.517,
  //         },
  //         {
  //           name: 'New Orleans Pelicans',
  //           teamId: '5539',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/5539/image',
  //           position: 7,
  //           played: 59,
  //           wins: 30,
  //           losses: 29,
  //           points: null,
  //           percentage: 0.508,
  //         },
  //         {
  //           name: 'Minnesota Timberwolves',
  //           teamId: '3426',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3426/image',
  //           position: 8,
  //           played: 61,
  //           wins: 31,
  //           losses: 30,
  //           points: null,
  //           percentage: 0.508,
  //         },
  //       ],
  //     },
  //     {
  //       groupName: 'Central Division',
  //       standings: [
  //         {
  //           name: 'Milwaukee Bucks',
  //           teamId: '3410',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3410/image',
  //           position: 1,
  //           played: 58,
  //           wins: 41,
  //           losses: 17,
  //           points: null,
  //           percentage: 0.707,
  //         },
  //         {
  //           name: 'Cleveland Cavaliers',
  //           teamId: '3432',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3432/image',
  //           position: 2,
  //           played: 61,
  //           wins: 38,
  //           losses: 23,
  //           points: null,
  //           percentage: 0.623,
  //         },
  //         {
  //           name: 'Chicago Bulls',
  //           teamId: '3409',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3409/image',
  //           position: 3,
  //           played: 59,
  //           wins: 26,
  //           losses: 33,
  //           points: null,
  //           percentage: 0.441,
  //         },
  //         {
  //           name: 'Indiana Pacers',
  //           teamId: '3419',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3419/image',
  //           position: 4,
  //           played: 60,
  //           wins: 26,
  //           losses: 34,
  //           points: null,
  //           percentage: 0.433,
  //         },
  //         {
  //           name: 'Detroit Pistons',
  //           teamId: '3424',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3424/image',
  //           position: 5,
  //           played: 59,
  //           wins: 15,
  //           losses: 44,
  //           points: null,
  //           percentage: 0.254,
  //         },
  //       ],
  //     },
  //     {
  //       groupName: 'Atlantic Division',
  //       standings: [
  //         {
  //           name: 'Boston Celtics',
  //           teamId: '3422',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3422/image',
  //           position: 1,
  //           played: 59,
  //           wins: 42,
  //           losses: 17,
  //           points: null,
  //           percentage: 0.712,
  //         },
  //         {
  //           name: 'Philadelphia 76ers',
  //           teamId: '3420',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3420/image',
  //           position: 2,
  //           played: 57,
  //           wins: 38,
  //           losses: 19,
  //           points: null,
  //           percentage: 0.667,
  //         },
  //         {
  //           name: 'Brooklyn Nets',
  //           teamId: '3436',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3436/image',
  //           position: 3,
  //           played: 58,
  //           wins: 34,
  //           losses: 24,
  //           points: null,
  //           percentage: 0.586,
  //         },
  //         {
  //           name: 'New York Knicks',
  //           teamId: '3421',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3421/image',
  //           position: 4,
  //           played: 60,
  //           wins: 33,
  //           losses: 27,
  //           points: null,
  //           percentage: 0.55,
  //         },
  //         {
  //           name: 'Toronto Raptors',
  //           teamId: '3433',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3433/image',
  //           position: 5,
  //           played: 59,
  //           wins: 28,
  //           losses: 31,
  //           points: null,
  //           percentage: 0.475,
  //         },
  //       ],
  //     },
  //     {
  //       groupName: 'Southeast Division',
  //       standings: [
  //         {
  //           name: 'Miami Heat',
  //           teamId: '3435',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3435/image',
  //           position: 1,
  //           played: 59,
  //           wins: 32,
  //           losses: 27,
  //           points: null,
  //           percentage: 0.542,
  //         },
  //         {
  //           name: 'Atlanta Hawks',
  //           teamId: '3423',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3423/image',
  //           position: 2,
  //           played: 59,
  //           wins: 29,
  //           losses: 30,
  //           points: null,
  //           percentage: 0.492,
  //         },
  //         {
  //           name: 'Washington Wizards',
  //           teamId: '3431',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3431/image',
  //           position: 3,
  //           played: 58,
  //           wins: 28,
  //           losses: 30,
  //           points: null,
  //           percentage: 0.483,
  //         },
  //         {
  //           name: 'Orlando Magic',
  //           teamId: '3437',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3437/image',
  //           position: 4,
  //           played: 59,
  //           wins: 24,
  //           losses: 35,
  //           points: null,
  //           percentage: 0.407,
  //         },
  //         {
  //           name: 'Charlotte Hornets',
  //           teamId: '3430',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3430/image',
  //           position: 5,
  //           played: 60,
  //           wins: 17,
  //           losses: 43,
  //           points: null,
  //           percentage: 0.283,
  //         },
  //       ],
  //     },
  //     {
  //       groupName: 'NBA 22/23',
  //       standings: [
  //         {
  //           name: 'Boston Celtics',
  //           teamId: '3422',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3422/image',
  //           position: 1,
  //           played: 59,
  //           wins: 42,
  //           losses: 17,
  //           points: null,
  //           percentage: 0.712,
  //         },
  //         {
  //           name: 'Milwaukee Bucks',
  //           teamId: '3410',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3410/image',
  //           position: 2,
  //           played: 58,
  //           wins: 41,
  //           losses: 17,
  //           points: null,
  //           percentage: 0.707,
  //         },
  //         {
  //           name: 'Denver Nuggets',
  //           teamId: '3417',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3417/image',
  //           position: 3,
  //           played: 59,
  //           wins: 41,
  //           losses: 18,
  //           points: null,
  //           percentage: 0.695,
  //         },
  //         {
  //           name: 'Philadelphia 76ers',
  //           teamId: '3420',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3420/image',
  //           position: 4,
  //           played: 57,
  //           wins: 38,
  //           losses: 19,
  //           points: null,
  //           percentage: 0.667,
  //         },
  //         {
  //           name: 'Cleveland Cavaliers',
  //           teamId: '3432',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3432/image',
  //           position: 5,
  //           played: 61,
  //           wins: 38,
  //           losses: 23,
  //           points: null,
  //           percentage: 0.623,
  //         },
  //         {
  //           name: 'Memphis Grizzlies',
  //           teamId: '3415',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3415/image',
  //           position: 6,
  //           played: 57,
  //           wins: 35,
  //           losses: 22,
  //           points: null,
  //           percentage: 0.614,
  //         },
  //         {
  //           name: 'Brooklyn Nets',
  //           teamId: '3436',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3436/image',
  //           position: 7,
  //           played: 58,
  //           wins: 34,
  //           losses: 24,
  //           points: null,
  //           percentage: 0.586,
  //         },
  //         {
  //           name: 'Sacramento Kings',
  //           teamId: '3413',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3413/image',
  //           position: 8,
  //           played: 57,
  //           wins: 32,
  //           losses: 25,
  //           points: null,
  //           percentage: 0.561,
  //         },
  //         {
  //           name: 'New York Knicks',
  //           teamId: '3421',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3421/image',
  //           position: 9,
  //           played: 60,
  //           wins: 33,
  //           losses: 27,
  //           points: null,
  //           percentage: 0.55,
  //         },
  //         {
  //           name: 'Miami Heat',
  //           teamId: '3435',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3435/image',
  //           position: 10,
  //           played: 59,
  //           wins: 32,
  //           losses: 27,
  //           points: null,
  //           percentage: 0.542,
  //         },
  //         {
  //           name: 'Los Angeles Clippers',
  //           teamId: '3425',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3425/image',
  //           position: 11,
  //           played: 61,
  //           wins: 33,
  //           losses: 28,
  //           points: null,
  //           percentage: 0.541,
  //         },
  //         {
  //           name: 'Phoenix Suns',
  //           teamId: '3416',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3416/image',
  //           position: 12,
  //           played: 60,
  //           wins: 32,
  //           losses: 28,
  //           points: null,
  //           percentage: 0.533,
  //         },
  //         {
  //           name: 'Dallas Mavericks',
  //           teamId: '3411',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3411/image',
  //           position: 13,
  //           played: 60,
  //           wins: 31,
  //           losses: 29,
  //           points: null,
  //           percentage: 0.517,
  //         },
  //         {
  //           name: 'New Orleans Pelicans',
  //           teamId: '5539',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/5539/image',
  //           position: 14,
  //           played: 59,
  //           wins: 30,
  //           losses: 29,
  //           points: null,
  //           percentage: 0.508,
  //         },
  //         {
  //           name: 'Minnesota Timberwolves',
  //           teamId: '3426',
  //           teamImageUrl: 'https://api.sofascore.app/api/v1/team/3426/image',
  //           position: 15,
  //           played: 61,
  //           wins: 31,
  //           losses: 30,
  //           points: null,
  //           percentage: 0.508,
  //         },
  //       ],
  //     },
  //   ];
  let competitionSet;
  // For the case if user reloads the page from FootballDetail page.
  if (props.competitionSet) {
    competitionSet = props.competitionSet;
    localStorage.setItem(
      'competitionSet',
      JSON.stringify(props.competitionSet)
    );
  }
  if (!props.competitionSet) {
    competitionSet = JSON.parse(localStorage.getItem('competitionSet'));
  }
  const { competitionName, venue, competitionImage, competitionId, uniqueId } =
    competitionSet;

  const backClickHandler = () => {
    navigate(-1);
  };
  const sportForApi = `get${
    sportName.charAt(0).toUpperCase() + sportName.slice(1)
  }Details`;
  const compOrUniqueId =
    sportName === 'cricket'
      ? `compId:${competitionId}`
      : `uniqueId:${uniqueId}`;
  const graphqlQuery = {
    query: `
    {
        ${sportForApi}(${
      sportName === 'cricket'
        ? `compId:${competitionId},uniqueId:${uniqueId}`
        : `uniqueId:${competitionId}`
    },appSeasonId:${seasonId},page:${page} dateState:"${
      matchState === 'fixtures' ? 'next' : 'last'
    }") {
            matchSet {
                matches {
                    homeTeam {
                    name imageUrl
                    }
                    awayTeam {
                        name imageUrl
                    } matchId matchStatus startTime homeScore awayScore winnerTeam ${
                      sportName === 'cricket' ? 'note' : ''
                    }
                } hasNextPage
            } 
            standingSet {
                groupName
                standings {
                name teamId teamImageUrl position played wins losses points
                ${sportName === 'basketball' ? 'percentage' : 'netRunRate'}
              }       
            }
       }
    }`,
  };
  const fetchCompDetails = useCallback(async () => {
    const res = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify(graphqlQuery),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const {
      data: {
        [sportForApi]: {
          matchSet: { matches, hasNextPage },
          standingSet,
        },
      },
    } = await res.json();
    console.log(matches, standingSet);
    setMatches(matches);
    setStandings(standingSet);
    if (standingSet.length > 1) {
      const groupSet = standingSet.map((set) => set.groupName);
      setGroupContainer(groupSet);
      //   Setting first element to show in first
      setCurGroup(groupSet[0]);
    }
    setIsLoading(false);
  }, []);
  useEffect(() => {
    fetchCompDetails();
  }, [fetchCompDetails]);
  const groupChangeHandler = (option) => {
    setCurGroup(option);
  };
  const matchStateChangeHandler = (state, e) => {
    // To replace fixtures/results with results/fixtures resp.
    const baseUrl = pathname.split('/').slice(0, -1).join('/');
    if (state === 'fixtures' && urlState !== 'fixtures') {
      setMatchState('fixtures');
      navigate(`${baseUrl}/fixtures`);
    }
    if (state === 'results' && urlState !== 'results') {
      setMatchState('results');
      navigate(`${baseUrl}/results`);
    }
  };
  const events =
    matches &&
    matches.map((event) => {
      const {
        matchId,
        matchStatus,
        startTime,
        awayScore,
        homeScore,
        homeTeam: {
          imageUrl: homeImageUrl,
          name: homeTeamName,
          isBatting: homeIsBatting,
        },
        awayTeam: {
          imageUrl: awayImageUrl,
          name: awayTeamName,
          isBatting: awayIsBatting,
        },
      } = event;
      const homeUrl = homeImageUrl.includes('undefined')
        ? dummyLogo
        : homeImageUrl;
      const awayUrl = awayImageUrl.includes('undefined')
        ? dummyLogo
        : awayImageUrl;
      const { displayTime, displayDate } = competitionDateHandler(startTime);
      const {
        cricketFormat,
        homeInnings,
        awayInnings,
        totalAwayScore,
        totalHomeScore,
      } =
        sportName === 'cricket'
          ? refineCricketScores(homeScore, awayScore)
          : {}; //object coz undefined would produce an error.
      const displayScore =
        sportName === 'cricket' && cricketFormat === 'test' ? (
          <div className={classes.score}>
            <div className={classes['first-score']}>
              <span className={classes.innings}>{homeInnings}</span>
              <span className={classes.total}>{totalHomeScore}</span>
            </div>
            <div className={classes['second-score']}>
              <span className={classes.innings}>{awayInnings}</span>
              <span className={classes.total}>{totalAwayScore}</span>
            </div>
          </div>
        ) : (
          // Will reach here either it is one-day-cricket or basketball
          <div className={classes.score}>
            <div className={classes['first-score']}>{homeScore}</div>
            <div className={classes['second-score']}>{awayScore}</div>
          </div>
        );
      return (
        <div className={classes['match-item']} key={matchId}>
          <div className={classes.lhs}>
            <div className={classes['date-container']}>
              <div className={classes.date}>{displayDate}</div>
              <div className={classes.time}>
                {matchState === 'fixtures' ? displayTime : matchStatus}
              </div>
            </div>
            <div className={classes.teams}>
              <div>
                <img src={homeUrl} alt="Home" />
                {homeTeamName}
              </div>
              <div>
                <img src={awayUrl} alt="Away" />
                {awayTeamName}
              </div>
            </div>
          </div>
          <div className={classes.rhs}>
            {!(
              matchStatus === 'Not Started' ||
              matchStatus === 'Interrupted' ||
              matchStatus === 'Abandoned' ||
              matchStatus === 'Postponed'
            ) && displayScore}
            <StarJsx />
          </div>
        </div>
      );
    });
  // TODO:Address the situation when there is no standings or there is a group-wise standings.
  const curStandingSet = groupContainer
    ? standings.find((standingData) => standingData.groupName === curGroup)
    : standings?.at(0);
  const curStandings = curStandingSet?.standings;
  console.log(curStandings);
  //   To check if point data exists.
  const pointExists = curStandings?.at(0).points;
  //   console.log(pointExists);

  const standingList = curStandings?.map((teamData) => {
    const {
      position,
      name,
      teamId,
      teamImageUrl,
      wins,
      draws,
      losses,
      played,
      percentage,
      netRunRate,
      points,
    } = teamData;
    return (
      <article className={classes['team-data']}>
        <div className={classes['team-data__details']}>
          <span className={classes.position}>{position}</span>
          <span className={classes.name}>
            <img src={teamImageUrl} alt="" />
            {name}
          </span>
        </div>
        <span>{played}</span>
        <span>{wins}</span>
        <span>{losses}</span>
        {sportName === 'cricket' ? (
          <span>{netRunRate}</span>
        ) : (
          <span>{percentage}</span>
        )}
        {points && <span>{points}</span>}
      </article>
    );
  });

  return (
    <Fragment>
      <div className={classes['title-container']}>
        <span className={classes.arrow} onClick={backClickHandler}>
          &#8592;
        </span>
        <div className={classes.name}>
          <img src={competitionImage} alt="Flag" />
          <div className={classes.title}>
            <span className={classes.competition}>{competitionName}</span>
            <span className={classes.country}>{venue}</span>
          </div>
          <StarJsx />
        </div>
      </div>
      <nav className={classes.navigation}>
        <div className={classes['navigation--matches']}>
          <span>Matches</span>
        </div>
        <div className={classes.standings}>Standings</div>
      </nav>
      <div className={classes['container']}>
        <div className={classes['matches-container']}>
          {/* <hr /> */}
          <div className={classes['state-container']}>
            <div
              className={`${classes.state} ${
                urlState === 'fixtures' && classes.active
              }`}
              onClick={matchStateChangeHandler.bind(null, 'fixtures')}
            >
              Fixtures
            </div>
            <div
              className={`${classes.state} ${
                urlState === 'results' && classes.active
              }`}
              onClick={matchStateChangeHandler.bind(null, 'results')}
            >
              Results
            </div>
          </div>
          {isLoading && (
            <div className="centered">
              <LoadingSpinner />
            </div>
          )}
          {!isLoading && <Fragment>{events}</Fragment>}
        </div>
        <div className={classes.table}>
          {groupContainer && (
            <div className={classes.dropdown}>
              <Dropdown
                optionSet={groupContainer}
                groupChangeHandler={groupChangeHandler}
              />
            </div>
          )}
          {isLoading && (
            <div className="centered">
              <LoadingSpinner />
            </div>
          )}
          {!isLoading && (
            <Fragment>
              <header className={classes.header}>
                <div className={classes['team-details']}>
                  <span>#</span>
                  <span className={classes['header-name']}>Team</span>
                </div>
                <span>P</span>
                <span>W</span>
                <span>L</span>
                {sportName === 'cricket' ? <span>NRR</span> : <span>PCT</span>}
                {pointExists && <span>Pts</span>}
              </header>
              <hr />
              {standingList}
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default CompetitionDetail;
