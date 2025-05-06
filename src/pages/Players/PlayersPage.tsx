import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Users } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { mockPlayers, mockTeams, playerPositions } from '../../data/mockData';
import { PlayerPosition } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const PlayersPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState<PlayerPosition | ''>('');

  const canManagePlayers = hasRole(['admin', 'manager']);
  
  const filteredPlayers = mockPlayers.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = teamFilter ? player.teamId === teamFilter : true;
    const matchesPosition = positionFilter ? player.position === positionFilter : true;
    
    return matchesSearch && matchesTeam && matchesPosition;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Players</h1>
        {canManagePlayers && (
          <Link to="/players/new">
            <Button variant="primary" icon={<Plus size={16} />}>
              Add Player
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select
            id="team-filter"
            label="Filter by Team"
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            options={[
              { value: '', label: 'All Teams' },
              ...mockTeams.map(team => ({
                value: team.id,
                label: team.name
              }))
            ]}
          />
          
          <Select
            id="position-filter"
            label="Filter by Position"
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value as PlayerPosition | '')}
            options={[
              { value: '', label: 'All Positions' },
              ...playerPositions.map(position => ({
                value: position,
                label: position
              }))
            ]}
          />
        </div>
      </Card>

      {/* Player List */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goals</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assists</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fouls</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPlayers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                  <Users className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <p>No players found based on current filters</p>
                </td>
              </tr>
            ) : (
              filteredPlayers.map((player) => {
                const team = mockTeams.find(t => t.id === player.teamId);
                
                return (
                  <tr key={player.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-lg font-medium text-gray-600">
                            {player.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{player.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-6 w-6 flex-shrink-0">
                          <img 
                            className="h-6 w-6 rounded-full" 
                            src={team?.logo || ''} 
                            alt="" 
                          />
                        </div>
                        <div className="ml-2 text-sm text-gray-900">{team?.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.stats.goals}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.stats.assists}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.stats.fouls}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      <Link to={`/players/${player.id}`} className="text-blue-600 hover:text-blue-800 mr-4">
                        View
                      </Link>
                      {canManagePlayers && (
                        <Link to={`/players/edit/${player.id}`} className="text-blue-600 hover:text-blue-800">
                          Edit
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayersPage;