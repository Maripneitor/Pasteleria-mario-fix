import api from './api';

const getOwnerMetrics = async () => {
    try {
        const response = await api.get('/dashboard/owner');
        return response.data;
    } catch (error) {
        console.error('Error fetching owner metrics:', error);
        throw error;
    }
};

const getDeveloperMetrics = async () => {
    try {
        const response = await api.get('/dashboard/developer');
        return response.data;
    } catch (error) {
        console.error('Error fetching developer metrics:', error);
        throw error;
    }
};

export default {
    getOwnerMetrics,
    getDeveloperMetrics
};
