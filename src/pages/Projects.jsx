import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Projects() {
  const { isAuthenticated, user, roles } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    console.log('Projects component mounted');
    console.log('Authentication state in Projects:', { isAuthenticated, user, roles });
    
    const fetchProjects = async () => {
      try {
        console.log('Would fetch projects using:', user?.id);
        setTimeout(() => {
          setProjects([
            { id: 1, name: 'Sample Project 1', description: 'Description for project 1' },
            { id: 2, name: 'Sample Project 2', description: 'Description for project 2' }
          ]);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user, roles]);

  console.log('Projects rendering with state:', { loading, projectsCount: projects.length });

  if (!isAuthenticated) {
    return <div className="projects-container">Please sign in to view your projects</div>;
  }

  return (
    <section id="projects">
      <div className="content">
        <section className="section-header">
          <h2>Your Projects</h2>
          {user && <p>Welcome, {user.firstName}!</p>}
        </section>
        
        <section className="section-body">
          {loading ? (
            <p>Loading projects...</p>
          ) : projects.length > 0 ? (
            <div className="projects-list">
              {projects.map(project => (
                <div key={project.id} className="project-card">
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-projects">
              <p>You don't have any projects yet.</p>
              <button className="btn btn-primary">Create New Project</button>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}