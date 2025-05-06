import { User, Team, Player, Match, TeamStanding, PlayerPosition } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  },
  {
    id: 'user-2',
    name: 'Team Manager 1',
    email: 'manager1@example.com',
    role: 'manager',
    teamId: 'team-1'
  },
  {
    id: 'user-3',
    name: 'Player 1',
    email: 'player1@example.com',
    role: 'player',
    teamId: 'team-1'
  }
];

// Mock Teams
export const mockTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Barcelona FC',
    logo: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    coach: 'John Smith',
    description: 'One of the most successful teams in European football history.',
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date(2023, 5, 20).toISOString()
  },
  {
    id: 'team-2',
    name: 'Real Madrid',
    logo: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    coach: 'Carlos Ancelotti',
    description: 'The most successful team in UEFA Champions League history.',
    createdAt: new Date(2023, 0, 10).toISOString(),
    updatedAt: new Date(2023, 6, 5).toISOString()
  },
  {
    id: 'team-3',
    name: 'Manchester United',
    logo: 'https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    coach: 'Erik ten Hag',
    description: 'One of the most popular football clubs in the world.',
    createdAt: new Date(2023, 1, 5).toISOString(),
    updatedAt: new Date(2023, 7, 12).toISOString()
  },
  {
    id: 'team-4',
    name: 'Liverpool FC',
    logo: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    coach: 'Jürgen Klopp',
    description: 'Known for their passionate fans and rich history.',
    createdAt: new Date(2023, 2, 20).toISOString(),
    updatedAt: new Date(2023, 8, 30).toISOString()
  }
];

// Mock Players
export const mockPlayers: Player[] = [
  {
    id: 'player-1',
    name: 'Lionel Messi',
    teamId: 'team-1',
    position: 'Forward',
    stats: {
      goals: 35,
      assists: 14,
      fouls: 8
    },
    createdAt: new Date(2023, 0, 20).toISOString(),
    updatedAt: new Date(2023, 9, 15).toISOString()
  },
  {
    id: 'player-2',
    name: 'Sergio Busquets',
    teamId: 'team-1',
    position: 'Midfielder',
    stats: {
      goals: 2,
      assists: 10,
      fouls: 15
    },
    createdAt: new Date(2023, 0, 25).toISOString(),
    updatedAt: new Date(2023, 9, 20).toISOString()
  },
  {
    id: 'player-3',
    name: 'Karim Benzema',
    teamId: 'team-2',
    position: 'Forward',
    stats: {
      goals: 22,
      assists: 9,
      fouls: 12
    },
    createdAt: new Date(2023, 1, 10).toISOString(),
    updatedAt: new Date(2023, 10, 5).toISOString()
  },
  {
    id: 'player-4',
    name: 'Toni Kroos',
    teamId: 'team-2',
    position: 'Midfielder',
    stats: {
      goals: 3,
      assists: 15,
      fouls: 10
    },
    createdAt: new Date(2023, 1, 15).toISOString(),
    updatedAt: new Date(2023, 10, 10).toISOString()
  },
  {
    id: 'player-5',
    name: 'Bruno Fernandes',
    teamId: 'team-3',
    position: 'Midfielder',
    stats: {
      goals: 18,
      assists: 12,
      fouls: 14
    },
    createdAt: new Date(2023, 2, 5).toISOString(),
    updatedAt: new Date(2023, 11, 1).toISOString()
  },
  {
    id: 'player-6',
    name: 'Marcus Rashford',
    teamId: 'team-3',
    position: 'Forward',
    stats: {
      goals: 16,
      assists: 7,
      fouls: 9
    },
    createdAt: new Date(2023, 2, 10).toISOString(),
    updatedAt: new Date(2023, 11, 5).toISOString()
  },
  {
    id: 'player-7',
    name: 'Mohamed Salah',
    teamId: 'team-4',
    position: 'Forward',
    stats: {
      goals: 28,
      assists: 10,
      fouls: 7
    },
    createdAt: new Date(2023, 3, 15).toISOString(),
    updatedAt: new Date(2023, 11, 15).toISOString()
  },
  {
    id: 'player-8',
    name: 'Virgil van Dijk',
    teamId: 'team-4',
    position: 'Defender',
    stats: {
      goals: 4,
      assists: 2,
      fouls: 18
    },
    createdAt: new Date(2023, 3, 20).toISOString(),
    updatedAt: new Date(2023, 11, 20).toISOString()
  }
];

