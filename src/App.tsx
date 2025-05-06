import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TeamsPage from './pages/Teams/TeamsPage';
import TeamDetail from './pages/Teams/TeamDetail';
import TeamForm from './pages/Teams/TeamForm';
import PlayersPage from './pages/Players/PlayersPage';
import PlayerDetail from './pages/Players/PlayerDetail';
import PlayerForm from './pages/Players/PlayerForm';
import MatchesPage from './pages/Matches/MatchesPage';
import MatchDetail from './pages/Matches/MatchDetail';
import MatchForm from './pages/Matches/MatchForm';
import StandingsPage from './pages/Standings/StandingsPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />}>
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/teams" element={
              <ProtectedRoute>
                <TeamsPage />
              </ProtectedRoute>
            } />
            <Route path="/teams/:id" element={
              <ProtectedRoute>
                <TeamDetail />
              </ProtectedRoute>
            } />
            <Route path="/teams/new" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <TeamForm />
              </ProtectedRoute>
            } />
            <Route path="/teams/edit/:id" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <TeamForm />
              </ProtectedRoute>
            } />
            <Route path="/players" element={
              <ProtectedRoute>
                <PlayersPage />
              </ProtectedRoute>
            } />
            <Route path="/players/:id" element={
              <ProtectedRoute>
                <PlayerDetail />
              </ProtectedRoute>
            } />
            <Route path="/players/new" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <PlayerForm />
              </ProtectedRoute>
            } />
            <Route path="/players/edit/:id" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <PlayerForm />
              </ProtectedRoute>
            } />
            <Route path="/matches" element={
              <ProtectedRoute>
                <MatchesPage />
              </ProtectedRoute>
            } />
            <Route path="/matches/:id" element={
              <ProtectedRoute>
                <MatchDetail />
              </ProtectedRoute>
            } />
            <Route path="/matches/new" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <MatchForm />
              </ProtectedRoute>
            } />
            <Route path="/matches/edit/:id" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <MatchForm />
              </ProtectedRoute>
            } />
            <Route path="/standings" element={
              <ProtectedRoute>
                <StandingsPage />
              </ProtectedRoute>
            } />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;