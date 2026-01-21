import { useNavigate } from 'react-router-dom';
import FolioForm from '../components/FolioForm';

const NewFolio = () => {
    const navigate = useNavigate();

    const handleSuccess = () => {
        alert('Pedido creado exitosamente');
        navigate('/folios');
    };

    const handleCancel = () => {
        navigate('/folios');
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Nuevo Pedido</h1>
            <FolioForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
    );
};

export default NewFolio;