// Mock Matches
export const mockMatches: Match[] = [
  {
    id: 'match-1',
    homeTeamId: 'team-1',
    awayTeamId: 'team-2',
    date: '2023-09-15',
    time: '20:00',
    venue: 'Camp Nou',
    status: 'completed',
    result: {
      homeTeamScore: 3,
      awayTeamScore: 2,
      scorers: ['player-1', 'player-1', 'player-2', 'player-3', 'player-4']
    },
    createdAt: new Date(2023, 7, 10).toISOString(),
    updatedAt: new Date(2023, 8, 16).toISOString()
  },
  {
    id: 'match-2',
    homeTeamId: 'team-3',
    awayTeamId: 'team-4',
    date: '2023-09-20',
    time: '19:30',
    venue: 'Old Trafford',
    status: 'completed',
    result: {
      homeTeamScore: 1,
      awayTeamScore: 2,
      scorers: ['player-5', 'player-7', 'player-7']
    },
    createdAt: new Date(2023, 7, 15).toISOString(),
    updatedAt: new Date(2023, 8, 21).toISOString()
  },
  {
    id: 'match-3',
    homeTeamId: 'team-1',
    awayTeamId: 'team-3',
    date: '2023-10-05',
    time: '20:45',
    venue: 'Camp Nou',
    status: 'completed',
    result: {
      homeTeamScore: 4,
      awayTeamScore: 0,
      scorers: ['player-1', 'player-1', 'player-1', 'player-2']
    },
    createdAt: new Date(2023, 8, 1).toISOString(),
    updatedAt: new Date(2023, 9, 6).toISOString()
  },
  {
    id: 'match-4',
    homeTeamId: 'team-2',
    awayTeamId: 'team-4',
    date: '2023-10-12',
    time: '21:00',
    venue: 'Santiago Bernabeu',
    status: 'completed',
    result: {
      homeTeamScore: 2,
      awayTeamScore: 2,
      scorers: ['player-3', 'player-4', 'player-7', 'player-8']
    },
    createdAt: new Date(2023, 8, 5).toISOString(),
    updatedAt: new Date(2023, 9, 13).toISOString()
  },
  {
    id: 'match-5',
    homeTeamId: 'team-4',
    awayTeamId: 'team-1',
    date: '2023-11-15',
    time: '19:45',
    venue: 'Anfield',
    status: 'scheduled',
    createdAt: new Date(2023, 9, 1).toISOString(),
    updatedAt: new Date(2023, 9, 1).toISOString()
  },
  {
    id: 'match-6',
    homeTeamId: 'team-3',
    awayTeamId: 'team-2',
    date: '2023-11-22',
    time: '20:00',
    venue: 'Old Trafford',
    status: 'scheduled',
    createdAt: new Date(2023, 9, 5).toISOString(),
    updatedAt: new Date(2023, 9, 5).toISOString()
  }
];

// Mock Standings
export const mockStandings: TeamStanding[] = [
  {
    teamId: 'team-1',
    teamName: 'Barcelona FC',
    played: 3,
    won: 2,
    drawn: 0,
    lost: 1,
    goalsFor: 9,
    goalsAgainst: 5,
    goalDifference: 4,
    points: 6
  },
  {
    teamId: 'team-2',
    teamName: 'Real Madrid',
    played: 3,
    won: 1,
    drawn: 1,
    lost: 1,
    goalsFor: 6,
    goalsAgainst: 7,
    goalDifference: -1,
    points: 4
  },
  {
    teamId: 'team-4',
    teamName: 'Liverpool FC',
    played: 3,
    won: 1,
    drawn: 1,
    lost: 1,
    goalsFor: 6,
    goalsAgainst: 5,
    goalDifference: 1,
    points: 4
  },
  {
    teamId: 'team-3',
    teamName: 'Manchester United',
    played: 3,
    won: 0,
    drawn: 0,
    lost: 3,
    goalsFor: 1,
    goalsAgainst: 9,
    goalDifference: -8,
    points: 0
  }
];

// Function to get positions for dropdown
export const playerPositions: PlayerPosition[] = [
  'Goalkeeper',
  'Defender',
  'Midfielder',
  'Forward'
];