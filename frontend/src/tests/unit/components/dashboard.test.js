// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { jest } from '@jest/globals';
// import { MemoryRouter,  } from 'react-router';
// import axios from 'axios';


// import MockAdapter from 'axios-mock-adapter';
// import Create from './Create';
// import Read from './Read';
// import Update from './Update';
// import Dashboard from './Dashboard';




// 1. Mock axios and useNavigate
// jest.mock('axios');
// const mockedUsedNavigate = jest.fn();

// jest.mock('react-router', () => ({
//   ...jest.requireActual('react-router'),
//   useNavigate: () => mockedUsedNavigate,
// }));

// describe('Create Component', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test('successfully creates a task and redirects', async () => {
//     // 2. Setup mock response
//     axios.post.mockResolvedValueOnce({ data: { data: { title: 'New Task' } } });

//     render(
//       <MemoryRouter>
//         <Create />
//       </MemoryRouter>
//     );

//     // 3. Fill out the form
//     fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Buy Groceries' } });
//     fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Milk and Eggs' } });

//     // 4. Submit form
//     const submitButton = screen.getByRole('button', { name: /Create Task/i });
//     fireEvent.click(submitButton);

//     // 5. Assertions
//     expect(submitButton).toHaveTextContent('Creating...');
    
//     await waitFor(() => {
//       expect(axios.post).toHaveBeenCalledWith(undefined, expect.objectContaining({
//         title: 'Buy Groceries',
//         description: 'Milk and Eggs',
//         status: 'pending'
//       }));
//       expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
//     });
//   });

//   test('shows validation error if title is too short', async () => {
//     render(
//       <MemoryRouter>
//         <Create />
//       </MemoryRouter>
//     );

//     const titleInput = screen.getByLabelText(/Title/i);
//     fireEvent.change(titleInput, { target: { value: 'abc' } });
    
//     fireEvent.click(screen.getByRole('button', { name: /Create Task/i }));

//     expect(await screen.findByText(/Title must be at least 5 characters long/i)).toBeInTheDocument();
//     expect(axios.post).not.toHaveBeenCalled();
//   });
// });



//-----------------------------------------------------------------------------------------

// import axios from 'axios';
// import { render, screen, waitFor, fireEvent } from '@testing-library/react';
// import UserApp from './UserApp';

// jest.mock('axios');
// const mockedAxios = axios as jest.Mocked<typeof axios>;


// describe('UserApp CRUD Operations', () => {
//   beforeEach(() => jest.clearAllMocks()); // Reset mocks between tests

//   // READ
//   test('fetches and displays users', async () => {
//     mockedAxios.get.mockResolvedValue({ data: [{ id: 1, name: 'Alice' }] });
//     render(<UserApp />);
//     expect(await screen.findByText('Alice')).toBeInTheDocument();
//   });

//   // CREATE
//   test('adds a new user', async () => {
//     mockedAxios.post.mockResolvedValue({ data: { id: 2, name: 'Bob' } });
//     render(<UserApp />);
//     fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Bob' } });
//     fireEvent.click(screen.getByText('Add User'));
//     expect(await screen.findByText('Bob')).toBeInTheDocument();
//   });

//   // UPDATE
//   test('updates an existing user', async () => {
//     mockedAxios.put.mockResolvedValue({ data: { id: 1, name: 'Alice Updated' } });
//     render(<UserApp />);
//     fireEvent.click(await screen.findByText('Edit Alice'));
//     expect(await screen.findByText('Alice Updated')).toBeInTheDocument();
//   });

//   // DELETE
//   test('deletes a user', async () => {
//     mockedAxios.delete.mockResolvedValue({ status: 200 });
//     render(<UserApp />);
//     const deleteBtn = await screen.findByText('Delete Alice');
//     fireEvent.click(deleteBtn);
//     await waitFor(() => expect(screen.queryByText('Alice')).not.toBeInTheDocument());
//   });
// });



//------------------------------------------------------------------------------

