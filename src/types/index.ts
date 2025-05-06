// User Types
export type UserRole = 'admin' | 'manager' | 'player';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string; // For managers and players
}

// Team Types
export interface Team {
  id: string;
  name: string;
  logo: string;
  coach: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Player Types
export type PlayerPosition = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';

export interface PlayerStats {
  goals: number;
  assists: number;
  fouls: number;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  team?: Team;
  position: PlayerPosition;
  stats: PlayerStats;
  createdAt: string;
  updatedAt: string;
}

// Match Types
export type MatchStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface MatchResult {
  homeTeamScore: number;
  awayTeamScore: number;
  scorers: string[]; // Player IDs who scored
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeam?: Team;
  awayTeam?: Team;
  date: string;
  time: string;
  venue: string;
  status: MatchStatus;
  result?: MatchResult;
  createdAt: string;
  updatedAt: string;
}

// Standings Types
export interface TeamStanding {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}