import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

import App from './App';
import Login from '../Login/Login';
import Dashboard from '../Dashboard/Dashboard';
import Signup from '../Signup/Signup';

// Use 'npm run test' for running these tests.

// Test each page renders correctly.
describe("Snapshot testing of frontend", () => {
  test('Render login page', () => {
    const linkElement = renderer.create(
      <BrowserRouter>
        <Login />
      </BrowserRouter>).toJSON();
    expect(linkElement).toMatchSnapshot();
  });

  test('Render signup page', () => {
    const linkElement = renderer.create(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>).toJSON();
    expect(linkElement).toMatchSnapshot();
  });

  test('Render dashboard', () => {
    const linkElement = renderer.create(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>).toJSON();
    expect(linkElement).toMatchSnapshot();
  });
});

describe("Link functionality tests", () => {
  test('Test that default page / redirects to the Login', () => {
    render(<App />);
    expect(global.window.location.pathname).toContain('/login');
  });

  test('Test activity links from login page', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const linkEl = screen.getByText('Kitchen Activities');
    expect(linkEl).toHaveAttribute("href", "https://drive.google.com/drive/folders/1h4pmfp66la3ZBpEIwcfHb7TEY5QbUgOj");
  });

  test('Test activity links from dashboard', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    const linkEl = screen.getByText('Kitchen Activities');
    expect(linkEl).toHaveAttribute("href", "https://drive.google.com/drive/folders/1h4pmfp66la3ZBpEIwcfHb7TEY5QbUgOj");
  });

  test('Test signup and logout button redirects to other route', () => {

  });
});

describe("Check login functionality", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  });

  test('Test login fails without any credentials', () => {
    const button = screen.getByText("Login");
    userEvent.click(button);

    // In frontend, clicking button calls loginUser function.
    // We can probably use that to test our button, but it was more complicated than it seemed.
  });
});

describe("Check signup functionality", () => {
  test('Test creating new teacher', () => {

  });

  test ('Test creating new parent with child', () => {

  });

  test ('Test creating new parent without child causes error', () => {

  });

  test ('Test mismatched password shows error message', () => {

  });

  test ('Test missing essential input shows error message', () => {

  });
});