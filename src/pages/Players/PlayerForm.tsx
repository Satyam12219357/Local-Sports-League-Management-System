import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { PlayerPosition } from '../../types';
import { mockPlayers, mockTeams, playerPositions } from '../../data/mockData';

interface PlayerFormData {
  name: string;
  teamId: string;
  position: PlayerPosition;
  goals: number;
  assists: number;
  fouls: number;
}

const PlayerForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PlayerFormData>();

  useEffect(() => {
    if (isEditMode) {
      // Fetch player data for editing
      const player = mockPlayers.find(player => player.id === id);
      if (player) {
        reset({
          name: player.name,
          teamId: player.teamId,
          position: player.position,
          goals: player.stats.goals,
          assists: player.stats.assists,
          fouls: player.stats.fouls
        });
      } else {
        // Player not found, redirect
        navigate('/players');
      }
      setLoading(false);
    }
  }, [id, isEditMode, navigate, reset]);

  const onSubmit = async (data: PlayerFormData) => {
    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isEditMode) {
        // Update player logic would go here in a real app
        console.log('Player updated:', { 
          id, 
          ...data,
          stats: {
            goals: data.goals,
            assists: data.assists,
            fouls: data.fouls
          }
        });
      } else {
        // Create player logic would go here in a real app
        console.log('Player created:', {
          ...data,
          stats: {
            goals: data.goals,
            assists: data.assists,
            fouls: data.fouls
          }
        });
      }
      
      // Redirect to players page
      navigate('/players');
    } catch (error) {
      console.error('Error submitting player:', error);
    } finally {
      setSubmitting(false);
    }
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
          onClick={() => navigate('/players')}
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Player' : 'Add New Player'}
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              id="name"
              label="Player Name"
              error={errors.name?.message}
              {...register('name', { 
                required: 'Player name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
            />
            
            <Select
              id="teamId"
              label="Team"
              error={errors.teamId?.message}
              options={mockTeams.map(team => ({
                value: team.id,
                label: team.name
              }))}
              {...register('teamId', { 
                required: 'Team is required' 
              })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              id="position"
              label="Position"
              error={errors.position?.message}
              options={playerPositions.map(position => ({
                value: position,
                label: position
              }))}
              {...register('position', { 
                required: 'Position is required' 
              })}
            />
          </div>
          
          <div className="border-t border-gray-200 pt-4 mb-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Player Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                id="goals"
                label="Goals"
                type="number"
                error={errors.goals?.message}
                {...register('goals', { 
                  required: 'Goals is required',
                  valueAsNumber: true,
                  min: { value: 0, message: 'Goals cannot be negative' }
                })}
              />
              
              <Input
                id="assists"
                label="Assists"
                type="number"
                error={errors.assists?.message}
                {...register('assists', { 
                  required: 'Assists is required',
                  valueAsNumber: true,
                  min: { value: 0, message: 'Assists cannot be negative' }
                })}
              />
              
              <Input
                id="fouls"
                label="Fouls"
                type="number"
                error={errors.fouls?.message}
                {...register('fouls', { 
                  required: 'Fouls is required',
                  valueAsNumber: true,
                  min: { value: 0, message: 'Fouls cannot be negative' }
                })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/players')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={<Save size={16} />}
              isLoading={submitting}
            >
              {isEditMode ? 'Update Player' : 'Create Player'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PlayerForm;