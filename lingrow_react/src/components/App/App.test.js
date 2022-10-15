import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

import App from './App';
import Login from '../Login/Login';
import Dashboard from '../Dashboard/Dashboard';
import Signup from '../Signup/Signup';

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

  test('Test logout button from dashboard navigates to the logout page', () => {
    // ???
  });

  test('Test signup button in login page navigates to the signup page', () => {
    // ???
  });
});

describe("Check login functionality", () => {
  test('Test login fails without any credentials', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    userEvent.click(screen.getByText("Login"));
    expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
  });

  test('Test login with valid credential', () => {
    // ???
  });

  test('Login with valid credential, logout, and immediately attempt login without valid credential', () => {
    // ???
  });
});

describe("Check signup functionality", () => {

})