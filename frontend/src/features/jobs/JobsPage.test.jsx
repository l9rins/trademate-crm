import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('../../shared/lib/api', () => ({
    default: {
        get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn(),
        interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
    },
}));

import api from '../../shared/lib/api';
import JobsPage from './JobsPage';

const wrap = () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return ({ children }) => <QueryClientProvider client={qc}><BrowserRouter>{children}</BrowserRouter></QueryClientProvider>;
};

const jobs = [
    { id: 1, title: 'Fix Boiler', status: 'PENDING', address: '123 Main', scheduledDate: '2026-05-01T10:00:00', client: { id: 1, name: 'John' } },
    { id: 2, title: 'Install Sink', status: 'COMPLETED', address: '456 Oak', scheduledDate: null, client: null },
];

describe('JobsPage', () => {
    beforeEach(() => vi.clearAllMocks());

    it('renders title', async () => {
        api.get.mockImplementation(u => Promise.resolve({ data: [] }));
        render(<JobsPage />, { wrapper: wrap() });
        expect(screen.getByText('Job')).toBeTruthy();
    });

    it('renders jobs', async () => {
        api.get.mockImplementation(u => u === '/jobs' ? Promise.resolve({ data: jobs }) : Promise.resolve({ data: [] }));
        render(<JobsPage />, { wrapper: wrap() });
        await waitFor(() => expect(screen.getByText('Fix Boiler')).toBeTruthy());
    });

    it('filters jobs by search', async () => {
        api.get.mockImplementation(u => u === '/jobs' ? Promise.resolve({ data: jobs }) : Promise.resolve({ data: [] }));
        render(<JobsPage />, { wrapper: wrap() });
        await waitFor(() => expect(screen.getByText('Fix Boiler')).toBeTruthy());
        await userEvent.type(screen.getByPlaceholderText('Search by job, client or address...'), 'Install');
        await waitFor(() => { expect(screen.getByText('Install Sink')).toBeTruthy(); expect(screen.queryByText('Fix Boiler')).toBeNull(); });
    });

    it('shows empty state', async () => {
        api.get.mockImplementation(() => Promise.resolve({ data: [] }));
        render(<JobsPage />, { wrapper: wrap() });
        await waitFor(() => expect(screen.getByText('No jobs found')).toBeTruthy());
    });

    it('opens create sheet', async () => {
        api.get.mockImplementation(() => Promise.resolve({ data: [] }));
        render(<JobsPage />, { wrapper: wrap() });
        await waitFor(() => expect(screen.getByText('Initialize Job Request')).toBeTruthy());
        await userEvent.click(screen.getByText('Initialize Job Request'));
        await waitFor(() => expect(screen.getByText('Create New Job Request')).toBeTruthy());
    });
});
