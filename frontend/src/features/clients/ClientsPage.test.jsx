/**
 * Clients Feature — Unit Tests
 * Tests for Client CRUD operations and UI rendering
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('../../shared/lib/api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        interceptors: {
            request: { use: vi.fn() },
            response: { use: vi.fn() },
        },
    },
}));

import api from '../../shared/lib/api';
import ClientsPage from './ClientsPage';

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });
    return ({ children }) => (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>{children}</BrowserRouter>
        </QueryClientProvider>
    );
};

const mockClients = [
    { id: 1, name: 'John Doe', email: 'john@test.com', phone: '555-0001', address: '123 Main St', notes: '' },
    { id: 2, name: 'Jane Smith', email: 'jane@test.com', phone: '555-0002', address: '456 Oak Ave', notes: '' },
    { id: 3, name: 'Bob Wilson', email: 'bob@test.com', phone: '555-0003', address: '789 Pine Dr', notes: '' },
];

describe('ClientsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render page title', async () => {
        api.get.mockResolvedValueOnce({ data: [] });

        render(<ClientsPage />, { wrapper: createWrapper() });

        expect(screen.getByText('Client')).toBeTruthy();
        expect(screen.getByText('Directory')).toBeTruthy();
    });

    it('should show loading skeletons while fetching', () => {
        api.get.mockReturnValue(new Promise(() => {}));

        render(<ClientsPage />, { wrapper: createWrapper() });

        const skeletons = document.querySelectorAll('.animate-pulse');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render client list when data loads', async () => {
        api.get.mockResolvedValueOnce({ data: mockClients });

        render(<ClientsPage />, { wrapper: createWrapper() });

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeTruthy();
            expect(screen.getByText('Jane Smith')).toBeTruthy();
            expect(screen.getByText('Bob Wilson')).toBeTruthy();
        });
    });

    it('should display client email and phone', async () => {
        api.get.mockResolvedValueOnce({ data: mockClients });

        render(<ClientsPage />, { wrapper: createWrapper() });

        await waitFor(() => {
            expect(screen.getByText('john@test.com')).toBeTruthy();
            expect(screen.getByText('555-0001')).toBeTruthy();
        });
    });

    it('should filter clients by search term', async () => {
        api.get.mockResolvedValueOnce({ data: mockClients });

        render(<ClientsPage />, { wrapper: createWrapper() });

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeTruthy();
        });

        const searchInput = screen.getByPlaceholderText('Search by name, email or phone...');
        await userEvent.type(searchInput, 'Jane');

        await waitFor(() => {
            expect(screen.getByText('Jane Smith')).toBeTruthy();
            expect(screen.queryByText('John Doe')).toBeNull();
            expect(screen.queryByText('Bob Wilson')).toBeNull();
        });
    });

    it('should show empty state when no clients match search', async () => {
        api.get.mockResolvedValueOnce({ data: mockClients });

        render(<ClientsPage />, { wrapper: createWrapper() });

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeTruthy();
        });

        const searchInput = screen.getByPlaceholderText('Search by name, email or phone...');
        await userEvent.type(searchInput, 'zzzznotfound');

        await waitFor(() => {
            expect(screen.getByText('No clients found')).toBeTruthy();
        });
    });

    it('should open new client sheet when button is clicked', async () => {
        api.get.mockResolvedValueOnce({ data: [] });

        render(<ClientsPage />, { wrapper: createWrapper() });

        await waitFor(() => {
            expect(screen.getByText('Initialize Client Profile')).toBeTruthy();
        });

        await userEvent.click(screen.getByText('Initialize Client Profile'));

        await waitFor(() => {
            expect(screen.getByText('Register New Client')).toBeTruthy();
        });
    });

    it('should show "No clients found" when list is empty', async () => {
        api.get.mockResolvedValueOnce({ data: [] });

        render(<ClientsPage />, { wrapper: createWrapper() });

        await waitFor(() => {
            expect(screen.getByText('No clients found')).toBeTruthy();
        });
    });
});
