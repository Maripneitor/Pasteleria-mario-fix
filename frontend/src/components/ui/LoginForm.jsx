import React from 'react';
import AnimatedInput from './AnimatedInput';
import BakeryButton from './BakeryButton';
import { Card } from './Card';

const LoginForm = ({ onSubmit, email, setEmail, password, setPassword, loading, error }) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card glass className="w-full max-w-md p-8 bg-surface">
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <div className="text-center mb-4">
            <p className="text-2xl font-bold text-text-main">Pastelería La Fiesta</p>
            <p className="text-muted-foreground text-sm mt-1">Inicia sesión para continuar</p>
          </div>

          {error && (
            <div className="bg-red-50 text-status-error text-sm p-3 rounded-lg border border-red-100 flex items-center gap-2" role="alert">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <AnimatedInput
              id="email"
              type="email"
              label="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // error={error ? { message: "Verifica tus credenciales" } : null} // Don't show field error if generic error
              required
            />

            <AnimatedInput
              id="password"
              type="password"
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <BakeryButton
            type="submit"
            variant="solid"
            isLoading={loading}
            className="w-full"
          >
            {loading ? 'Entrando...' : 'Iniciar Sesión'}
          </BakeryButton>

          <div className="flex flex-col items-center gap-4 mt-2">
            <p className="text-sm font-medium text-text-main">¿No tienes cuenta?</p>
            <a
              href="#"
              className="bg-accent text-white hover:bg-black px-4 py-2 rounded-full text-xs font-medium transition-colors"
            >
              Regístrate
            </a>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;
