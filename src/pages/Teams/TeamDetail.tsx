import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash, Users, Calendar } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Team, Player, Match } from '../../types';
import { mockTeams, mockPlayers, mockMatches } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

const TeamDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  
  const canManageTeams = hasRole(['admin', 'manager']);

  useEffect(() => {
    // Fetch team
    const foundTeam = mockTeams.find(team => team.id === id);
    if (!foundTeam) {
      navigate('/teams');
      return;
    }
    
    // Fetch team players
    const teamPlayers = mockPlayers.filter(player => player.teamId === id);
    
    // Fetch team matches (both home and away)
    const teamMatches = mockMatches.filter(match => 
      match.homeTeamId === id || match.awayTeamId === id
    );
    
    setTeam(foundTeam);
    setPlayers(teamPlayers);
    setMatches(teamMatches);
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!team) {
    return <div>Team not found</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/teams')}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
        </div>
        
        {canManageTeams && (
          <div className="flex space-x-2">
            <Link to={`/teams/edit/${team.id}`}>
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
        {/* Team Info Card */}
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center">
            <img 
              src={team.logo} 
              alt={team.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-900 mb-1">{team.name}</h2>
            <p className="text-sm text-gray-600 mb-4">Coach: {team.coach}</p>
            <div className="w-full">
              <h3 className="text-md font-medium text-gray-900 mb-2">About</h3>
              <p className="text-sm text-gray-500">{team.description}</p>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {/* Players Card */}
          <Card 
            title={
              <div className="flex justify-between items-center w-full">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-500" /> Team Players
                </h3>
                {canManageTeams && (
                  <Link to="/players/new" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    Add Player
                  </Link>
                )}
              </div>
            }
          >
            {players.length === 0 ? (
              <p className="text-gray-500">No players found for this team</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goals</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assists</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {players.map((player) => (
                      <tr key={player.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{player.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.position}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.stats.goals}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.stats.assists}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Link to={`/players/${player.id}`} className="text-blue-600 hover:text-blue-800">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Matches Card */}
          <Card 
            title={
              <div className="flex justify-between items-center w-full">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-500" /> Team Matches
                </h3>
                {canManageTeams && (
                  <Link to="/matches/new" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    Schedule Match
                  </Link>
                )}
              </div>
            }
          >
            {matches.length === 0 ? (
              <p className="text-gray-500">No matches found for this team</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opponent</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {matches.map((match) => {
                      const isHomeTeam = match.homeTeamId === team.id;
                      const opponentId = isHomeTeam ? match.awayTeamId : match.homeTeamId;
                      const opponent = mockTeams.find(t => t.id === opponentId);
                      
                      let result = 'N/A';
                      if (match.result) {
                        const homeScore = match.result.homeTeamScore;
                        const awayScore = match.result.awayTeamScore;
                        result = isHomeTeam 
                          ? `${homeScore} - ${awayScore}` 
                          : `${awayScore} - ${homeScore}`;
                      }
                      
                      return (
                        <tr key={match.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{match.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {opponent?.name || 'Unknown'} {isHomeTeam ? '(H)' : '(A)'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{match.venue}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{match.status.replace('_', ' ')}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Link to={`/matches/${match.id}`} className="text-blue-600 hover:text-blue-800">
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;