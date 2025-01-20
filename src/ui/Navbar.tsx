import { useState,useEffect } from 'react';
import { FaUser,FaPhone, FaCarAlt, FaTrashAlt   } from 'react-icons/fa'; // Instalación: yarn add react-icons
import { SiSmartthings } from "react-icons/si";
import SaveNetwork  from '../components/SaveNetwork';
import graph from '../assets/graph.png';
import { IoAnalyticsOutline } from 'react-icons/io5';
import { useNetwork } from '../context/NetwokrContext';
import FisicasCheck from '../components/FisicasCheck';
import { TbPresentationAnalytics } from "react-icons/tb";




interface DropdownMenuProps {
  handleMenuClick: (entidad: string) => void;
  isOpenAnalytics: boolean;
  setIsOpenAnalytics: (isOpen: boolean) => void;
}


const DropdownMenu: React.FC<DropdownMenuProps> = ({ handleMenuClick, isOpenAnalytics, setIsOpenAnalytics }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGraphMenuOpen, setIsGraphMenuOpen] = useState(false);


  const {network, fisicas, setFisicas } = useNetwork();

  const togleAnalytics = () => {
    setIsOpenAnalytics(!isOpenAnalytics);
  }
  
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleGraphMenu = () => {
    setIsGraphMenuOpen(!isGraphMenuOpen);
  };
  
  const handleAddEdge = () => {
    network?.addEdgeMode();
    toggleGraphMenu();
  };
  
  const handleDeleteNodes = () => {
    network?.deleteSelected();
    toggleGraphMenu();
  }
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        if (isOpen) {
          toggleMenu();
        }
        if (isGraphMenuOpen) {
          toggleGraphMenu();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isGraphMenuOpen]);

  return (
    <nav className="bg-blue-950 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src={graph} alt="Graph" className="h-8 w-8 mr-2" />
          <div className="text-white text-lg">Analisis de Redes</div>
        </div>
        <div>
          <button onClick={togleAnalytics} className="text-white bg-blue-700 hover:bg-blue-600 p-2 rounded-md flex items-center">
            <TbPresentationAnalytics className="mr-2" />
            Analiticas
          </button>
        </div>
        <div>
          <SaveNetwork />
        </div>
        <div className="relative flex space-x-4">
          <div>
            <button
              onClick={toggleGraphMenu}
              className="text-white bg-blue-700 hover:bg-blue-600 p-2 rounded-md flex items-center"
            >
              <IoAnalyticsOutline className="mr-2" />
              Grafo
            </button>
            {isGraphMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
          <a className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={handleAddEdge}>
            <IoAnalyticsOutline className="mr-2" /> Añadir Arista
          </a>
          <a className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={handleDeleteNodes}>
            <FaTrashAlt className="mr-2" /> Eliminar Elemento
          </a>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={toggleMenu}
              className="text-white bg-blue-700 hover:bg-blue-600 p-2 rounded-md flex items-center"
            >
              <SiSmartthings className="mr-2" />Agregar entidad
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
          <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={() => { handleMenuClick('persona'); toggleMenu(); }}>
            <FaUser className="mr-2" /> Persona
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={() => { handleMenuClick('telefono'); toggleMenu(); }}>
            <FaPhone className="mr-2" /> Telefono
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={() => { handleMenuClick('vehiculo'); toggleMenu(); }}>
            <FaCarAlt className="mr-2" /> Vehiculo
          </a>
              </div>
            )}
          </div>

          <FisicasCheck fisicas={fisicas} setFisicas={setFisicas}/>
        </div>
      </div>
    </nav>
  );
}

export default DropdownMenu;
