import apiClient from '../../api/apiClient';
import { API_ENDPOINTS } from '../../api/endpoints';

export const authService = {
  async login(credentials) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      if (response?.token) {
        apiClient.setToken(response.token);
      }
      return response;
    } catch (error) {
      // Fallback demo support if backend is offline
      if (error.status === 503 || error.status === 404) {
        const isAdmin = credentials.email.toLowerCase().includes('admin') || credentials.role === 'admin';
        const mockUser = {
          id: isAdmin ? 'usr_admin_01' : 'usr_emp_01',
          name: isAdmin ? 'Sarah Connor (HR Director)' : 'Alex Mercer (Lead Engineer)',
          email: credentials.email,
          role: isAdmin ? 'admin' : 'employee',
          department: isAdmin ? 'Human Resources' : 'Engineering',
          title: isAdmin ? 'VP of People & Culture' : 'Senior Fullstack Engineer',
          avatarUrl: '',
        };
        const mockToken = 'mock_dayflow_jwt_token_sample';
        apiClient.setToken(mockToken);
        return { user: mockUser, token: mockToken };
      }
      throw error;
    }
  },

  async register(userData) {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  },

  async getCurrentUser() {
    const token = apiClient.getToken();
    if (!token) return null;

    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
      return response?.user || response;
    } catch (error) {
      if (token === 'mock_dayflow_jwt_token_sample') {
        return {
          id: 'usr_admin_01',
          name: 'Sarah Connor (HR Director)',
          email: 'admin@dayflow.os',
          role: 'admin',
          department: 'Human Resources',
          title: 'VP of People & Culture',
        };
      }
      throw error;
    }
  },

  logout() {
    apiClient.setToken(null);
  },
};

export default authService;
