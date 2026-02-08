// API Configuration - Runtime config takes precedence over build-time env
declare global {
    interface Window {
        APP_CONFIG?: {
            API_BASE_URL: string;
        };
    }
}

// Auto-detect API URL based on environment
function getApiBaseUrl(): string {
    // 1. Check if config.js loaded (highest priority)
    if (typeof window !== 'undefined' && window.APP_CONFIG?.API_BASE_URL) {
        return window.APP_CONFIG.API_BASE_URL;
    }

    // 2. Check Vite env variable (development)
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL;
    }

    // 3. Auto-detect based on current domain (production fallback)
    if (typeof window !== 'undefined') {
        const currentUrl = window.location.origin;

        // If running on localhost, use localhost API
        if (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
            return 'http://localhost:8080';
        }

        // For production, assume API is at /backend relative to current domain
        return `${currentUrl}/backend`;
    }

    // 4. Final fallback
    return 'http://localhost:8080';
}

const API_BASE_URL = getApiBaseUrl();

console.log('🔧 API Configuration:', {
    source: window.APP_CONFIG ? 'config.js' :
        import.meta.env.VITE_API_BASE_URL ? 'env variable' :
            'auto-detected',
    apiBaseUrl: API_BASE_URL
});

// Types
export interface LoginResponse {
    success: boolean;
    data: {
        userId: string;
        username?: string;
        memberCode?: string;
        name?: string;
        role: string;
        isSuperadmin?: string;
        memberStatus?: string;
        token?: string;
        expiresIn?: number;
        requires2FA?: boolean;
        message?: string;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface PaginatedResponse {
    success: boolean;
    data: {
        [key: string]: any;
        pagination: {
            currentPage: number;
            totalPages: number;
            totalRecords: number;
            limit: number;
        };
    };
}

// Helper to convert snake_case to camelCase
const toCamelCase = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(v => toCamelCase(v));
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce(
            (result, key) => {
                const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
                result[camelKey] = toCamelCase(obj[key]);
                return result;
            },
            {} as any
        );
    }
    return obj;
};

// Helper to convert camelCase to snake_case
const toSnakeCase = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(v => toSnakeCase(v));
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce(
            (result, key) => {
                const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
                result[snakeKey] = toSnakeCase(obj[key]);
                return result;
            },
            {} as any
        );
    }
    return obj;
};

// API Client Class
class ApiClient {
    private token: string | null = null;
    public onUnauthorized: (() => void) | null = null;

    constructor() {
        // Load token from localStorage if available
        this.token = localStorage.getItem('authToken');
    }

