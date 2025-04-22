import React, { useEffect, useState } from 'react';
import { useAuth }          from '../contexts/AuthContext';
import { projectsApi }      from '../api/auth';
import ModalButton from '../partials/components/ModalButton';
import AddProjectForm from '../partials/components/AddProjectForm';

const Projects = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      console.log("Fetching projects...");
      const data = await projectsApi.getAll();
      setProjects(data || []);
      console.log("Projects fetched:", data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setProjects([]);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setProjects([]);
      return;
    }
    fetchProjects();
  }, [authLoading, isAuthenticated]);

  const closeModal = () => setIsModalOpen(false);
  const handleProjectCreated = () => {
    closeModal();
    fetchProjects();
  };
  const handleCancelForm = () => closeModal();


  // Behåll IsAuthenticated Check
  if (!isAuthenticated) {
    return (
      <div className="projects-container">
        Du måste logga in för att se dina projekt.
      </div>
    );
  }

  return (
    <section>
      {/* Header med knapp */}
      <header className="page-header">
        <h1 className="h2">Projects</h1>
        <ModalButton
          type="add"
          target="#addProjectModal"
          text="Add Project"
          onClick={() => {
              console.log("Add Project button clicked!");
              setIsModalOpen(true);
          }}
        />
      </header>
      <div className="content">
         {projects.length > 0 ? (
            <ul
              className="projects-list"
              style={{ listStyle: "none", padding: 0 }}>
              {projects.map((project) => (
                <li key={project.id} className="project-item">
                  <h3>{project.projectName}</h3>
                  {project.description && <p>{project.description}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p>Inga projekt hittades.</p>
          )}
      </div>

      <div
        className={`modal ${isModalOpen ? "show" : ""}`}
        id="addProjectModal"
        tabIndex="-1"
        aria-labelledby="addProjectModalLabel"
        aria-hidden={!isModalOpen}
      >
        <div className="modal-content">
            <header className="modal-header">
              <h5 className="modal-title" id="addProjectModalLabel">
                Skapa Nytt Projekt
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeModal}
               ></button>
            </header>
            <div className="modal-body">
              {isModalOpen && isAuthenticated && (
                <AddProjectForm
                  onSuccess={handleProjectCreated}
                  onCancel={handleCancelForm}
                />
              )}
            </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;