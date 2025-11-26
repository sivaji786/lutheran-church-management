import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../../src/components/Header';

// Mock images
jest.mock('figma:asset/cb62bf54b7de9505972ebdfad3d2079da122b5b8.png', () => 'logo-stub');
jest.mock('figma:asset/5792e856707a6a5bc581ec9f97e87706b70ae1d9.png', () => 'rose-stub');

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    Menu: () => <div data-testid="menu-icon">Menu</div>,
    X: () => <div data-testid="x-icon">X</div>,
    ChevronDown: () => <div data-testid="chevron-down">ChevronDown</div>,
    LogIn: () => <div data-testid="login-icon">LogIn</div>,
    Youtube: () => <div data-testid="youtube-icon">Youtube</div>,
}));

describe('Header Component', () => {
    const mockOnNavigate = jest.fn();

    beforeEach(() => {
        mockOnNavigate.mockClear();
    });

    test('renders logo and navigation items', () => {
        render(<Header currentPage="home" onNavigate={mockOnNavigate} />);

        expect(screen.getByAltText('Lutheran Church Logo')).toBeInTheDocument();
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('About Us')).toBeInTheDocument();
        expect(screen.getByText('Ministries')).toBeInTheDocument();
        expect(screen.getByText('Contact Us')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    test('calls onNavigate when Home is clicked', () => {
        render(<Header currentPage="about" onNavigate={mockOnNavigate} />);

        fireEvent.click(screen.getByText('Home'));
        expect(mockOnNavigate).toHaveBeenCalledWith('home');
    });

    test('calls onNavigate when Login is clicked', () => {
        render(<Header currentPage="home" onNavigate={mockOnNavigate} />);

        fireEvent.click(screen.getByText('Login'));
        expect(mockOnNavigate).toHaveBeenCalledWith('login');
    });

    test('toggles mobile menu', () => {
        render(<Header currentPage="home" onNavigate={mockOnNavigate} />);

        // Mobile menu button is hidden on desktop, so we might need to adjust viewport or just find by role/testid
        // Since jsdom doesn't really do layout, it might be rendered but hidden with CSS.
        // However, the button is always in the DOM, just hidden with lg:hidden class.
        // We can find it by the icon.
        const menuButton = screen.getByTestId('menu-icon').parentElement;
        expect(menuButton).toBeInTheDocument();

        // Click to open
        fireEvent.click(menuButton!);
        expect(screen.getByTestId('x-icon')).toBeInTheDocument();

        // Click to close
        const closeButton = screen.getByTestId('x-icon').parentElement;
        fireEvent.click(closeButton!);
        expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    });
});
