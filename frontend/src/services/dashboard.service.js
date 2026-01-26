import api, { withFallback } from '../api/axios';
import { mockOwnerMetrics, mockDeveloperMetrics } from '../mocks/dashboard.fixtures';

const getOwnerMetrics = async () => {
    return withFallback(
        async () => {
            const response = await api.get('/dashboard/owner');
            return response.data;
        },
        mockOwnerMetrics
    ).then(res => res.data || res); // Handle both direct mock return and axios response structure if needed, but withFallback standardizes to returning what apiCall returns. 
    // wait, withFallback returns { data: mockData } or result of apiCall(). apiCall returns response. response.data is what we want. 
    // If withFallback returns mock, it returns { data: mockData }. So safely accessing .data is tricky if apiCall returns just data.
    // My withFallback implementation:
    // If mock: returns { data: mockData }
    // If api: returns response (which has .data)
    // So both return an object with .data. 
    // BUT the original service returned response.data directory. 
    // So I need to unwrap it.
};

const getDeveloperMetrics = async () => {
    return withFallback(
        async () => {
            return await api.get('/dashboard/developer');
        },
        mockDeveloperMetrics
    ).then(res => res.data);
};

export default {
    getOwnerMetrics,
    getDeveloperMetrics
};
