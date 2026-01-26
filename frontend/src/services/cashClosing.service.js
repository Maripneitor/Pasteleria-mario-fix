import api, { withFallback } from '../api/axios';
import { mockCashClose } from '../mocks/dashboard.fixtures';

const getCashClosingData = async (date) => {
    return withFallback(
        async () => {
            const response = await api.get(`/folios/cash-close?date=${date}`);
            return response.data;
        },
        mockCashClose
    );
};

export default {
    getCashClosingData
};
