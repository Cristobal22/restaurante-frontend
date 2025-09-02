
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BarView: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <header className="bg-gray-800 shadow-lg">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">Restaurant Manager</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        Cerrar Sesión
                    </button>
                </nav>
            </header>
            <main className="flex-grow container mx-auto px-6 py-12">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                        <span className="block">Menú Principal del</span>
                        <span className="block text-indigo-400">Bar</span>
                    </h2>
                    <p className="mt-4 max-w-md mx-auto text-lg text-gray-400 sm:text-xl md:mt-5 md:max-w-3xl">
                        Bienvenido al panel de control. Aquí podrás gestionar las órdenes y el menú de tu restaurante.
                    </p>
                </div>

                {/* Future content goes here */}
                <div className="mt-12 p-8 bg-gray-800 rounded-xl shadow-md">
                     <h3 className="text-2xl font-bold text-center">Próximamente...</h3>
                     <p className="text-center text-gray-400 mt-2">Más funcionalidades serán añadidas aquí.</p>
                </div>
            </main>
            <footer className="bg-gray-800 text-center py-4">
                <p className="text-gray-500">&copy; 2024 Restaurant Manager. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default BarView;
