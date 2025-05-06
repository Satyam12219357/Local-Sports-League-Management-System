import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash, Search } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { mockTeams } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

const TeamsPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredTeams = mockTeams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.coach.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canManageTeams = hasRole(['admin', 'manager']);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
        {canManageTeams && (
          <Link to="/teams/new">
            <Button variant="primary" icon={<Plus size={16} />}>
              Add Team
            </Button>
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search teams by name or coach..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Teams grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredTeams.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-8">No teams found</p>
        ) : (
          filteredTeams.map(team => (
            <Card key={team.id} className="h-full">
              <div className="flex flex-col h-full">
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <img 
                    src={team.logo} 
                    alt={team.name}
                    className="object-cover w-full h-40 rounded-md"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{team.name}</h3>
                <p className="text-sm text-gray-600 mb-2">Coach: {team.coach}</p>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{team.description}</p>
                <div className="mt-auto pt-4 flex space-x-2">
                  <Link to={`/teams/${team.id}`} className="flex-1">
                    <Button variant="outline" className="w-full text-sm">
                      View Details
                    </Button>
                  </Link>
                  {canManageTeams && (
                    <Link to={`/teams/edit/${team.id}`}>
                      <Button variant="outline" icon={<Edit size={15} />} className="text-sm p-2">
                        <span className="sr-only">Edit</span>
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamsPage;