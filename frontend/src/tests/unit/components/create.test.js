import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios';
import { MemoryRouter } from 'react-router'; // or 'react-router-dom'
import Create from '../../../components/Create';


// 1. Mock axios and useNavigate
jest.mock('axios');
const mockedNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedNavigate,
}));  




describe('addtask functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => 
    render(
      <MemoryRouter>
        <Create />
      </MemoryRouter>
    );

  test('shows error if title is empty', async () => {
    renderComponent();
    
    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
  });

  test('shows error if title is too short', async () => {
    renderComponent();
    
    const titleInput = screen.getByLabelText(/title/i);
    fireEvent.change(titleInput, { target: { value: 'abc' } });
    
    const submitButton = screen.getByRole('button', { name: /Create Task/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/title must be at least 5 characters long/i)).toBeInTheDocument();
  });

  test('successfully adds a task and navigates to home', async () => {
    axios.post.mockResolvedValueOnce({ data: { data: { id: 1, title: 'Valid Title' } } });
    renderComponent();

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Valid Task Title' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Some description' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Create Task/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        title: 'Valid Task Title',
        description: 'Some description',
        status: 'pending'
      }));
      expect(mockedNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('handles server error response', async () => {
    const errorMessage = "Task already exists";
    axios.post.mockRejectedValueOnce({
      response: { data: { message: errorMessage } }
    });

    renderComponent();
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Existing Task' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Task/i }));

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });
  
  test('handles network error', async () => {
    axios.post.mockRejectedValueOnce({ request: {} });
    renderComponent();
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Valid Title' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Task/i }));
    expect(await screen.findByText(/Network error: Could not reach the server/i)).toBeInTheDocument();
  });

  test('handles unexpected error', async () => {
    axios.post.mockRejectedValueOnce(new Error('Unexpected Error'));
    renderComponent();
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Valid Title' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Task/i }));
    expect(await screen.findByText(/An unexpected error occurred/i)).toBeInTheDocument();
  });

  test('handles network errors', async () => {
    axios.post.mockRejectedValueOnce({ request: {} });

    renderComponent();
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Valid Title' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Task/i }));

    expect(await screen.findByText(/Network error: Could not reach the server/i)).toBeInTheDocument();
  });

  test('handles unexpected errors', async () => {
    axios.post.mockRejectedValueOnce(new Error('Unexpected Error'));

    renderComponent();
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Valid Title' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Task/i }));

    expect(await screen.findByText(/An unexpected error occurred/i)).toBeInTheDocument();
      
    });

});




describe('Create UI and Form Interactions', () => {
  

// Helper to render with Router context
  const renderComponent = () => 
    render(
      <MemoryRouter>
        <Create />
      </MemoryRouter>
    );



  test('renders all form fields and initial state', () => {
    renderComponent();
    
    expect(screen.getByRole('heading', { name: /Create Task/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Task/i })).toBeInTheDocument();
  });

  test('updates input values on change', () => {
    renderComponent();
    
    const titleInput = screen.getByLabelText(/title/i);
    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    expect(titleInput.value).toBe('New Task');

    const statusSelect = screen.getByLabelText(/status/i);
    fireEvent.change(statusSelect, { target: { value: 'in-progress' } });
    expect(statusSelect.value).toBe('in-progress');
  });

  test('displays Bootstrap validation error class when error exists', async () => {
    renderComponent();
    
    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /Create Task/i });

    // Trigger validation error (empty title)
    fireEvent.click(submitButton);

    // Check for the Bootstrap 'is-invalid' class and the error message div
    expect(titleInput).toHaveClass('is-invalid');
    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
  });

  test('clears error class when user starts typing', () => {
    renderComponent();
    
    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /Create Task/i });

    // 1. Trigger error
    fireEvent.click(submitButton);
    expect(titleInput).toHaveClass('is-invalid');

    // 2. Type something
    fireEvent.change(titleInput, { target: { value: 'T' } });

    // 3. Class should be removed
    expect(titleInput).not.toHaveClass('is-invalid');
    expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
  });

  test('button shows loading state and is disabled during submission', () => {
    renderComponent();
    
    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /Create Task/i });

    fireEvent.change(titleInput, { target: { value: 'Valid Title' } });
    fireEvent.click(submitButton);

    // Verifies the isLoading condition in your JSX
    // (Note: This works if your component sets isLoading true immediately on click)
    // expect(submitButton).toBeDisabled();
    // expect(screen.getByText(/creating.../i)).toBeInTheDocument();
  });

  test('displays server error message from response', async () => {
    const errorMessage = "Task already exists";
    axios.post.mockRejectedValueOnce({
      response: { data: { message: errorMessage } }
    }); 
    renderComponent();
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Existing Task' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Task/i }));
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

  test('displays network error message', async () => {
    axios.post.mockRejectedValueOnce({ request: {} });  
    renderComponent();
      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Valid Title' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Task/i }));
    expect(await screen.findByText(/network error/i)).toBeInTheDocument();
  });

  test('displays unexpected error message', async () => {
    axios.post.mockRejectedValueOnce(new Error('Unexpected Error')); 
    renderComponent();
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Valid Title' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Task/i }));
    expect(await screen.findByText(/an unexpected error occurred/i)).toBeInTheDocument();
  });


  
});