    setToken(token: string) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('authToken');
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (options.headers) {
            Object.assign(headers, options.headers);
        }

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        // Transform body to snake_case if it exists and is JSON
        // if (options.body && typeof options.body === 'string') {
        //     try {
        //         const bodyObj = JSON.parse(options.body);
        //         options.body = JSON.stringify(toSnakeCase(bodyObj));
        //     } catch (e) {
        //         // Ignore if not JSON
        //     }
        // }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            if (response.status === 401 && this.onUnauthorized) {
                this.onUnauthorized();
            }

            const error = await response.json().catch(() => ({
                message: null,
            }));

            // Provide user-friendly error messages based on status code
            let userMessage = error.message;

            if (!userMessage) {
                switch (response.status) {
                    case 400:
                        userMessage = 'Invalid request. Please check your input and try again.';
                        break;
                    case 401:
                        userMessage = 'Invalid credentials. Please check your username and password.';
                        break;
                    case 403:
                        userMessage = 'You do not have permission to perform this action.';
                        break;
                    case 423:
                        userMessage = 'Your account has been suspended. Please contact the administrator.';
                        break;
                    case 404:
                        userMessage = 'The requested resource was not found.';
                        break;
                    case 409:
                        userMessage = 'This record already exists or conflicts with existing data.';
                        break;
                    case 422:
                        userMessage = 'The data provided is invalid. Please check and try again.';
                        break;
                    case 429:
                        userMessage = 'Too many requests. Please wait a moment and try again.';
                        break;
                    case 500:
                        userMessage = 'Server error. Please try again later or contact support.';
                        break;
                    case 503:
                        userMessage = 'Service temporarily unavailable. Please try again later.';
                        break;
                    default:
                        userMessage = 'An unexpected error occurred. Please try again.';
                }
            }

            throw new Error(userMessage);
        }

        const data = await response.json();
        // Transform response data to camelCase
        if (data && data.data) {
            data.data = toCamelCase(data.data);
        }
        return data;
    }

    // Authentication
    async adminLogin(username: string, password: string): Promise<LoginResponse> {
        const response = await this.request<LoginResponse>('/auth/admin/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        if (response.success && response.data.token) {
            this.setToken(response.data.token);
        }
        return response;
    }

    async verifyAdmin2FA(userId: string, code: string): Promise<LoginResponse> {
        const response = await this.request<LoginResponse>('/auth/admin/verify-2fa', {
            method: 'POST',
            body: JSON.stringify({ userId, code }),
        });
        if (response.success && response.data.token) {
            this.setToken(response.data.token);
        }
        return response;
    }

    async memberLogin(
        identifier: string,
        identifierType: 'mobile' | 'memberCode',
        password: string
    ): Promise<LoginResponse> {
        const response = await this.request<LoginResponse>('/auth/member/login', {
            method: 'POST',
            body: JSON.stringify({ identifier, identifierType, password }),
        });
        if (response.success && response.data.token) {
            this.setToken(response.data.token);
        }
        return response;
    }

    async changePassword(
        memberCode: string,
        currentPassword: string,
        newPassword: string
    ): Promise<ApiResponse<any>> {
        return this.request('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ memberCode, currentPassword, newPassword }),
        });
    }

    logout() {
        this.clearToken();
    }

    // Members
    async getMembers(params?: {
        page?: number;
        limit?: number;
        search?: string;
        memberStatus?: string;
        baptismStatus?: string;
        confirmationStatus?: string;
        maritalStatus?: string;
        residentialStatus?: string;
        occupation?: string;
        ward?: string;
        birthday?: boolean | string;
        age?: string;
        ageRelational?: string;
        ageValue?: number;
        sortBy?: string;
        sortOrder?: string;
    }): Promise<PaginatedResponse> {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParams.append(key, String(value));
                }
            });
        }
        const query = queryParams.toString();
        return this.request(`/members${query ? `?${query}` : ''}`);
    }

    async getMember(id: string): Promise<ApiResponse<any>> {
        return this.request(`/members/${id}`);
    }

    async createMember(data: any): Promise<ApiResponse<any>> {
        console.log(data);
        return this.request('/members', {
            method: 'POST',
            body: JSON.stringify(data),
        });

    }

    async updateMember(id: string, data: any): Promise<ApiResponse<any>> {
        return this.request(`/members/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async updateMemberStatus(
        id: string,
        memberStatus: string
    ): Promise<ApiResponse<any>> {
        return this.request(`/members/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ memberStatus }),
        });
    }

    async resetMemberPassword(
        id: string,
        newPassword: string,
        confirmPassword: string
    ): Promise<ApiResponse<any>> {
        return this.request(`/members/${id}/reset-password`, {
            method: 'POST',
            body: JSON.stringify({ newPassword, confirmPassword }),
        });
    }

    async setFamilyHead(id: string): Promise<ApiResponse<any>> {
        return this.request(`/members/${id}/set-family-head`, {
            method: 'POST',
        });
    }

    async deleteMember(id: string): Promise<ApiResponse<any>> {
        return this.request(`/members/${id}`, {
            method: 'DELETE',
        });
    }

    async lookupMemberByCode(memberCode: string): Promise<ApiResponse<any>> {
        const queryParams = new URLSearchParams();
        queryParams.append('memberCode', memberCode);
        return this.request(`/members/lookup?${queryParams.toString()}`);
    }


    // Offerings
    async getOfferings(params?: {
        page?: number;
        limit?: number;
        memberId?: string;
        startDate?: string;
        endDate?: string;
        offerType?: string;
        paymentMode?: string;
        search?: string;
    }): Promise<PaginatedResponse> {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParams.append(key, String(value));
                }
            });
        }
        const query = queryParams.toString();
        return this.request(`/offerings${query ? `?${query}` : ''}`);
    }

    async createOffering(data: any): Promise<ApiResponse<any>> {
        return this.request('/offerings', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateOffering(id: string, data: any): Promise<ApiResponse<any>> {
        return this.request(`/offerings/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteOffering(id: string): Promise<ApiResponse<any>> {
        return this.request(`/offerings/${id}`, {
            method: 'DELETE',
        });
    }

    async getOfferingHistory(id: string): Promise<ApiResponse<any>> {
        return this.request(`/offerings/${id}/history`, {
            method: 'GET',
        });
    }

    async getMemberOfferings(memberId: string, params?: {
        startDate?: string;
        endDate?: string;
        offerType?: string;
        includeFamily?: boolean;
    }): Promise<ApiResponse<any>> {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParams.append(key, String(value));
                }
            });
        }
        const query = queryParams.toString();
        return this.request(`/members/${memberId}/offerings${query ? `?${query}` : ''}`);
    }

    // Tickets
    async getTickets(params?: {
        page?: number;
        limit?: number;
        memberId?: string;
        status?: string;
        category?: string;
        priority?: string;
        search?: string;
    }): Promise<PaginatedResponse> {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParams.append(key, String(value));
                }
            });
        }
        const query = queryParams.toString();
        return this.request(`/tickets${query ? `?${query}` : ''}`);
    }

    async getTicket(id: string): Promise<ApiResponse<any>> {
        return this.request(`/tickets/${id}`);
    }

    async createTicket(data: any): Promise<ApiResponse<any>> {
        return this.request('/tickets', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateTicket(id: string, data: any): Promise<ApiResponse<any>> {
        return this.request(`/tickets/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async updateTicketStatus(id: string, status: string, adminNotes?: string): Promise<ApiResponse<any>> {
        return this.request(`/tickets/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status, adminNotes }),
        });
    }

    async getTicketHistory(id: string): Promise<ApiResponse<any>> {
        return this.request(`/tickets/${id}/history`, {
            method: 'GET',
        });
    }

    // Non-Member Offerings
    async getNonMemberOfferings(params?: {
        page?: number;
        limit?: number;
        startDate?: string;
        endDate?: string;
        offerType?: string;
        paymentMode?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: string;
    }): Promise<PaginatedResponse> {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParams.append(key, String(value));
                }
            });
        }
        const query = queryParams.toString();
        return this.request(`/non-member-offerings${query ? `?${query}` : ''}`);
    }

    async createNonMemberOffering(data: any): Promise<ApiResponse<any>> {
        return this.request('/non-member-offerings', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateNonMemberOffering(id: string, data: any): Promise<ApiResponse<any>> {
        return this.request(`/non-member-offerings/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteNonMemberOffering(id: string): Promise<ApiResponse<any>> {
        return this.request(`/non-member-offerings/${id}`, {
            method: 'DELETE',
        });
    }

    async getNonMemberOfferingStatistics(): Promise<ApiResponse<any>> {
        return this.request('/non-member-offerings/statistics');
    }

    // Dashboard
    async getDashboardStats(): Promise<ApiResponse<any>> {
        return this.request('/dashboard/stats');
    }

    // Admin
    async getAdminProfile(): Promise<ApiResponse<any>> {
        return this.request('/admin/profile');
    }

    async updateAdminProfile(data: { name?: string; email?: string }): Promise<ApiResponse<any>> {
        return this.request('/admin/profile', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async changeAdminPassword(
        currentPassword: string,
        newPassword: string
    ): Promise<ApiResponse<any>> {
        return this.request('/admin/change-password', {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword })
        });
    }

    // Admin Users (Church Users)
    async getAdminUsers(): Promise<ApiResponse<any[]>> {
        return this.request('/admin-users');
    }

    async createAdminUser(data: any): Promise<ApiResponse<any>> {
        return this.request('/admin-users', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateAdminUser(id: string, data: any): Promise<ApiResponse<any>> {
        return this.request(`/admin-users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteAdminUser(id: string): Promise<ApiResponse<any>> {
        return this.request(`/admin-users/${id}`, {
            method: 'DELETE'
        });
    }

    async resetAdminUserPassword(id: string): Promise<ApiResponse<any>> {
        return this.request(`/admin-users/${id}/reset-password`, {
            method: 'POST'
        });
    }

    async reformatMemberCodes(): Promise<ApiResponse<any>> {
        return this.request('/maintenance/reformat-member-codes', {
            method: 'POST'
        });
    }
    async getActivityLogs(params?: {
        page?: number;
        limit?: number;
        search?: string;
        module?: string;
        adminId?: string;
    }): Promise<PaginatedResponse> {
        const queryParams = new URLSearchParams();
        if (params) {
            if (params.page) queryParams.append('page', String(params.page));
            if (params.limit) queryParams.append('limit', String(params.limit));
            if (params.search) queryParams.append('search', params.search);
            if (params.module) queryParams.append('module', params.module);
            if (params.adminId) queryParams.append('admin_id', params.adminId);
        }
        const query = queryParams.toString();
        return this.request(`/admin/activity-logs${query ? `?${query}` : ''}`);
    }
}

// Export singleton instance
export const apiClient = new ApiClient();
