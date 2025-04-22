import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { projectsApi, clientsApi, usersApi, statusApi } from "../../api/auth";

const AddProjectForm = ({ onSuccess, onCancel }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      projectName: "",
      projectDescription: "",
      clientId: "",
      startDate: "",
      endDate: "",
      projectOwnerId: "",
      budget: "",
      projectImage: null,
    },
  });

  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        console.log("AddProjectForm: Fetching dropdown data...");
        const [clientData, userData, statusData] = await Promise.all([
          clientsApi.getAll(),
          usersApi.getAll(),
          statusApi.getAll(),
        ]);

        console.log("RAW Client Data Received:", clientData);

        setClients(clientData || []);
        setUsers(userData || []);
        setStatuses(statusData || []);
        console.log("AddProjectForm: Dropdown data loaded.");
      } catch (dropdownError) {
        console.error(
          "AddProjectForm: Failed to load dropdown data:",
          dropdownError
        );
      }
    };
    loadDropdownData();
  }, []);
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("ProjectName", data.projectName);
    formData.append("Description", data.projectDescription || "");
    formData.append("ClientId", data.clientId);
    formData.append("StartDate", data.startDate);
    formData.append("EndDate", data.endDate);
    formData.append("ProjectOwnerId", data.projectOwnerId);
    formData.append("Budget", data.budget || 0);
    formData.append("StatusId", data.statusId);
    if (data.projectImage && data.projectImage.length > 0) {
      formData.append("ImageFile", data.projectImage[0]);
    }

    try {
      console.log("AddProjectForm: Submitting form data...");
      await projectsApi.create(formData);
      console.log("AddProjectForm: Project created!");
      reset();
      onSuccess();
    } catch (error) {
      console.error("AddProjectForm: Error creating project:", error);
      alert("Kunde inte skapa projekt: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="projectName">Projektnamn*</label>
        <br />
        <input
          id="projectName"
          {...register("projectName", { required: true })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="projectDescription">Beskrivning</label>
        <br />
        <textarea id="projectDescription" {...register("projectDescription")} />
      </div>

      <div className="form-group">
        <label htmlFor="projectImage">Bild</label>
        <br />
        <input type="file" id="projectImage" {...register("projectImage")} />
      </div>

      <div className="form-group">
        <label htmlFor="clientId">Klient*</label>
        <br />
        <select
          id="clientId"
          {...register("clientId", { required: true })}
          defaultValue="">
          <option value="" disabled>
            -- Välj klient --
          </option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.clientName}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="startDate">Startdatum*</label>
        <br />
        <input
          type="date"
          id="startDate"
          {...register("startDate", { required: true })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="endDate">Slutdatum*</label>
        <br />
        <input
          type="date"
          id="endDate"
          {...register("endDate", { required: true })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="projectOwnerId">Projektägare*</label>
        <br />
        <select
          id="projectOwnerId"
          {...register("projectOwnerId", { required: true })}
          defaultValue="">
          <option value="" disabled>
            -- Välj ägare --
          </option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.firstName} {user.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="budget">Budget</label>
        <br />
        <input
          type="number"
          id="budget"
          step="0.01"
          {...register("budget")}
          placeholder="0.00"
        />
      </div>
      <div className="form-group">
        <label htmlFor="statusId">Status*</label>
        <br />
        <select
          id="statusId"
          {...register("statusId", { required: true })}
          defaultValue="">
          <option value="" disabled>
            -- Välj status --
          </option>
          {statuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.statusName}
            </option>
          ))}
        </select>
      </div>

      <div className="btn-group">
        <button type="button" onClick={onCancel}>
          Avbryt
        </button>
        <button type="submit" className="btn">
          Spara Projekt
        </button>
      </div>
    </form>
  );
};

export default AddProjectForm;
