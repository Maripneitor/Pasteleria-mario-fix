import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';

const RoleBasedView = ({ permission, children }) => {
    const { hasPermission } = useAuth();

    if (hasPermission(permission) || hasPermission('admin.access')) {
        return children;
    }
    return null;
};

RoleBasedView.propTypes = {
    permission: PropTypes.string.isRequired,
    children: PropTypes.node
};

export default RoleBasedView;