// import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import Create from './Create';
// import Read from './Read';
// import Update from './Update';
// import Dashboard from './Dashboard';


// // Initialize the mock adapter on the axios instance
// const mock = new MockAdapter(axios);

// describe('Create CRUD with Mock Adapter', () => {
  
//   beforeEach(() => {
//     mock.reset(); // Resets handlers and history
//   });

//   // --- READ ---
//   test('displays tasks on load', async () => {
//     mock.onGet('/tasks').reply(200, [
//       { title: 'Gadern', description:'Preparing the land for planting', status:'pending' }
//     ]);

//     render(<Dashboard />);
    
//     expect(await screen.findByText('Gadern')).toBeInTheDocument();
//   });

//   // --- CREATE ---
//   test('adds a new user to the list', async () => {
//     mock.onGet('/tasks').reply(200, []);
//     mock.onPost('/tasks').reply(201, { id: 2, name: 'Jane Smith' });

//     render(<Create />);

//     fireEvent.change(screen.getByPlaceholderText('Enter name'), { target: { value: 'Jane Smith' } });
//     fireEvent.click(screen.getByText('Add User'));

//     expect(await screen.findByText('Jane Smith')).toBeInTheDocument();
//     expect(mock.history.post.length).toBe(1);
//   });

//   // --- UPDATE ---
//   test('updates user name', async () => {
//     mock.onGet('/users').reply(200, [{ id: 1, name: 'Old Name' }]);
//     mock.onPut('/users/1').reply(200, { id: 1, name: 'New Name' });

//     render(<Update />);

//     const editBtn = await screen.findByText('Edit');
//     fireEvent.click(editBtn);
//     fireEvent.change(screen.getByDisplayValue('Old Name'), { target: { value: 'New Name' } });
//     fireEvent.click(screen.getByText('Save'));

//     expect(await screen.findByText('New Name')).toBeInTheDocument();
//   });

//   // --- DELETE ---
//   test('removes user from list', async () => {
//     mock.onGet('/users').reply(200, [{ id: 1, name: 'Delete Me' }]);
//     mock.onDelete('/users/1').reply(200);

//     render(<Dashboard />);

//     const deleteBtn = await screen.findByText('Delete');
//     fireEvent.click(deleteBtn);

//     await waitFor(() => {
//       expect(screen.queryByText('Delete Me')).not.toBeInTheDocument();
//     });
//   });

//   // --- ERROR HANDLING ---
//   test('shows error message on network failure', async () => {
//     mock.onGet('/tasks').networkError();

//     render(<Create />);
    
//     expect(await screen.findByText('Failed to load users')).toBeInTheDocument();
//   });
// });



//---------------------------------------------------------------------------------


// import { render, screen, waitFor } from '@testing-library/react';
// import axios from 'axios';
// import { MemoryRouter } from 'react-router';
// import Dashboard from './Dashboard'; // adjust to your file name

// // 1. Mock the axios module
// jest.mock('axios');

// // At the top of your test file
// const mockedNavigate = jest.fn();

// // Ensure you mock 'react-router' specifically if that's where you import from
// jest.mock('react-router', () => ({
//   ...jest.requireActual('react-router'),
//   useNavigate: () => mockedNavigate,
// }));

