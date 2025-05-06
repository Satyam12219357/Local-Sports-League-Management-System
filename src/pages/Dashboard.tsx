import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Trophy, Calendar, BarChart } from 'lucide-react';
import Card from '../components/ui/Card';
import { mockTeams, mockPlayers, mockMatches, mockStandings } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();

  // Filter upcoming matches - only show scheduled matches
  const upcomingMatches = mockMatches.filter(match => match.status === 'scheduled');
  
  // Sort standings by points (descending)
  const topTeams = [...mockStandings].sort((a, b) => b.points - a.points).slice(0, 4);
  
  // Sort players by goals (descending)
  const topScorers = [...mockPlayers].sort((a, b) => b.stats.goals - a.stats.goals).slice(0, 5);

  // Get current player's data if user is a player
  const playerData = currentUser?.role === 'player' 
    ? mockPlayers.find(p => p.id === currentUser.id)
    : null;

  const playerTeam = playerData
    ? mockTeams.find(t => t.id === playerData.teamId)
    : null;

  const playerMatches = playerData
    ? mockMatches.filter(m => 
        (m.homeTeamId === playerData.teamId || m.awayTeamId === playerData.teamId) &&
        m.status === 'completed'
      ).slice(0, 5)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {currentUser?.name}</p>
      </div>

      {/* Player Performance Section */}
      {playerData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-blue-600">{playerData.name.charAt(0)}</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{playerData.name}</h2>
              <p className="text-sm text-gray-600 mb-4">{playerTeam?.name} • {playerData.position}</p>
              
              <div className="w-full grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Goals</p>
                  <p className="text-2xl font-bold text-green-600">{playerData.stats.goals}</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Assists</p>
                  <p className="text-2xl font-bold text-blue-600">{playerData.stats.assists}</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm text-gray-600">Fouls</p>
                  <p className="text-2xl font-bold text-amber-600">{playerData.stats.fouls}</p>
                </div>
              </div>

              <Link 
                to={`/players/${playerData.id}`} 
                className="w-full text-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                View Full Profile
              </Link>
            </div>
          </Card>

          <Card className="lg:col-span-2" title="Recent Match Performance">
            {playerMatches.length > 0 ? (
              <div className="space-y-4">
                {playerMatches.map(match => {
                  const isHomeTeam = match.homeTeamId === playerData.teamId;
                  const homeTeam = mockTeams.find(t => t.id === match.homeTeamId);
                  const awayTeam = mockTeams.find(t => t.id === match.awayTeamId);
                  const playerGoals = match.result?.scorers.filter(id => id === playerData.id).length || 0;

                  return (
                    <div key={match.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm text-gray-600">{match.date}</div>
                        <div className="text-sm font-medium">
                          {homeTeam?.name} {match.result?.homeTeamScore} - {match.result?.awayTeamScore} {awayTeam?.name}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          {isHomeTeam ? 'Home' : 'Away'} • {match.venue}
                        </div>
                        {playerGoals > 0 && (
                          <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {playerGoals} {playerGoals === 1 ? 'Goal' : 'Goals'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No recent matches found</p>
            )}
          </Card>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Teams"
          count={mockTeams.length}
          icon={<Trophy className="h-6 w-6 text-blue-600" />}
          linkTo="/teams"
          color="blue"
        />
        <StatsCard
          title="Players"
          count={mockPlayers.length}
          icon={<Users className="h-6 w-6 text-green-600" />}
          linkTo="/players"
          color="green"
        />
        <StatsCard
          title="Matches"
          count={mockMatches.length}
          icon={<Calendar className="h-6 w-6 text-amber-600" />}
          linkTo="/matches"
          color="amber"
        />
        <StatsCard
          title="Teams in League"
          count={mockStandings.length}
          icon={<BarChart className="h-6 w-6 text-purple-600" />}
          linkTo="/standings"
          color="purple"
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Matches */}
        <Card title="Upcoming Matches" className="lg:col-span-2">
          {upcomingMatches.length === 0 ? (
            <p className="text-gray-500">No upcoming matches scheduled</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Home Team</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Away Team</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {upcomingMatches.map((match) => {
                    const homeTeam = mockTeams.find(t => t.id === match.homeTeamId);
                    const awayTeam = mockTeams.find(t => t.id === match.awayTeamId);
                    
                    return (
                      <tr key={match.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{homeTeam?.name || 'Unknown'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{awayTeam?.name || 'Unknown'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{match.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{match.time}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{match.venue}</td>
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

        {/* Top Teams */}
        <Card title={<h3 className="text-lg font-medium text-gray-900 flex items-center"><Trophy className="h-5 w-5 mr-2 text-amber-500" /> Top Teams</h3>}>
          <div className="space-y-4">
            {topTeams.map((standing, index) => {
              const team = mockTeams.find(t => t.id === standing.teamId);
              
              return (
                <div key={standing.teamId} className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full text-lg font-bold text-gray-700">
                    {index + 1}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-gray-900">{team?.name}</h4>
                      <div className="text-sm font-medium text-gray-500">{standing.points} pts</div>
                    </div>
                    <div className="flex text-xs text-gray-500 mt-1">
                      <span className="mr-2">W: {standing.won}</span>
                      <span className="mr-2">D: {standing.drawn}</span>
                      <span>L: {standing.lost}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="pt-4 border-t border-gray-200">
              <Link to="/standings" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                View full standings
              </Link>
            </div>
          </div>
        </Card>

        {/* Top Scorers */}
        <Card title={<h3 className="text-lg font-medium text-gray-900 flex items-center"><Users className="h-5 w-5 mr-2 text-green-500" /> Top Scorers</h3>}>
          <div className="space-y-4">
            {topScorers.map((player, index) => {
              const team = mockTeams.find(t => t.id === player.teamId);
              
              return (
                <div key={player.id} className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full text-lg font-bold text-gray-700">
                    {index + 1}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-gray-900">{player.name}</h4>
                      <div className="text-sm font-medium text-gray-500">{player.stats.goals} goals</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {team?.name} • {player.position}
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="pt-4 border-t border-gray-200">
              <Link to="/players" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                View all players
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  linkTo: string;
  color: 'blue' | 'green' | 'amber' | 'purple';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, count, icon, linkTo, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-100',
    green: 'bg-green-50 border-green-100',
    amber: 'bg-amber-50 border-amber-100',
    purple: 'bg-purple-50 border-purple-100'
  };

  return (
    <Link to={linkTo} className={`block border rounded-lg shadow-sm hover:shadow-md transition-shadow ${colorClasses[color]}`}>
      <div className="p-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{count}</p>
          </div>
          <div>{icon}</div>
        </div>
      </div>
    </Link>
  );
};

export default Dashboard;