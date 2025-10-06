// src/components/Footer.tsx

import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna 1: Info de la empresa */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-blue-400">
              Consultores y Asesorías Viales
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Expertos en estudios de impacto vial (IMIV) con más de 10 años de experiencia 
              en proyectos inmobiliarios y de infraestructura.
            </p>
          </div>

          {/* Columna 2: Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-blue-400">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Mail size={16} className="flex-shrink-0 text-blue-400" />
                <a href="mailto:contacto@vialescuadra.cl" className="hover:text-blue-400 transition-colors">
                  contacto@vialescuadra.cl
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Phone size={16} className="flex-shrink-0 text-blue-400" />
                <a href="tel:+56322123456" className="hover:text-blue-400 transition-colors">
                  +56 32 212 3456
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-300">
                <MapPin size={16} className="flex-shrink-0 text-blue-400 mt-1" />
                <span>Viña del Mar, Región de Valparaíso, Chile</span>
              </div>
            </div>
          </div>

          {/* Columna 3: Enlaces rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-blue-400">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Servicios
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Proyectos
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>
              © {currentYear} Consultores y Asesorías Viales de la Cuadra Ltda. Todos los derechos reservados.
            </p>
            <p className="flex items-center gap-2">
              Hecho con <Heart size={16} className="text-red-500 animate-pulse" /> para mejorar la vialidad
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;