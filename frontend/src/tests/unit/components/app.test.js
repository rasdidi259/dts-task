import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import App from './../../../components/App';

// 1. Mock the child components so we don't have to deal with their API calls9-
jest.mock('./../../../components/Dashboard', () => () => <div data-testid="dashboard-page">Dashboard Page</div>);
jest.mock('./../../../components/Create', () => () => <div data-testid="create-page">Create Task Page</div>);
jest.mock('./../../../components/Update', () => () => <div data-testid="update-page">Update Task Page</div>);
jest.mock('./../../../components/Read', () => () => <div data-testid="view-page">View Task Page</div>);

// We need to mock BrowserRouter because App already contains one, 
// and we can't nest Routers easily in tests.
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  BrowserRouter: ({ children }) => <div>{children}</div>,
}));

describe('App Routing', () => {
  
  test('renders Dashboard at the root path (/)', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  test('renders CreateTask at /create', () => {
    render(
      <MemoryRouter initialEntries={['/create']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('create-page')).toBeInTheDocument();
  });

  test('renders UpdateTask at /update/:id', () => {
    render(
      <MemoryRouter initialEntries={['/update/123']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('update-page')).toBeInTheDocument();
  });

  test('renders ViewTask at /read/:id', () => {
    render(
      <MemoryRouter initialEntries={['/read/456']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('view-page')).toBeInTheDocument();
  });
});
