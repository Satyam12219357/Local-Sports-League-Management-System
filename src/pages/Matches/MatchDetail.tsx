import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Clock, MapPin, Trophy, Users } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Match, Team, Player } from '../../types';
import { mockMatches, mockTeams, mockPlayers } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

const MatchDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  
  const [match, setMatch] = useState<Match | null>(null);
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);
  const [scorers, setScorers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  
  const canManageMatches = hasRole(['admin', 'manager']);

  useEffect(() => {
    // Fetch match
    const foundMatch = mockMatches.find(match => match.id === id);
    if (!foundMatch) {
      navigate('/matches');
      return;
    }
    
    // Fetch teams
    const home = mockTeams.find(team => team.id === foundMatch.homeTeamId) || null;
    const away = mockTeams.find(team => team.id === foundMatch.awayTeamId) || null;
    
    // Get scorers if match is completed
    let matchScorers: Player[] = [];
    if (foundMatch.status === 'completed' && foundMatch.result) {
      const scorerIds = foundMatch.result.scorers || [];
      matchScorers = mockPlayers.filter(player => scorerIds.includes(player.id));
    }
    
    setMatch(foundMatch);
    setHomeTeam(home);
    setAwayTeam(away);
    setScorers(matchScorers);
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!match || !homeTeam || !awayTeam) {
    return <div>Match data not found</div>;
  }

  const getStatusBadgeClass = () => {
    switch (match.status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isUpcoming = match.status === 'scheduled';
  const isCompleted = match.status === 'completed';
  const hasResult = isCompleted && match.result;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/matches')}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Match Details</h1>
            <div className="flex items-center mt-1">
              <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${getStatusBadgeClass()}`}>
                {match.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        
        {canManageMatches && (
          <div className="flex space-x-2">
            <Link to={`/matches/edit/${match.id}`}>
              <Button variant="outline" icon={<Edit size={16} />}>
                Edit Match
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Match Header Card */}
      <Card className="overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <p className="text-sm text-blue-200 mb-1">
                <Clock className="inline-block h-4 w-4 mr-1" />
                {match.date} at {match.time}
              </p>
              <p className="text-sm text-blue-200">
                <MapPin className="inline-block h-4 w-4 mr-1" />
                {match.venue}
              </p>
            </div>
            
            <div className="flex-1 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0">
              <div className="text-center md:text-right md:flex-1 flex flex-col items-center md:items-end">
                <img 
                  src={homeTeam.logo} 
                  alt={homeTeam.name} 
                  className="h-16 w-16 object-cover rounded-full mb-2"
                />
                <h3 className="text-lg font-bold">{homeTeam.name}</h3>
                <p className="text-blue-200 text-sm">Home Team</p>
              </div>
              
              {hasResult ? (
                <div className="mx-8">
                  <div className="bg-white text-blue-900 py-3 px-6 rounded-lg flex items-center justify-center space-x-2">
                    <span className="text-3xl font-bold">{match.result.homeTeamScore}</span>
                    <span className="text-gray-400">-</span>
                    <span className="text-3xl font-bold">{match.result.awayTeamScore}</span>
                  </div>
                </div>
              ) : (
                <div className="mx-8">
                  <div className="py-3 px-6">
                    <span className="text-2xl font-light">VS</span>
                  </div>
                </div>
              )}
              
              <div className="text-center md:text-left md:flex-1 flex flex-col items-center md:items-start">
                <img 
                  src={awayTeam.logo} 
                  alt={awayTeam.name} 
                  className="h-16 w-16 object-cover rounded-full mb-2"
                />
                <h3 className="text-lg font-bold">{awayTeam.name}</h3>
                <p className="text-blue-200 text-sm">Away Team</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Match Information */}
        <Card 
          title={
            <div className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-blue-500" /> 
              <span>Match Information</span>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm text-gray-500">Date</h4>
                <p className="font-medium">{match.date}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500">Time</h4>
                <p className="font-medium">{match.time}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500">Venue</h4>
                <p className="font-medium">{match.venue}</p>
              </div>
              <div>
                <h4 className="text-sm text-gray-500">Status</h4>
                <p className="font-medium capitalize">{match.status.replace('_', ' ')}</p>
              </div>
            </div>
            
            {isUpcoming && (
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h4 className="font-medium text-blue-800 mb-2">Upcoming Match</h4>
                <p className="text-sm text-blue-600">This match is scheduled to be played soon.</p>
              </div>
            )}
            
            {hasResult && (
              <div className="mt-6">
                <h4 className="font-medium mb-2">Match Result</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-3 text-center">
                    <div>
                      <p className="text-sm text-gray-500">Home</p>
                      <p className="text-xl font-bold">{match.result.homeTeamScore}</p>
                    </div>
                    <div className="border-x border-gray-200">
                      <p className="text-sm text-gray-500">Result</p>
                      <p className="text-sm font-medium">
                        {match.result.homeTeamScore > match.result.awayTeamScore
                          ? `${homeTeam.name} Win`
                          : match.result.homeTeamScore < match.result.awayTeamScore
                          ? `${awayTeam.name} Win`
                          : 'Draw'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Away</p>
                      <p className="text-xl font-bold">{match.result.awayTeamScore}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Scorers List (if match is completed) */}
        {hasResult && (
          <Card 
            title={
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-500" /> 
                <span>Goal Scorers</span>
              </div>
            }
          >
            {scorers.length === 0 ? (
              <p className="text-gray-500">No goal information available</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {scorers.map((player, index) => {
                  const team = mockTeams.find(t => t.id === player.teamId);
                  // Count how many times this player appears in the scorers array
                  const goalCount = match.result?.scorers.filter(id => id === player.id).length || 0;
                  
                  return (
                    <li key={`${player.id}-${index}`} className="py-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-3 flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="font-medium text-gray-600">{player.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{player.name}</p>
                          <div className="flex items-center">
                            <div className="h-4 w-4 flex-shrink-0 mr-1">
                              <img 
                                className="h-4 w-4 rounded-full" 
                                src={team?.logo || ''} 
                                alt="" 
                              />
                            </div>
                            <p className="text-xs text-gray-500">{team?.name}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {goalCount > 1 ? `${goalCount} Goals` : '1 Goal'}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        )}
      </div>

      {/* Team Comparison */}
      <Card 
        title={
          <div className="flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-blue-500" /> 
            <span>Team Comparison</span>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="aspect-w-1 aspect-h-1 relative">
              <img 
                src={homeTeam.logo} 
                alt={homeTeam.name}
                className="h-32 w-32 mx-auto object-cover rounded-full"
              />
            </div>
            <h3 className="mt-2 text-lg font-semibold">{homeTeam.name}</h3>
            <p className="text-sm text-gray-500">Coach: {homeTeam.coach}</p>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-2">VS</h3>
              <p className="text-gray-500">{match.date}</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="aspect-w-1 aspect-h-1 relative">
              <img 
                src={awayTeam.logo} 
                alt={awayTeam.name}
                className="h-32 w-32 mx-auto object-cover rounded-full"
              />
            </div>
            <h3 className="mt-2 text-lg font-semibold">{awayTeam.name}</h3>
            <p className="text-sm text-gray-500">Coach: {awayTeam.coach}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MatchDetail;