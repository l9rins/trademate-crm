/**
 * Dashboard Feature — Unit Tests
 * Tests for Dashboard page rendering and data display
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock modules
vi.mock('../../shared/lib/api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        interceptors: {
            request: { use: vi.fn() },
            response: { use: vi.fn() },
        },
    },
}));

vi.mock('../auth/AuthContext', () => ({
    useAuth: vi.fn(() => ({
        user: { username: 'testuser' },
        loading: false,
    })),
}));

vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
    AreaChart: ({ children }) => <div>{children}</div>,
    Area: () => <div />,
    BarChart: ({ children }) => <div>{children}</div>,
    Bar: () => <div />,
    XAxis: () => <div />,
    YAxis: () => <div />,
    CartesianGrid: () => <div />,
    Tooltip: () => <div />,
    LineChart: ({ children }) => <div>{children}</div>,
    Line: () => <div />,
}));

import api from '../../shared/lib/api';
import DashboardPage from './DashboardPage';

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

describe('DashboardPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render loading skeleton when data is loading', () => {
        api.get.mockReturnValue(new Promise(() => {})); // Never resolves — keeps loading

        render(<DashboardPage />, { wrapper: createWrapper() });

        // Should show skeleton loading state (pulse animations)
        const skeletons = document.querySelectorAll('.animate-pulse');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render dashboard with stats when data loads', async () => {
        api.get.mockResolvedValueOnce({
            data: {
                totalJobs: 15,
                pendingJobs: 5,
                completedJobs: 8,
                todayJobs: [],
                totalClients: 12,
            },
        });

        render(<DashboardPage />, { wrapper: createWrapper() });

        await waitFor(() => {
            expect(screen.getByText('Welcome,')).toBeTruthy();
        });

        // Check metric values rendered
        await waitFor(() => {
            expect(screen.getByText('15')).toBeTruthy();
            expect(screen.getByText('5')).toBeTruthy();
            expect(screen.getByText('8')).toBeTruthy();
            expect(screen.getByText('12')).toBeTruthy();
        });
    });

    it('should display user greeting with username', async () => {
        api.get.mockResolvedValueOnce({
            data: {
                totalJobs: 0,
                pendingJobs: 0,
                completedJobs: 0,
                todayJobs: [],
                totalClients: 0,
            },
        });

        render(<DashboardPage />, { wrapper: createWrapper() });

        await waitFor(() => {
            expect(screen.getByText('testuser')).toBeTruthy();
        });
    });

    it('should show error state when API fails', async () => {
        // Dashboard query has retry:1, so it retries once — reject both attempts
        api.get.mockRejectedValue(new Error('Network Error'));

        render(<DashboardPage />, { wrapper: createWrapper() });

        await waitFor(() => {
            expect(screen.getByText('Unable to load metrics')).toBeTruthy();
        }, { timeout: 5000 });
    });

    it('should render "Initialize Job" button linking to jobs page', async () => {
        api.get.mockResolvedValueOnce({
            data: {
                totalJobs: 0,
                pendingJobs: 0,
                completedJobs: 0,
                todayJobs: [],
                totalClients: 0,
            },
        });

        render(<DashboardPage />, { wrapper: createWrapper() });

        await waitFor(() => {
            const link = screen.getByText('Initialize Job').closest('a');
            expect(link).toBeTruthy();
            expect(link.getAttribute('href')).toBe('/jobs');
        });
    });
});
