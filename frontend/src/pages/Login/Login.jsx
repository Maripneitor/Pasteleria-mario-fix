import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import LoginForm from '../../components/ui/LoginForm';
import { motion } from 'framer-motion';

import CakeLoader from '../../components/ui/CakeLoader';

const Login = () => {
    // ... existing state ...
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    // If already logged in, redirect
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        // Demo delay to show animation (optional for dev, helpful here)
        // await new Promise(resolve => setTimeout(resolve, 2000)); 
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError('Credenciales inválidas. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative">
            <CakeLoader isLoading={loading} />
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                className="w-full max-w-md flex justify-center"
            >
                <LoginForm
                    onSubmit={handleSubmit}
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    loading={loading}
                    error={error}
                />
            </motion.div>
        </div>
    );
};

export default Login;
