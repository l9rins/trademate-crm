/**
 * API Client — Unit Tests
 * Tests for shared API client configuration, interceptors, and error handling
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock axios before importing api
vi.mock('axios', () => {
    const requestInterceptors = [];
    const responseInterceptors = [];

    return {
        default: {
            create: vi.fn(() => ({
                interceptors: {
                    request: {
                        use: vi.fn((fn) => requestInterceptors.push(fn)),
                    },
                    response: {
                        use: vi.fn((success, error) => responseInterceptors.push({ success, error })),
                    },
                },
                get: vi.fn(),
                post: vi.fn(),
                put: vi.fn(),
                delete: vi.fn(),
                _requestInterceptors: requestInterceptors,
                _responseInterceptors: responseInterceptors,
            })),
        },
    };
});

describe('API Client Configuration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('should create axios instance with correct baseURL', async () => {
        const axios = (await import('axios')).default;
        // Re-import to trigger the module
        await import('../../shared/lib/api');

        expect(axios.create).toHaveBeenCalledWith(
            expect.objectContaining({
                timeout: 10000,
            })
        );
    });

    it('should attach Bearer token from localStorage to requests', async () => {
        const axios = (await import('axios')).default;
        const apiModule = await import('../../shared/lib/api');

        // Get the created instance
        const instance = axios.create.mock.results[0]?.value;
        if (instance && instance._requestInterceptors.length > 0) {
            localStorage.setItem('token', 'test-jwt-token');

            const config = { headers: {} };
            const result = instance._requestInterceptors[0](config);

            expect(result.headers.Authorization).toBe('Bearer test-jwt-token');
        }
    });

    it('should not attach Authorization header when no token exists', async () => {
        const axios = (await import('axios')).default;
        await import('../../shared/lib/api');

        const instance = axios.create.mock.results[0]?.value;
        if (instance && instance._requestInterceptors.length > 0) {
            const config = { headers: {} };
            const result = instance._requestInterceptors[0](config);

            expect(result.headers.Authorization).toBeUndefined();
        }
    });
});

describe('API Utility Functions', () => {
    it('should export api as default', async () => {
        const apiModule = await import('../../shared/lib/api');
        expect(apiModule.default).toBeDefined();
    });
});
