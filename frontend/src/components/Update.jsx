/**
 * author       : Applicant
 * date         : 30/03/2026
 * description  : Component for updating the status of a specific task, with form validation and error handling
 */

import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Moment from  'moment';
import { Link, useParams,useNavigate } from 'react-router';
const REACT_APP_BASE_API_URL = process.env.REACT_APP_BASE_API_URL; // Use environment variable for API URL
const baseAPI_URL = REACT_APP_BASE_API_URL; 

  // PUT /tasks/:id - update task a specific task
function Update() {
  const [data, setData] = useState({}); // State to hold the task data
  const [status, setStatus] = useState(''); // State to hold the updated status
  const [isLoading, setIsLoading] = useState(false); // Track loading
  const [error, setError] = useState(null);           // Track errors
  const navigate = useNavigate();  
  const { id } = useParams(); // Get the task ID from the URL

    // Date Format
  Moment.locale('en');

  // 1. READ: Fetch all tasks on load
  useEffect(() => {
    const fetchTaskData = async () => {
      setIsLoading(true); // Start loading
      setError(null);
      try {
        const res = await axios.get(`${baseAPI_URL}/${id}`); // Replace :id with the actual task ID
        setData(res.data.data); // Set the initial status in the state
        setStatus(res.data.data.status); // Set the initial status in the state 
      } catch (err) { 
        setError("Failed to fetch task data. Please try again later.");
        console.error("Fetch error:", err); 
      } finally {
        setIsLoading(false); // End loading
      }
    };
    fetchTaskData();
  }, [id]);

   // UPDATE: Task status update handler
  const updateTaskStatus = async (e) => {
     e.preventDefault(); // Prevent page reload
    setIsLoading(true);  // Trigger the spinner
    setError(null);      // Reset any previous error messages

    try {
      const res = await axios.patch(`${baseAPI_URL}/${id}`, { status }); // Send the updated status to the backend
      setData(res.data.data); // Update the local state with the updated task data
      alert("Task updated successfully!");  
      navigate('/'); // Redirect back to the dashboard after update    
    } catch (err) { console.log("Update error:", err);
      setError("Failed to update task. Please try again.");
     }  finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className='d-flex w-100 vh-100 justify-content-center align-items-center bg-light border' >
 
        <div className='w-50 border bg-white shadow px-5 pt-3 mb-3 rounded'>
        <h1>  Update Task</h1>      
         
        {/* Spinner for loading state */}
        {isLoading && (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading task data...</p>
          </div>
        )}

        {isLoading ? (
          <p>Loading task data...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : ( 

        <form action="PUT" onSubmit={updateTaskStatus} > 
        <div className="mt-3 border p-3 rounded bg-light mb-3">

            <strong>Title:</strong> {data.title} <br />
            <strong>Description:</strong> {data.description} <br />
            {/* <strong>Status:</strong>  */}
          <div className="mb-3">
            <label htmlFor="status" className="form-label"><strong>Status:</strong></label>
            <select className="form-select" id="status" value={status} onChange={e=> setStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <strong>Due Date:</strong> {Moment(data?.dueDate).format('DD-MM-YYYY')} <br />          
        </div>
        <button type="submit" className="btn btn-sm btn-warning me-2 mb-3">Update Status</button>
        <Link to="/" className="btn btn-secondary ms-2 mb-3">Back to Dashboard</Link> 
      </form>
        
        )}

      </div>
    </div>

  )
}

export default Update
