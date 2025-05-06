import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash, Calendar, Trophy } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Player, Team, Match } from '../../types';
import { mockPlayers, mockTeams, mockMatches } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

const PlayerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  
  const [player, setPlayer] = useState<Player | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [playerMatches, setPlayerMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  
  const canManagePlayers = hasRole(['admin', 'manager']);

  useEffect(() => {
    // Fetch player
    const foundPlayer = mockPlayers.find(player => player.id === id);
    if (!foundPlayer) {
      navigate('/players');
      return;
    }
    
    // Fetch player's team
    const playerTeam = mockTeams.find(team => team.id === foundPlayer.teamId);
    
    // Find matches where player's team played
    const matches = mockMatches.filter(match => 
      match.homeTeamId === foundPlayer.teamId || match.awayTeamId === foundPlayer.teamId
    );
    
    setPlayer(foundPlayer);
    setTeam(playerTeam || null);
    setPlayerMatches(matches);
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!player) {
    return <div>Player not found</div>;
  }

  // Calculate player's contribution percentage for team
  const getContributionPercentage = () => {
    if (!team) return 0;
    
    // Find all players from this team
    const teamPlayers = mockPlayers.filter(p => p.teamId === team.id);
    
    // Calculate total team goals
    const teamTotalGoals = teamPlayers.reduce((sum, p) => sum + p.stats.goals, 0);
    
    if (teamTotalGoals === 0) return 0;
    
    return Math.round((player.stats.goals / teamTotalGoals) * 100);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/players')}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{player.name}</h1>
        </div>
        
        {canManagePlayers && (
          <div className="flex space-x-2">
            <Link to={`/players/edit/${player.id}`}>
              <Button variant="outline" icon={<Edit size={16} />}>
                Edit
              </Button>
            </Link>
            <Button variant="danger" icon={<Trash size={16} />}>
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player Info Card */}
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-4xl font-bold text-gray-600">
              {player.name.charAt(0)}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">{player.name}</h2>
            <div className="flex items-center mb-4">
              {team && (
                <>
                  <img src={team.logo} alt={team.name} className="h-6 w-6 rounded-full mr-2" />
                  <p className="text-sm text-gray-600">{team.name}</p>
                </>
              )}
            </div>
            
            <div className="w-full space-y-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-gray-900 mb-2">Player Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Position</p>
                    <p className="text-sm font-medium">{player.position}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Team</p>
                    <p className="text-sm font-medium">{team?.name}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-gray-900 mb-2">Season Statistics</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-green-50 rounded">
                    <p className="text-xs text-gray-500">Goals</p>
                    <p className="text-xl font-bold text-green-600">{player.stats.goals}</p>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <p className="text-xs text-gray-500">Assists</p>
                    <p className="text-xl font-bold text-blue-600">{player.stats.assists}</p>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded">
                    <p className="text-xs text-gray-500">Fouls</p>
                    <p className="text-xl font-bold text-red-600">{player.stats.fouls}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-gray-900 mb-2">Team Contribution</h3>
                <div className="mb-2">
                  <p className="text-xs text-gray-500">Goal Contribution</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${getContributionPercentage()}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-right mt-1">{getContributionPercentage()}% of team goals</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {/* Player Matches */}
          <Card 
            title={
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" /> 
                <span>Recent Matches</span>
              </div>
            }
          >
            {playerMatches.length === 0 ? (
              <p className="text-gray-500">No match history available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goals</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {playerMatches.map((match) => {
                      const homeTeam = mockTeams.find(t => t.id === match.homeTeamId);
                      const awayTeam = mockTeams.find(t => t.id === match.awayTeamId);
                      
                      // Check if player scored in this match
                      let playerGoals = 0;
                      if (match.result && match.result.scorers) {
                        playerGoals = match.result.scorers.filter(id => id === player.id).length;
                      }
                      
                      return (
                        <tr key={match.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{match.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {homeTeam?.name} vs {awayTeam?.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {match.result ? `${match.result.homeTeamScore} - ${match.result.awayTeamScore}` : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {playerGoals > 0 ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {playerGoals}
                              </span>
                            ) : (
                              '0'
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                            {match.status.replace('_', ' ')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Performance Chart */}
          <Card 
            title={
              <div className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-blue-500" /> 
                <span>Performance Analysis</span>
              </div>
            }
          >
            <div className="space-y-6">
              {/* Goal Contribution per Match */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Goal Contribution per Match</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Goals per Match</p>
                      <p className="text-lg font-bold text-blue-600">
                        {playerMatches.length > 0 
                          ? (player.stats.goals / playerMatches.length).toFixed(2) 
                          : '0.00'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Assists per Match</p>
                      <p className="text-lg font-bold text-blue-600">
                        {playerMatches.length > 0 
                          ? (player.stats.assists / playerMatches.length).toFixed(2) 
                          : '0.00'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Total Contributions</p>
                      <p className="text-lg font-bold text-blue-600">
                        {player.stats.goals + player.stats.assists}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Season Progression */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Season Progression</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Goals</span>
                      <span>{player.stats.goals} total</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(player.stats.goals * 5, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Assists</span>
                      <span>{player.stats.assists} total</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(player.stats.assists * 5, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Fouls</span>
                      <span>{player.stats.fouls} total</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(player.stats.fouls * 5, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetail;