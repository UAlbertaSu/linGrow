import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import userEvent from '@testing-library/user-event';
import webdriver, { Browser } from 'selenium-webdriver';

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

// Test links and buttons on some pages.
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

  test('Test signup button on login page is clickable', () => {

    const { getByTestId } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.click(getByTestId('signup'));
    expect(sessionStorage.getItem('redirect')).toBeDefined();
  });

  test('Test logout button on dashboard page is clickable', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    fireEvent.click(getByTestId('logout'));
    expect(sessionStorage.getItem('redirect')).toBeDefined();
  });

  test('Test nonexistent button', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.queryByText('Fail Button')).not.toBeDefined;
  });
});

// Check anything related to login.
describe("Check login functionality", () => {
  test('Test login succeeds with valid credentials', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    userEvent.type(getByTestId('email'), "mock@email.com");
    userEvent.type(getByTestId('password'), "1234");

    fireEvent.click(getByTestId('login'));
    expect(sessionStorage.getItem('token')).toBeDefined();
  });

  test('Test login fails without any credentials', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.click(getByTestId('login'));
    expect(sessionStorage.getItem('token')).toBeDefined();
  });
});

// Check anything related to registration.
describe("Check signup functionality", () => {
  test('Test creating new user', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    userEvent.type(getByTestId('email'), "teacher@edu.ca");
    userEvent.type(getByTestId('first_name'), "teacher");
    userEvent.type(getByTestId('last_name'), "teacher");
    userEvent.selectOptions(getByTestId('user_type'), ["Teacher"]);
    userEvent.type(getByTestId('password'), "1234");
    userEvent.type(getByTestId('password2'), "1234");

    fireEvent.click(getByTestId('submit_button'));
    expect(sessionStorage.getItem('registration')).toBe("success");
  });

  test('Test ensure no users with duplicate email', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    userEvent.type(getByTestId('email'), "mock@email.com");
    userEvent.type(getByTestId('first_name'), "mock");
    userEvent.type(getByTestId('last_name'), "mockson");
    userEvent.selectOptions(getByTestId('user_type'), ["Parent"]);
    userEvent.type(getByTestId('password'), "1234");
    userEvent.type(getByTestId('password2'), "1234");

    fireEvent.click(getByTestId('submit_button'));
    expect(sessionStorage.getItem('registration')).toBe("failed");
  });

  test('Test creating new parent with child', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    userEvent.type(getByTestId('email'), "parent@home.ca");
    userEvent.type(getByTestId('first_name'), "parent");
    userEvent.type(getByTestId('last_name'), "parent");
    userEvent.selectOptions(getByTestId('user_type'), ["Parent"]);
    userEvent.type(getByTestId('password'), "1234");
    userEvent.type(getByTestId('password2'), "1234");
    userEvent.type(getByTestId('child_name'), "parent child");

    fireEvent.click(getByTestId('submit_button'));
    expect(sessionStorage.getItem('registration')).toBe("success");
  });

  test ('Test creating new parent without child causes error', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    userEvent.type(getByTestId('email'), "parent@home.ca");
    userEvent.type(getByTestId('first_name'), "parent");
    userEvent.type(getByTestId('last_name'), "parent");
    userEvent.selectOptions(getByTestId('user_type'), ["Parent"]);
    userEvent.type(getByTestId('password'), "1234");
    userEvent.type(getByTestId('password2'), "1234");

    fireEvent.click(getByTestId('submit_button'));
    expect(sessionStorage.getItem('registration')).toBe("failed");
  });

  test ('Test mismatched password shows error message', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    userEvent.type(getByTestId('email'), "teacher@edu.ca");
    userEvent.type(getByTestId('first_name'), "teacher");
    userEvent.type(getByTestId('last_name'), "teacher");
    userEvent.selectOptions(getByTestId('user_type'), ["Teacher"]);
    userEvent.type(getByTestId('password'), "1234");
    userEvent.type(getByTestId('password2'), "4321");

    fireEvent.click(getByTestId('submit_button'));
    expect(sessionStorage.getItem('registration')).toBe("failed");
  });

  test ('Test missing essential input shows error message', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    userEvent.type(getByTestId('first_name'), "parent");
    userEvent.type(getByTestId('last_name'), "parent");
    userEvent.selectOptions(getByTestId('user_type'), ["Parent"]);
    userEvent.type(getByTestId('password'), "1234");
    userEvent.type(getByTestId('password2'), "1234");

    fireEvent.click(getByTestId('submit_button'));
    expect(sessionStorage.getItem('registration')).toBe("failed");
  });
});