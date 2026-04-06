import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router';
import Read from './../../../components/Read'; // Adjust path

// Mock axios
jest.mock('axios');

describe('Read Component', () => {
  const mockTask = {
    _id: '123',
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending',
    dueDate: '2023-12-31'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper to render component with a specific route ID
  const renderWithId = (id) => {
    return render(
      <MemoryRouter initialEntries={[`/read/${id}`]}>
        <Routes>
          <Route path="/read/:id" element={<Read />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('shows loading spinner initially', () => {
    // Provide a promise that doesn't resolve immediately
    axios.get.mockReturnValue(new Promise(() => {}));
    renderWithId('123');

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/Loading task details/i)).toBeInTheDocument();
  });

  test('renders task details after successful fetch', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: mockTask } });
    renderWithId('123');

    // Wait for the title to appear in the UI
    const titleElement = await screen.findByText(/Test Task/i);
    
    expect(titleElement).toBeInTheDocument();
    expect(screen.getByText(/Test Description/i)).toBeInTheDocument();
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
    
    // Verify the "Edit" link has the correct ID
    const editLink = screen.getByRole('link', { name: /edit/i });
    expect(editLink).toHaveAttribute('href', '/update/123');
  });

  test('displays error message when API fails', async () => {
    const errorMessage = "Task not found";
    axios.get.mockRejectedValueOnce({
      response: { data: { message: errorMessage } }
    });

    renderWithId('999');

    // Check for the error alert
    const errorAlert = await screen.findByText(errorMessage);
    expect(errorAlert).toBeInTheDocument();
    expect(screen.getByText(/Error!/i)).toBeInTheDocument();
    
    // Ensure "Back to Dashboard" link is visible
    expect(screen.getByRole('link', { name: /Back to dashboard/i })).toBeInTheDocument();
  });

  test('uses fallback error message on network failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    renderWithId('123');

    expect(await screen.findByText(/Failed to fetch task details/i)).toBeInTheDocument();
  });

  



  test('should display error message when fetch fails', async () => {
  const errorMessage = "Task not found";
  axios.get.mockRejectedValueOnce({
    response: { data: { message: errorMessage } }
  });

  render(<MemoryRouter><Read id="1" /></MemoryRouter>);

  // Wait for the error message to appear in the UI
  const errorElement = await screen.findByText(errorMessage);
  expect(errorElement).toBeInTheDocument();
});

});