// describe('Fetch Tasks on Load', () => {
//   const mockTasks = [
//     { id: 1, title: 'Task 1', description: 'Description 1' },
//     { id: 2, title: 'Task 2', description: 'Description 2' },
//   ];

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test('fetches and displays tasks when the component mounts', async () => {
//     // 2. Setup the mock response
//     axios.get.mockResolvedValueOnce({
//       data: { data: mockTasks }
//     });

//     render(<MemoryRouter><Dashboard /></MemoryRouter>);

//     // 3. Verify the API was called correctly
//     expect(axios.get).toHaveBeenCalledTimes(1);

//     // 4. Use findByText to wait for the items to appear in the UI
//     // This handles the async nature of the useEffect and setState
//     expect(await screen.findByText('Task 1')).toBeInTheDocument();
//     expect(await screen.findByText('Task 2')).toBeInTheDocument();
//   });

//   test('handles fetch error gracefully', async () => {
//     // Mock a console.error to keep the test output clean
//     const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
//     axios.get.mockRejectedValueOnce(new Error('Network Error'));

//     render(<MemoryRouter><Dashboard /></MemoryRouter>);

//     await waitFor(() => {
//       expect(consoleSpy).toHaveBeenCalledWith("Fetch error:", expect.any(Error));
//     });

//     consoleSpy.mockRestore();
//   });
// });



//---------------------------------------------------------------------------------



//---------------------------------------------------------------------------------

// import { render, screen } from '@testing-library/react';
// import { MemoryRouter } from 'react-router'; // or 'react-router-dom'
// import axios from 'axios';
// import Dashboard from './Dashboard'; // adjust path

// jest.mock('axios');

// describe('Dashboard Component', () => {

//   const mockTasks = [
//     { id: 1, title: 'Task 1', description: 'Description 1' },
//     { id: 2, title: 'Task 2', description: 'Description 2' },
//   ];

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });





