/**
 * Auth Feature — Unit Tests
 * Tests for AuthContext (login, register, logout) functionality
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Mock the API module
vi.mock('../../shared/lib/api', () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        interceptors: {
            request: { use: vi.fn() },
            response: { use: vi.fn() },
        },
    },
}));

import api from '../../shared/lib/api';
import { AuthProvider, useAuth } from './AuthContext';

// Test component that consumes AuthContext
const TestConsumer = () => {
    const { user, login, register, logout, loading } = useAuth();
    return (
        <div>
            <div data-testid="loading">{String(loading)}</div>
            <div data-testid="user">{user ? JSON.stringify(user) : 'null'}</div>
            <button data-testid="login-btn" onClick={() => login('testuser', 'password123')}>Login</button>
            <button data-testid="register-btn" onClick={() => register('newuser', 'new@test.com', 'pass123')}>Register</button>
            <button data-testid="logout-btn" onClick={() => logout()}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('should initialize with no user when no token in localStorage', () => {
        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        expect(screen.getByTestId('user').textContent).toBe('null');
    });

    it('should restore user from localStorage if token exists', () => {
        localStorage.setItem('token', 'test-jwt-token');
        localStorage.setItem('user', JSON.stringify({ username: 'saveduser' }));

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        expect(screen.getByTestId('user').textContent).toContain('saveduser');
    });

    it('should login successfully and store token', async () => {
        api.post.mockResolvedValueOnce({ data: { token: 'jwt-login-token' } });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await userEvent.click(screen.getByTestId('login-btn'));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/auth/login', {
                username: 'testuser',
                password: 'password123',
            });
            expect(localStorage.getItem('token')).toBe('jwt-login-token');
            expect(screen.getByTestId('user').textContent).toContain('testuser');
        });
    });

    it('should register successfully and store token', async () => {
        api.post.mockResolvedValueOnce({ data: { token: 'jwt-register-token' } });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await userEvent.click(screen.getByTestId('register-btn'));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/auth/register', {
                username: 'newuser',
                email: 'new@test.com',
                password: 'pass123',
            });
            expect(localStorage.getItem('token')).toBe('jwt-register-token');
            expect(screen.getByTestId('user').textContent).toContain('newuser');
        });
    });

    it('should logout and clear localStorage', async () => {
        localStorage.setItem('token', 'test-token');
        localStorage.setItem('user', JSON.stringify({ username: 'testuser' }));

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await userEvent.click(screen.getByTestId('logout-btn'));

        await waitFor(() => {
            expect(localStorage.getItem('token')).toBeNull();
            expect(localStorage.getItem('user')).toBeNull();
            expect(screen.getByTestId('user').textContent).toBe('null');
        });
    });
});
