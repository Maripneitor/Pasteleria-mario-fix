import { useAuth } from '../context/AuthContext';

const RoleBasedView = ({ allowedRoles, children }) => {
    const { user } = useAuth();

    if (!user || !allowedRoles.includes(user.role)) {
        return null;
    }

    return children;
};

export default RoleBasedView;
