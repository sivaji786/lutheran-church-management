// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Types
export interface LoginResponse {
    success: boolean;
    data: {
        userId: string;
        username?: string;
        memberCode?: string;
        name?: string;
        role: string;
        memberStatus?: string;
        token: string;
        expiresIn: number;
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
            const error = await response.json().catch(() => ({
                message: 'An error occurred',
            }));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
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
        birthday?: boolean;
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

    async getMemberOfferings(memberId: string, params?: {
        startDate?: string;
        endDate?: string;
        offerType?: string;
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

    async updateTicketStatus(id: string, status: string): Promise<ApiResponse<any>> {
        return this.request(`/tickets/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
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
}

// Export singleton instance
export const apiClient = new ApiClient();
