/**
 * author       : Applicant
 * date         : 30/03/2026
 * description  : Dashboard component that displays a list of tasks with pagination, and allows users to view, edit, or delete tasks.
 */


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Moment from 'moment';
import { Link } from 'react-router';
const REACT_APP_BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
export const baseAPI_URL = REACT_APP_BASE_API_URL;

  // GET /tasks - Fetch all tasks
function Dashboard() {
  const [tasks, setTasks] = useState([]);

  // Date Format
  Moment.locale('en');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  // READ: Fetch all tasks on load
  useEffect(() => {
    const getTasks = async () => {
      try {
        const res = await axios.get(baseAPI_URL);
        setTasks(res.data.data);
        //console.log("Fetched tasks:", res.data.data);
      } catch (err) { console.error("Fetch error:", err); }
    };
    getTasks();
  }, []);


  // READ: Fetch a specific task by ID
   const getTask = async (id) => {
    try {
      const res = await axios.get(`${baseAPI_URL}/${id}`);
      return res.data.data; // Return the task data
    } catch (err) { console.error("Get task error:", err); }
  };

  // DELETE: Remove a specific task by ID
const handleDelete = async (id) => {
  // Ask for confirmation
  const isConfirmed = window.confirm(`Are you sure you want to delete this ${tasks.find((task) => task._id === id).title} task?`);

  // If user cancels, exit the function
  if (!isConfirmed) return;

  try {
    // Call backend API
    await axios.delete(`${baseAPI_URL}/${id}`);

    // Update UI state (removes the deleted task from the table)
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    
    alert("Task deleted successfully!");
  } catch (err) {
    console.error("Error deleting task:", err);
    alert("Failed to delete the task. Please try again.");
  }
};


    // Pagination Logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-light vh-100">
      <h1 className="mt-5 pt-5">Dashboard - Task Management App</h1>
     

      <div className="mt-5 rounded p-4 bg-white shadow w-75" >
        <h2 className='mb-1 d-flex justify-content-center'>Task List</h2>
      <div className="mt-1 d-flex justify-content-end mb-3">
        <Link to="/create" className="btn btn-primary mt-3 d-flex justify-content-end">Create New Task</Link>
      </div>  
        <table className="table table-striped mt-8 table-bordered page-table" >  
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Due Date</th>
              <th className='w-25'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.map(task => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.status}</td>
                <td>{Moment(task.dueDate).format('DD-MM-YYYY')}</td>
                <td className='d-flex justify-content-center'>
                  <Link to={`/read/${task._id}`} className="btn btn-md btn-info me-2" onClick={() => getTask(task._id)}>View</Link>
                  <Link to={`/update/${task._id}`} className="btn btn-md btn-warning me-2" onClick={() => getTask(task._id)}>Edit</Link>
                  <button  className="btn btn-md btn-danger" onClick={() => handleDelete(task._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     {/* Pagination Controls */}
      <nav>
        <ul className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button onClick={() => paginate(i + 1)} className="page-link">
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
 
      
    </div>
  )
}

export default Dashboard;