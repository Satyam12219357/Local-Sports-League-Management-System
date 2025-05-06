import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Calendar, Filter } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { mockMatches, mockTeams } from '../../data/mockData';
import { MatchStatus } from '../../types';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

const MatchesPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<MatchStatus | ''>('');

  const canManageMatches = hasRole(['admin', 'manager']);
  
  const filteredMatches = mockMatches.filter(match => {
    // Get team names for search
    const homeTeam = mockTeams.find(t => t.id === match.homeTeamId);
    const awayTeam = mockTeams.find(t => t.id === match.awayTeamId);
    const matchesSearch = 
      homeTeam?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      awayTeam?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.venue.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTeam = teamFilter 
      ? match.homeTeamId === teamFilter || match.awayTeamId === teamFilter 
      : true;
    
    const matchesStatus = statusFilter ? match.status === statusFilter : true;
    
    return matchesSearch && matchesTeam && matchesStatus;
  });

  // Sort matches by date (most recent first)
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Matches</h1>
        {canManageMatches && (
          <Link to="/matches/new">
            <Button variant="primary" icon={<Plus size={16} />}>
              Schedule Match
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
              placeholder="Search teams or venues..."
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
            id="status-filter"
            label="Filter by Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as MatchStatus | '')}
            options={statusOptions}
          />
        </div>
      </Card>

      {/* Matches List */}
      <div className="space-y-4">
        {sortedMatches.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No matches found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your filters to see more results</p>
            </div>
          </Card>
        ) : (
          sortedMatches.map(match => {
            const homeTeam = mockTeams.find(t => t.id === match.homeTeamId);
            const awayTeam = mockTeams.find(t => t.id === match.awayTeamId);
            
            const statusColors = {
              scheduled: 'bg-blue-100 text-blue-800',
              in_progress: 'bg-yellow-100 text-yellow-800',
              completed: 'bg-green-100 text-green-800',
              cancelled: 'bg-red-100 text-red-800'
            };
            
            return (
              <Card key={match.id} className="hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="mb-4 md:mb-0">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[match.status]}`}>
                      {match.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <div className="mt-2 text-xs text-gray-500">
                      {match.date} • {match.time} • {match.venue}
                    </div>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center my-4 md:my-0">
                    <div className="text-right flex-1">
                      <div className="font-medium text-gray-900">{homeTeam?.name || 'Unknown Team'}</div>
                      <div className="text-sm text-gray-500">Home</div>
                    </div>
                    
                    {match.status === 'completed' && match.result ? (
                      <div className="mx-4 text-center">
                        <div className="bg-gray-100 py-2 px-4 rounded-lg flex items-center justify-center space-x-2">
                          <span className="text-xl font-bold">{match.result.homeTeamScore}</span>
                          <span className="text-gray-400">-</span>
                          <span className="text-xl font-bold">{match.result.awayTeamScore}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mx-4 text-center">
                        <div className="py-2 px-4">
                          <span className="text-gray-400">VS</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="text-left flex-1">
                      <div className="font-medium text-gray-900">{awayTeam?.name || 'Unknown Team'}</div>
                      <div className="text-sm text-gray-500">Away</div>
                    </div>
                  </div>
                  
                  <div>
                    <Link to={`/matches/${match.id}`}>
                      <Button variant="outline" className="w-full md:w-auto">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MatchesPage;