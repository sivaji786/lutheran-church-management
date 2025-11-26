import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

// Mock child components to avoid deep rendering and dependencies
jest.mock('../src/components/Header', () => ({
    Header: () => <div data-testid="header">Header</div>,
}));
jest.mock('../src/components/Footer', () => ({
    Footer: () => <div data-testid="footer">Footer</div>,
}));
jest.mock('../src/components/pages/HomePage', () => ({
    HomePage: () => <div data-testid="home-page">HomePage</div>,
}));
jest.mock('../src/components/pages/LoginPage', () => ({
    LoginPage: () => <div data-testid="login-page">LoginPage</div>,
}));
jest.mock('../src/components/AdminDashboard', () => ({
    AdminDashboard: () => <div data-testid="admin-dashboard">AdminDashboard</div>,
}));
jest.mock('../src/components/MemberDashboard', () => ({
    MemberDashboard: () => <div data-testid="member-dashboard">MemberDashboard</div>,
}));
// Mock other pages as needed, or just let them render if they are simple
// But better to mock all top-level pages used in App

jest.mock('../src/utils/localStorage', () => ({
    storage: {
        get: jest.fn(),
        set: jest.fn(),
        remove: jest.fn(),
        clearPrefix: jest.fn(),
    },
}));

jest.mock('../src/services/api', () => ({
    apiClient: {
        getMembers: jest.fn().mockResolvedValue({ success: true, data: { members: [] } }),
        getOfferings: jest.fn().mockResolvedValue({ success: true, data: { offerings: [] } }),
        getTickets: jest.fn().mockResolvedValue({ success: true, data: { tickets: [] } }),
        setToken: jest.fn(),
    },
}));

test('renders App component with Header and Footer', () => {
    render(<App />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    // Default page is Home
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
});
