import api, { withFallback } from '../api/axios';
import { mockSession, mockSessionsList } from '../mocks/ai-sessions.fixtures';

const getSessions = async () => {
    return withFallback(
        async () => {
            const response = await api.get('/ai-sessions');
            return response.data;
        },
        mockSessionsList
    );
};

const getSessionById = async (id) => {
    return withFallback(
        async () => {
            const response = await api.get(`/ai-sessions/${id}`);
            return response.data;
        },
        { ...mockSession, id }
    );
};

export default {
    getSessions,
    getSessionById
};
