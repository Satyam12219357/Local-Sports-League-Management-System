import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { MatchStatus, Player } from '../../types';
import { mockMatches, mockTeams, mockPlayers } from '../../data/mockData';

interface MatchFormData {
  homeTeamId: string;
  awayTeamId: string;
  date: string;
  time: string;
  venue: string;
  status: MatchStatus;
  homeTeamScore?: number;
  awayTeamScore?: number;
  scorers?: string[];
}

const MatchForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [showScores, setShowScores] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<MatchFormData>();

  const watchStatus = watch('status');
  const watchHomeTeam = watch('homeTeamId');
  const watchAwayTeam = watch('awayTeamId');

  useEffect(() => {
    if (isEditMode) {
      // Fetch match data for editing
      const match = mockMatches.find(match => match.id === id);
      if (match) {
        const formData: MatchFormData = {
          homeTeamId: match.homeTeamId,
          awayTeamId: match.awayTeamId,
          date: match.date,
          time: match.time,
          venue: match.venue,
          status: match.status
        };
        
        if (match.result) {
          formData.homeTeamScore = match.result.homeTeamScore;
          formData.awayTeamScore = match.result.awayTeamScore;
          formData.scorers = match.result.scorers;
        }
        
        reset(formData);
        setShowScores(match.status === 'completed');
      } else {
        // Match not found, redirect
        navigate('/matches');
      }
      setLoading(false);
    }
  }, [id, isEditMode, navigate, reset]);

  useEffect(() => {
    setShowScores(watchStatus === 'completed');
  }, [watchStatus]);

  const onSubmit = async (data: MatchFormData) => {
    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const formattedData = {
        ...data,
        result: data.status === 'completed' ? {
          homeTeamScore: data.homeTeamScore || 0,
          awayTeamScore: data.awayTeamScore || 0,
          scorers: data.scorers || []
        } : undefined
      };
      
      if (isEditMode) {
        // Update match logic would go here in a real app
        console.log('Match updated:', { id, ...formattedData });
      } else {
        // Create match logic would go here in a real app
        console.log('Match created:', formattedData);
      }
      
      // Redirect to matches page
      navigate('/matches');
    } catch (error) {
      console.error('Error submitting match:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Get players for the selected teams
  const getTeamPlayers = () => {
    if (!watchHomeTeam && !watchAwayTeam) return [];
    
    return mockPlayers.filter(
      player => player.teamId === watchHomeTeam || player.teamId === watchAwayTeam
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate('/matches')}
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Match' : 'Schedule New Match'}
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              id="homeTeamId"
              label="Home Team"
              error={errors.homeTeamId?.message}
              options={mockTeams.map(team => ({
                value: team.id,
                label: team.name
              }))}
              {...register('homeTeamId', { 
                required: 'Home team is required' 
              })}
            />
            
            <Select
              id="awayTeamId"
              label="Away Team"
              error={errors.awayTeamId?.message}
              options={mockTeams
                .filter(team => team.id !== watchHomeTeam)
                .map(team => ({
                  value: team.id,
                  label: team.name
                }))}
              {...register('awayTeamId', { 
                required: 'Away team is required',
                validate: value => 
                  value !== watchHomeTeam || 'Home and away teams must be different'
              })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              id="date"
              label="Date"
              type="date"
              error={errors.date?.message}
              {...register('date', { 
                required: 'Date is required' 
              })}
            />
            
            <Input
              id="time"
              label="Time"
              type="time"
              error={errors.time?.message}
              {...register('time', { 
                required: 'Time is required' 
              })}
            />
            
            <Input
              id="venue"
              label="Venue"
              error={errors.venue?.message}
              {...register('venue', { 
                required: 'Venue is required' 
              })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              id="status"
              label="Match Status"
              error={errors.status?.message}
              options={[
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' }
              ]}
              {...register('status', { 
                required: 'Status is required' 
              })}
            />
          </div>
          
          {/* Show score input fields if status is completed */}
          {showScores && (
            <>
              <div className="border-t border-gray-200 pt-4 mb-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Match Result</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    id="homeTeamScore"
                    label="Home Team Score"
                    type="number"
                    error={errors.homeTeamScore?.message}
                    {...register('homeTeamScore', { 
                      required: 'Home team score is required for completed matches',
                      valueAsNumber: true,
                      min: { value: 0, message: 'Score cannot be negative' }
                    })}
                  />
                  
                  <Input
                    id="awayTeamScore"
                    label="Away Team Score"
                    type="number"
                    error={errors.awayTeamScore?.message}
                    {...register('awayTeamScore', { 
                      required: 'Away team score is required for completed matches',
                      valueAsNumber: true,
                      min: { value: 0, message: 'Score cannot be negative' }
                    })}
                  />
                </div>
              </div>
              
              {/* Goal scorers selection */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Goal Scorers</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Select the players who scored goals in this match. For multiple goals by the same player, select them multiple times.
                </p>
                
                {getTeamPlayers().length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {getTeamPlayers().map((player) => {
                      const team = mockTeams.find(t => t.id === player.teamId);
                      
                      return (
                        <div key={player.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`scorer-${player.id}`}
                            value={player.id}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            {...register('scorers')}
                          />
                          <label htmlFor={`scorer-${player.id}`} className="text-sm text-gray-700 flex items-center">
                            <span className="font-medium">{player.name}</span>
                            <span className="ml-1 text-xs text-gray-500">
                              ({team?.name} - {player.position})
                            </span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Please select both home and away teams to see players.
                  </p>
                )}
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/matches')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={<Save size={16} />}
              isLoading={submitting}
            >
              {isEditMode ? 'Update Match' : 'Schedule Match'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default MatchForm;