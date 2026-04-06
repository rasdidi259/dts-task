/**
 * author       : Applicant
 * date         : 30/03/2026
 * description  : Component for reading and displaying details of a single task, with error handling and loading states.
 */


import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Moment from  'moment';
import { Link, useParams } from 'react-router';
const REACT_APP_BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const baseAPI_URL = REACT_APP_BASE_API_URL;           // Use environment variable for API URL


function Read() {
  const [data, setData] = useState(null);             // State to hold the task data
  const { id } = useParams();                         // Get the task ID from the URL
  const [isLoading, setIsLoading] = useState(false);  // Track loading
  const [error, setError] = useState(null);           // Track errors

  // Date Format
  Moment.locale('en');

  // READ: Fetch all tasks on load
  useEffect(() => {
    const getTask = async () => {

      try {
        setIsLoading(true);
        setError(null);
        const res = await axios.get(`${baseAPI_URL}/${id}`); // Replace :id with the actual task ID        
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch task details. Please try again later.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) getTask();
  }, [id]);


  if (isLoading) {
    return <div className="text-center mt-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p>Loading task details...</p>
    </div>;
  }

  if (error) {
    return (<div className="container mt-5">
      <h4 className="alert-heading">Error!</h4>
      <p className="alert alert-danger text-center mt-5">{error}</p>
      <hr />
      <Link to="/" className="btn btn-secondary">Back to Dashboard</Link>
    </div>);
  }

  // Handle loading state
  // if (!data) return <div className="text-center mt-5">Loading task details...</div>;


  return (
    <div className='d-flex w-100 vh-100 justify-content-center align-items-center bg-light border' >
      <div className='w-50 border bg-white shadow px-5 pt-3 mb-3 rounded'>
        <h1>Task Details</h1>
        <div className="mt-3 border p-3 rounded bg-light mb-3">
          <strong>Title:</strong> {data?.title} <br />
          <strong>Description:</strong> {data?.description} <br />
          <strong>Status:</strong> {data?.status} <br />
          <strong>Due Date:</strong> {Moment(data?.dueDate).format('DD-MM-YYYY')} <br />
        </div>
        <Link to={`/update/${data?._id}`} className="btn btn-sm btn-warning me-2 mb-3">Edit</Link>
        <Link to="/" className="btn btn-secondary ms-2 mb-3">Back to Dashboard</Link>
      </div>
    </div>
  )
}

export default Read