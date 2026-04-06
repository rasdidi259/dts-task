/**
 * author       : Applicant
 * date         : 30/03/2026
 * description  : Component for creating a new task with form validation and error handling
 */

import React, { useState }  from 'react';
import axios from 'axios';
import Moment from  'moment';
import { Link, useNavigate } from 'react-router';
const REACT_APP_BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const baseAPI_URL = REACT_APP_BASE_API_URL;           // Use environment variable for API URL  


// POST /tasks - Create a new task
function Create() {
 
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date string
  
  const [isLoading, setIsLoading] = useState(false); // Track loading
 
  // Add an error state
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  Moment.locale('en');

  // CREATE: Add a new task
  const addTask = async (e) => {
    e.preventDefault(); // Prevent page reload
    
        // Validate title before sending request
        if (!title.trim()) {
            setError("Title is required.");
            return;
        }
        if (title.length < 5) {
            setError("Title must be at least 5 characters long.");
            return;
        }

    setError(''); // Clear error if validation passes
    setIsLoading(true);  // Trigger the spinner

    try {

     const res = await axios.post(baseAPI_URL, { title, description, status, dueDate });
      setTitle("");
      setDescription("");
      setStatus("pending");
      setDueDate(new Date());
      console.log("Added Task:", res.data.data)
      navigate('/');
    } catch (err) { 

        // Check if the server sent a specific error response (e.g., 400 or 409)
        if (err.response && err.response.data) {
            // Use the message sent by your backend (adjust 'message' to match your API key)
            const errorMessage = err.response.data.message || "Something went wrong on the server";
            setError(errorMessage.toString()); 
        } 
        // Handle network errors (server is down)
        else if (err.request) {
            setError("Network error: Could not reach the server.");
        } 
        // Fallback for everything else
        else {
            setError("An unexpected error occurred.");
        }
     } finally {
        setIsLoading(false); // End loading   
    }
  };

  return (
    <div className='d-flex w-100 justify-content-center align-items-center bg-light' >
      <div className='w-50 border bg-white shadow px-5 pt-3 rounded pb-5'>
        <h1>Create Task</h1>
      
        <form onSubmit={addTask} >
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input type="text" 
               onChange={e => {
                  setTitle(e.target.value);
                  if (error) setError(''); // Clear error while user types
                }}
                        
            // Toggle Bootstrap 'is-invalid' class based on error state
              className={`form-control ${error ? 'is-invalid' : ''}`}
            
              id="title" placeholder="Enter task title" />
              
              {/* Display the error message */}
              {error && <div className="invalid-feedback">{error}</div>}
        
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <input type="text" onChange={e=> setDescription(e.target.value)} className="form-control" id="description" placeholder="Enter task description" />
          </div>
          <div className="mb-3">
            <label htmlFor="status" className="form-label">Status</label>
            <select className="form-select" id="status" value={status} onChange={e=> setStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="dueDate" className="form-label">Due Date</label>
            <input type="date" value={Moment(dueDate).format('YYYY-MM-DD')} onChange={e=> setDueDate(Moment(e.target.value).toDate())} className="form-control" id="dueDate" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Task'}
          </button>
          <Link to="/" className="btn btn-secondary ms-2">Cancel</Link>
        </form> 
      </div>
    </div>
  )
}

export default Create
