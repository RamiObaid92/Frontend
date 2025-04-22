import React, { useEffect, useState } from 'react';
import { useAuth }          from '../contexts/AuthContext';
import { projectsApi }      from '../api/auth';
import LoadingSpinner       from '../partials/components/LoadingSpinner';

export default function Projects() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await projectsApi.getAll();
        setProjects(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Kunde inte ladda projekt');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [authLoading, isAuthenticated, user]);

  if (authLoading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <div className="projects-container">
      Du måste logga in för att se dina projekt.
    </div>;
  }

  if (loading) return <LoadingSpinner />;

  return (
    <section id="projects">
      <div className="content">
        <section className="section-header">
          <h2>Dina Projekt</h2>
          {user && <p>Välkommen, {user.firstName}!</p>}
        </section>

        <section className="section-body">
          {error && (
            <div className="error">{error}</div>
          )}
          {!error && projects.length === 0 ? (
            <div className="no-projects">
              <p>Du har inga projekt än.</p>
              <button className="btn btn-primary">
                Skapa nytt projekt
              </button>
            </div>
          ) : (
            <div className="projects-list">
              {projects.map(p => (
                <div key={p.id} className="project-card">
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}