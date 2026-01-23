import { useAuth } from '../../contexts/AuthContext';
import PropTypes from 'prop-types';

const RoleBasedView = ({ permission, allowedRoles, children, fallback = null }) => {
    const { user, hasPermission } = useAuth();

    // 1. Check by Permission (Existing Logic)
    if (permission) {
        if (hasPermission(permission) || hasPermission('admin.access')) {
            return children;
        }
    }

    // 2. Check by Role (Requested Logic)
    if (allowedRoles && user) {
        if (allowedRoles.includes(user.role)) {
            return children;
        }
    }

    return fallback;
};

RoleBasedView.propTypes = {
    permission: PropTypes.string,
    allowedRoles: PropTypes.arrayOf(PropTypes.string),
    children: PropTypes.node,
    fallback: PropTypes.node
};

export default RoleBasedView;
