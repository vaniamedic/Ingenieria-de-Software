import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className="font-semibold text-gray-800">
              Consultores y Asesorías Viales de la Cuadra Ltda.
            </span>
            <span className="hidden sm:inline text-gray-400">•</span>
            <span>Sistema de Gestión IMIV v1.0</span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span>© {currentYear}</span>
            <span className="hidden sm:inline text-gray-400">•</span>
            <span className="text-gray-500">Viña del Mar, Chile</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;