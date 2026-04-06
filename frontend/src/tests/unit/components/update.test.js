import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router';
import Update from './../../../components/Update'; 

// Mock dependencies
jest.mock('axios');
const mockedNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedNavigate,
  useParams: () => ({ id: '123' }), // Mock the useParams hook to return a specific ID   
}));


describe('Update Task Component', () => {
  const mockTask = { data: { status: 'Pending' } };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetches and displays task data on mount', async () => {
    axios.get.mockResolvedValueOnce({ data: mockTask });

    render(
      <MemoryRouter>
        <Update />
      </MemoryRouter>
    );

    // Verify loading state or data fetch
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/123'));
    });
  });

  test('successfully updates task status and navigates home', async () => {
    axios.get.mockResolvedValueOnce({ data: mockTask });
    axios.patch.mockResolvedValueOnce({ data: { data: { status: 'Completed' } } });
    
    // Mock window.alert
    window.alert = jest.fn();

    render(
      <MemoryRouter>
        <Update />
      </MemoryRouter>
    );

    // Simulate form submission/button click
    const submitButton = await screen.findByRole('button', { name: /Update Status/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalledWith(expect.stringContaining('/123'), {
        status: 'Pending', // Or whatever the initial status was
      });
      expect(window.alert).toHaveBeenCalledWith("task updated successfully!");
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('displays error message on fetch failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('Fetch failed'));

    render(
      <MemoryRouter>
        <Update />
      </MemoryRouter>
    );

    const errorMessage = await screen.findByText(/failed to fetch task data/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('displays error message on update failure', async () => {
    axios.get.mockResolvedValueOnce({ data: mockTask });
    axios.patch.mockRejectedValueOnce(new Error('Update failed')); 
    render(
      <MemoryRouter>
        <Update />
      </MemoryRouter>
    );  
    const submitButton = await screen.findByRole('button', { name: /Update Status/i });
    fireEvent.click(submitButton);  
    const errorMessage = await screen.findByText(/failed to update task/i);
    expect(errorMessage).toBeInTheDocument();
  });

});




describe('Update Component UI', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending',
    dueDate: '2023-12-31'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading spinner initially', () => {
    // Return a promise that doesn't resolve immediately to catch loading state
    axios.get.mockReturnValue(new Promise(() => {}));
    
    render(
      <MemoryRouter>
        <Update />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading task data/i)).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument(); // The spinner
  });

  test('renders task data correctly after loading', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: mockTask } });

    render(
      <MemoryRouter>
        <Update />
      </MemoryRouter>
    );

    // Wait for the title to appear
    const title = await screen.findByText(/test task/i);
    expect(title).toBeInTheDocument();
    
    // Check if the select dropdown has the correct initial value
    const select = screen.getByLabelText(/status:/i);
    expect(select.value).toBe('pending');

    // Check formatted date
    const formattedDate = moment(mockTask.dueDate).format('DD-MM-YYYY');
    expect(screen.getByText(new RegExp(formattedDate))).toBeInTheDocument();
  });

  test('updates status value when user changes the dropdown', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: mockTask } });

    render(
      <MemoryRouter>
        <Update />
      </MemoryRouter>
    );

    const select = await screen.findByLabelText(/status:/i);
    
    // Change selection to 'completed'
    fireEvent.change(select, { target: { value: 'completed' } });
    
    expect(select.value).toBe('completed');
  });

  test('submits the form and calls axios.patch', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: mockTask } });
    axios.patch.mockResolvedValueOnce({ data: { data: { ...mockTask, status: 'completed' } } });
    window.alert = jest.fn(); // Mock alert

    render(
      <MemoryRouter>
        <Update />
      </MemoryRouter>
    );

    // Change status then click update
    const select = await screen.findByLabelText(/status:/i);
    fireEvent.change(select, { target: { value: 'completed' } });
    
    const updateButton = screen.getByRole('button', { name: /Update Status/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalledWith(expect.any(String), { status: 'completed' });
      expect(window.alert).toHaveBeenCalledWith("task updated successfully!");
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});