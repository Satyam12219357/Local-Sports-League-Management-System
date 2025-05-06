import React, { useState } from 'react';
import { Trophy, ArrowDown, ArrowUp } from 'lucide-react';
import Card from '../../components/ui/Card';
import { mockStandings, mockTeams } from '../../data/mockData';
import { TeamStanding } from '../../types';

type SortKey = 'points' | 'played' | 'won' | 'drawn' | 'lost' | 'goalsFor' | 'goalsAgainst' | 'goalDifference';
type SortDirection = 'asc' | 'desc';

const StandingsPage: React.FC = () => {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'points',
    direction: 'desc'
  });

  const sortedStandings = React.useMemo(() => {
    const sortableItems = [...mockStandings];
    sortableItems.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      
      // If points are equal, sort by goal difference
      if (sortConfig.key === 'points' && a.points === b.points) {
        return sortConfig.direction === 'asc' 
          ? a.goalDifference - b.goalDifference
          : b.goalDifference - a.goalDifference;
      }
      
      return 0;
    });
    return sortableItems;
  }, [sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName: SortKey) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Trophy className="h-7 w-7 text-amber-500" />
        <h1 className="text-2xl font-bold text-gray-900">League Standings</h1>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pos
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('played')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Played</span>
                    {getSortIcon('played')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('won')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Won</span>
                    {getSortIcon('won')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('drawn')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Drawn</span>
                    {getSortIcon('drawn')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('lost')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Lost</span>
                    {getSortIcon('lost')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('goalsFor')}
                >
                  <div className="flex items-center space-x-1">
                    <span>GF</span>
                    {getSortIcon('goalsFor')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('goalsAgainst')}
                >
                  <div className="flex items-center space-x-1">
                    <span>GA</span>
                    {getSortIcon('goalsAgainst')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('goalDifference')}
                >
                  <div className="flex items-center space-x-1">
                    <span>GD</span>
                    {getSortIcon('goalDifference')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('points')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Points</span>
                    {getSortIcon('points')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedStandings.map((standing, index) => {
                const team = mockTeams.find(t => t.id === standing.teamId);
                
                return (
                  <tr key={standing.teamId} className={index < 3 ? 'bg-green-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0">
                          <img 
                            className="h-8 w-8 rounded-full object-cover" 
                            src={team?.logo || ''} 
                            alt={team?.name || ''} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{team?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {standing.played}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {standing.won}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {standing.drawn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {standing.lost}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {standing.goalsFor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {standing.goalsAgainst}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {standing.points}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="League Rules" className="bg-blue-50">
        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>Points System:</strong> 3 points for a win, 1 point for a draw, 0 points for a loss</p>
          <p><strong>Tiebreakers:</strong> Points, then Goal Difference, then Goals Scored</p>
          <p><strong>Promotion/Relegation:</strong> Top 3 teams are highlighted in green</p>
        </div>
      </Card>
    </div>
  );
};

export default StandingsPage;