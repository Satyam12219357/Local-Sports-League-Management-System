import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Team } from '../../types';
import { mockTeams } from '../../data/mockData';

interface TeamFormData {
  name: string;
  logo: string;
  coach: string;
  description: string;
}

const TeamForm: React.FC = () => {
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
  } = useForm<TeamFormData>();

  useEffect(() => {
    if (isEditMode) {
      // Fetch team data for editing
      const team = mockTeams.find(team => team.id === id);
      if (team) {
        reset({
          name: team.name,
          logo: team.logo,
          coach: team.coach,
          description: team.description
        });
      } else {
        // Team not found, redirect
        navigate('/teams');
      }
      setLoading(false);
    }
  }, [id, isEditMode, navigate, reset]);

  const onSubmit = async (data: TeamFormData) => {
    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isEditMode) {
        // Update team logic would go here in a real app
        console.log('Team updated:', { id, ...data });
      } else {
        // Create team logic would go here in a real app
        console.log('Team created:', data);
      }
      
      // Redirect to teams page
      navigate('/teams');
    } catch (error) {
      console.error('Error submitting team:', error);
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
          onClick={() => navigate('/teams')}
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Team' : 'Add New Team'}
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              id="name"
              label="Team Name"
              error={errors.name?.message}
              {...register('name', { 
                required: 'Team name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
            />
            
            <Input
              id="coach"
              label="Coach Name"
              error={errors.coach?.message}
              {...register('coach', { 
                required: 'Coach name is required' 
              })}
            />
          </div>

          <Input
            id="logo"
            label="Team Logo URL"
            error={errors.logo?.message}
            {...register('logo', { 
              required: 'Logo URL is required',
              pattern: {
                value: /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif)$/,
                message: 'Please enter a valid image URL'
              }
            })}
          />
          
          {/* Logo preview */}
          <div className="bg-gray-50 p-4 rounded-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo Preview</label>
            <div className="w-full h-48 border border-gray-300 rounded-md overflow-hidden">
              <img
                src={watch('logo') || 'https://via.placeholder.com/400x300?text=Team+Logo'}
                alt="Team logo preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                }}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 ${
                errors.description ? 'border-red-300' : ''
              }`}
              {...register('description', { 
                required: 'Description is required',
                minLength: { value: 10, message: 'Description must be at least 10 characters' }
              })}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/teams')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={<Save size={16} />}
              isLoading={submitting}
            >
              {isEditMode ? 'Update Team' : 'Create Team'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TeamForm;