//   // Clear mocks before each test to prevent data leaking
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test('renders without crashing', async () => {
//     // Provide a mock resolved value so the useEffect doesn't fail
//     axios.get.mockResolvedValueOnce({ data: { data: [] } });

//     render(
//       <MemoryRouter>
//         <Dashboard />
//       </MemoryRouter>
//     );
    
//     // Check for a known element in your Dashboard
//     expect(screen.findByText('Task 1')).toBeInTheDocument();
//   });
// });







//-----------------------------------//--------------------------------------------//

// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import MockAdapter from 'axios-mock-adapter'
// import axios from 'axios';
// import { MemoryRouter } from 'react-router'; // or 'react-router-dom'
// import Dashboard, { baseAPI_URL } from '../../../components/Dashboard';
 

// import { rest } from "msw";
// import { setupServer } from "msw/node";



//     const taskList = rest.get(baseAPI_URL, (req, res, ctx) =>{
//       return res(
//         ctx.json([
//           { title:'Cleaning', description:'Clean the house', status:'pending', dueDate: '2023-12-31' },
//           { title:'Gaderning', description:'Prepare the Gadern', status:'in-progress', dueDate: '2024-06-01'}
//         ])
//       );
//   });

//   const handlers = [taskList];

// const server = new setupServer(...handlers);

// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());


// const mock = new MockAdapter(axios);

// // Mock axios
// jest.mock('axios');

// const mockTasks = [
//   { _id: '1', title: 'Task One', description:'Task 1 Description', status:'pending', dueDate: '2024-06-01'},
//   { _id: '2', title: 'Task Two', description:'Task 2 Description', status:'pending', dueDate: '2024-06-01'}
// ];


// describe('Dashboard Component', () => {
//   beforeEach(() => {
//     axios.get.mockResolvedValue({ data: { data: mockTasks } });
//     window.confirm = jest.fn(() => true); // Mock confirmation dialog
//     window.alert = jest.fn(); // Mock alert
//   });



// test("it should have the correct task item Clean the house", async () => {
//   render(<MemoryRouter><Dashboard /></MemoryRouter>);
//   const taskItem = await screen.findByText(/Clean the house/);
//   expect(taskItem).toBeVisible();
// });




//   test('fetches and displays tasks on load', async () => {
//     render(<MemoryRouter><Dashboard /></MemoryRouter>);
    
//     // Check if task appears in the document
//     const taskElement = await screen.findByText(/Task One/i);
//     expect(taskElement).toBeInTheDocument();
//     expect(axios.get).toHaveBeenCalledTimes(1);
//   });

  
//   test('fetches and displays description on load', async () => {
//     render(<MemoryRouter><Dashboard /></MemoryRouter>);
    
//     // Check if task appears in the document
//     const taskElement = await screen.findByText(/Task 2 Description/i);
//     expect(taskElement).toBeInTheDocument();
//     expect(axios.get).toHaveBeenCalledTimes(1);
//   });


//    // --- READ ---
//   test('displays tasks on load', async () => {
//     mock.onGet('/tasks').reply(200, [
//       { title: 'Task One', description:'Task 1 Description', status:'pending' }
//     ]);

//     render(<MemoryRouter><Dashboard /></MemoryRouter>);
    
//     expect(await screen.findByText('Task 1 Description')).toBeInTheDocument();
//   });

//   test('deletes a task when delete button is clicked', async () => {
//     axios.delete.mockResolvedValue({});
//     render(<MemoryRouter><Dashboard /></MemoryRouter>);

//     // Find and click delete button for Task One
//     const deleteButtons = await screen.findAllByText(/Delete/i);
//     fireEvent.click(deleteButtons[0]);

//     // Verify confirmation was asked
//     expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this Task One task?');

//     await waitFor(() => {
//       // Check that the task is removed from the UI
//       expect(screen.queryByText('Task One')).not.toBeInTheDocument();
//       expect(window.alert).toHaveBeenCalledWith('Task deleted successfully!');
//     });
//   });

//   test('Failed to delete the task. Please try again.', async () => {
//     const errorMessage = 'Network Error';
//     axios.delete.mockRejectedValue(new Error(errorMessage));
//     render(<MemoryRouter><Dashboard /></MemoryRouter>);

//     // Find and click delete button for Task One
//     const deleteButtons = await screen.findAllByText(/Delete/i);
//     fireEvent.click(deleteButtons[0]);

//     await waitFor(() => {
//       expect(screen.queryByText('Task One')).toBeInTheDocument();
//       expect(window.alert).toHaveBeenCalledWith('Failed to delete the task. Please try again.');
//     });
//   });

//   test('Get task error: Network Error', async () => {
//     const errorMessage = 'Network Error';
//     axios.get.mockRejectedValue(new Error(errorMessage));
//     render(<MemoryRouter><Dashboard /></MemoryRouter>);

//     await waitFor(() => {
//       expect(screen.queryByText('Task One')).not.toBeInTheDocument();
//       expect(screen.queryByText('Task Two')).not.toBeInTheDocument();
//       expect(console.error).toHaveBeenCalledWith("Fetch error:", expect.any(Error));
//     }); 
//   });

//   const mockId = '123';
//   const mockData = { id: '123', title: 'Test Task' };

//   afterEach(() => {
//     jest.clearAllMocks(); // Clear mocks between tests
//   });

//   test('returns task data on a successful API call', async () => {
//     // 1. Setup: simulate successful response (res.data.data)
//     axios.get.mockResolvedValue({ data: { data: mockData } });

//     // 2. Execution
//     const result = await getTask(mockId);

//     // 3. Assertion: check URL construction and return value
//     expect(axios.get).toHaveBeenCalledWith(`${baseAPI_URL}/${mockId}`);
//     expect(result).toEqual(mockData);
//   });

//   test('logs an error to console when the API call fails', async () => {
//     // 1. Setup: mock console.error and force an API failure
//     const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
//     const mockError = new Error('Network Error');
//     axios.get.mockRejectedValue(mockError);

//     // 2. Execution
//     const result = await getTask(mockId);

//     // 3. Assertion: check that console.error was called with expected message
//     expect(consoleSpy).toHaveBeenCalledWith("Get task error:", mockError);
//     expect(result).toBeUndefined(); // Catch block does not return data

//     consoleSpy.mockRestore(); // Restore console to normal
//   });




//   // test('deletes a task when delete button is clicked', async () => {
//   //   axios.delete.mockResolvedValue({});
//   //   render(<MemoryRouter><Dashboard /></MemoryRouter>);

//   //   // Find and click delete button for Task One
//   //   const deleteButtons = await screen.findAllByText(/delete/i);
//   //   fireEvent.click(deleteButtons[0]);

//   //   // Verify confirmation was asked
//   //   expect(window.confirm).toHaveBeenCalledWith('Task One');

//   //   await waitFor(() => {
//   //     // Check that the task is removed from the UI
//   //     expect(screen.queryByText('Task One')).not.toBeInTheDocument();
//   //     expect(window.alert).toHaveBeenCalledWith('task deleted successfully!');
//   //   });
//   // });
// });


//---------------------------------------------------------------------------------


import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Dashboard, {baseAPI_URL} from "../../../components/Dashboard";
import axios from "axios";
import {MemoryRouter } from "react-router";

jest.mock("axios");

// Mock window methods
global.confirm = jest.fn();
global.alert = jest.fn();

const mockTasks = [
  {
    _id: "1",
    title: "Test Task 1",
    description: "Description 1",
    status: "Pending",
    dueDate: "2026-04-10",
  },
  {
    _id: "2",
    title: "Test Task 2",
    description: "Description 2",
    status: "Completed",
    dueDate: "2026-04-12",
  },
  { _id: '', 
    name: 'Unit Test Task',
    description: 'Unit Test Description',
    status: 'pending',
    dueDate: '2026-04-15'
   },
];

const renderComponent = () =>
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );

describe("Dashboard Component", () => {

  
  const mockId = '123';
  const mockTask = { id: '123', name: 'Unit Test Task' };
    

  beforeEach(() => {
    jest.clearAllMocks();
  });



  test("renders dashboard title", () => {
    renderComponent();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  test("fetches and displays tasks", async () => {
    axios.get.mockResolvedValueOnce({
      data: { data: mockTasks },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
      expect(screen.getByText("Test Task 2")).toBeInTheDocument();
    });
  });

  test("calls API on load", async () => {
    axios.get.mockResolvedValueOnce({
      data: { data: mockTasks },
    });

    renderComponent();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });

  test("deletes a task when confirmed", async () => {
    axios.get.mockResolvedValueOnce({
      data: { data: mockTasks },
    });

    axios.delete.mockResolvedValueOnce({});

    global.confirm.mockReturnValue(true);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        expect.stringContaining("/1")
      );
    });
  });

  test("does not delete if user cancels", async () => {
    axios.get.mockResolvedValueOnce({
      data: { data: mockTasks },
    });

    global.confirm.mockReturnValue(false);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    expect(axios.delete).not.toHaveBeenCalled();
  });

  test("renders pagination buttons", async () => {
    axios.get.mockResolvedValueOnce({
      data: { data: Array(15).fill(mockTasks[0]) },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

  test("handles fetch error", async () => {
    const errorMessage = "Network Error";
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Error fetching tasks")).toBeInTheDocument();
    });
  });


   test('Failed to delete the task. Please try again.', async () => {
    const errorMessage = 'Network Error';
    axios.delete.mockRejectedValue(new Error(errorMessage));
    render(<MemoryRouter><Dashboard /></MemoryRouter>);

    // Find and click delete button for Task One
    const deleteButtons = await screen.findAllByText(/Delete/i);
    fireEvent.click(deleteButtons[0]);  

    await waitFor(() => {
      expect(screen.queryByText('Test Task 1')).toBeInTheDocument();
      expect(global.alert).toHaveBeenCalledWith('Failed to delete the task. Please try again.');
    });
  });



  it('returns task data on a successful response', async () => {
    // Simulating Axios successful response structure: res.data.data
    axios.get.mockResolvedValue({ data: { data: mockTask } });

    const result = await getTask(mockId);

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(`/${mockId}`));
    expect(result).toEqual(mockTask);
  });


  it('logs an error and returns undefined when the API fails', async () => {
    const networkError = new Error('Network Error');
    axios.get.mockRejectedValue(networkError);

    const result = await getTask(mockId);

    // Verify error was caught and logged
    expect(console.error).toHaveBeenCalledWith("get task error:", networkError);
    expect(result).toBeUndefined();
  });



});