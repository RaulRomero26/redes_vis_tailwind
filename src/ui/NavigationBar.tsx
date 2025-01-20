import { useState, useEffect, useRef } from "react";
import { FaUser,FaPhone, FaCarAlt, FaTrashAlt, FaDatabase, FaNetworkWired } from 'react-icons/fa'; // Instalación: yarn add react-icons
import { SiSmartthings } from "react-icons/si";
import { TbPresentationAnalytics } from "react-icons/tb";
import { IoAnalyticsOutline } from 'react-icons/io5';
import { MdOutlineSave, MdOutlineUploadFile, MdFilterCenterFocus  } from "react-icons/md";
import nodo from "../assets/graph.png";
import { useNetwork } from "../context/NetwokrContext";
import { useSaveLoadNetwork } from "../hooks/useSaveLoadNetwork";
import FisicasCheck from "../components/FisicasCheck";
import { useCluster } from "../hooks/useCluster";
import { useWeight } from "../hooks/useWeight";


interface NavigationBarProps {
    handleMenuClick: (entidad: string) => void;
    isOpenAnalytics: boolean;
    setIsOpenAnalytics: (isOpen: boolean) => void;
    setIsOpenWeight: (isOpen: boolean) => void;
}
  

export const NavigationBar:React.FC<NavigationBarProps> = ({ handleMenuClick, isOpenAnalytics, setIsOpenAnalytics, setIsOpenWeight }) => {
  const [dropdownEntidadOpen, setDropdownEntidadOpen] = useState(false);
  const [dropdownRedOpen, setDropdownRedOpen] = useState(false);
  const [dropdownGrafoOpen, setDropdownGrafoOpen] = useState(false);
  const [dropdownClusterOpen, setDropdownClusterOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { network, fisicas, setFisicas } = useNetwork();
  const { saveGraph, loadGraph, fileInputRef } = useSaveLoadNetwork();
  const { onClusterNoPersonas, onClusterNoInspecciones, onClusterNoTelefonos, onClusterNoVehiculos, onOpenClusters} = useCluster();
  const { establishCenter } = useWeight();

  const toggleDropdown = (event: React.MouseEvent) => {
    console.log((event.target as HTMLElement).textContent);
    event.stopPropagation();
    event.preventDefault();
    switch ((event.target as HTMLElement).textContent) {
        case 'Nueva Entidad':
            setDropdownEntidadOpen((prevState) => !prevState);
            break;
        case 'Red':
            setDropdownRedOpen((prevState) => !prevState);
            break;
        case 'Grafo':
            setDropdownGrafoOpen((prevState) => !prevState);
            break;
        case 'Cluster':
            setDropdownClusterOpen((prevState) => !prevState);
            break;
        
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
        setDropdownEntidadOpen(false);
        setDropdownRedOpen(false);
        setDropdownGrafoOpen(false);
        setDropdownClusterOpen(false);
    }
  };

  const togleAnalytics = () => {
    setIsOpenAnalytics(!isOpenAnalytics);
  }

  const handleAddEdge = () => {
    network?.addEdgeMode();
  };

  const handleDeleteNodes = () => {
    network?.deleteSelected();
  };

  const handleOpenWeight = () => {
    setIsOpenWeight(true);
  }

  useEffect(() => {
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, []);


  return (
    <nav className="bg-blue-900 border-blue-700 dark:bg-blue-900 dark:border-blue-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={nodo} className="h-8" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            Analisis de Redes
          </span>
        </a>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-collapse-toggle="navbar-dropdown"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-dropdown"
          aria-expanded={mobileMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`${
            mobileMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto`}
          id="navbar-dropdown"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-blue-900 dark:bg-blue-900 md:dark:bg-blue-900 dark:border-blue-700">
            <li>
              <a
                href="#"
                className="inline-flex items-center w-full py-2 px-3 text-white rounded md:bg-transparent md:p-0 md:dark:bg-transparent"
                aria-current="page"
                onClick={togleAnalytics}
              >
                <TbPresentationAnalytics className="mr-2"/>Analisis
              </a>
            </li>
            <li>
              <button
                id="dropdownNavbarLink"
                onClick={(e) => toggleDropdown(e)}
                className="flex items-center justify-between w-full py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-white md:dark:hover:bg-transparent"
              >
                <SiSmartthings className="mr-2"/>Nueva Entidad
                <svg
                  className="w-2.5 h-2.5 ms-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <div
                ref={dropdownRef}
                id="dropdownNavbar"
                className={`z-10 ${
                  dropdownEntidadOpen ? "block" : "hidden"
                } font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-white dark:divide-gray-600 absolute mt-2`}
              >
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-400"
                  aria-labelledby="dropdownLargeButton"
                >
                  <li>
                    <a href="#" className="inline-flex items-center w-full px-4 py-2 hover:bg-gray-300" onClick={() => { handleMenuClick('persona');}}>
                      <FaUser className="mr-2"/> <span>Persona</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="inline-flex items-center w-full px-4 py-2 hover:bg-gray-300" onClick={() => { handleMenuClick('vehiculo');}}>
                      <FaCarAlt className="mr-2"/>Vehiculo
                    </a>
                  </li>
                  <li>
                    <a href="#" className="inline-flex items-center w-full px-4 py-2 hover:bg-gray-300" onClick={() => { handleMenuClick('telefono');}}>
                      <FaPhone className="mr-2"/>Telefono
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <button
                id="graphButton"
                onClick={(e) => toggleDropdown(e)}
                className="flex items-center justify-between w-full py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-white md:dark:hover:bg-transparent"
              >
                < FaNetworkWired className="mr-2"/>Red
                <svg
                  className="w-2.5 h-2.5 ms-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <div
                ref={dropdownRef}
                id="dropdownNavbar"
                className={`z-10 ${
                  dropdownRedOpen ? "block" : "hidden"
                } font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-white dark:divide-gray-600 absolute mt-2`}
              >
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-400"
                  aria-labelledby="dropdownLargeButton"
                >
                  <li>
                    <a href="#" className="inline-flex items-center w-full px-4 py-2 hover:bg-gray-300" onClick={saveGraph} id="saveGraph">
                      <MdOutlineSave className="mr-2"/>Guardar Red
                    </a>
                  </li>
                  <li>
                    <a href="#" className="inline-flex items-center w-full px-4 py-2 hover:bg-gray-300" onClick={() => fileInputRef.current?.click()} id="loadGraph">
                        <input
                            type="file"
                            accept=".json"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={loadGraph}
                        />
                      <MdOutlineUploadFile className="mr-2"/>Cargar Red
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <button
                id="dropdownNavbarLink"
                onClick={(e) => toggleDropdown(e)}
                className="flex items-center justify-between w-full py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-white md:dark:hover:bg-transparent"
              >
                <IoAnalyticsOutline className="mr-2"/>Grafo
                <svg
                  className="w-2.5 h-2.5 ms-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <div
                ref={dropdownRef}
                id="dropdownNavbar"
                className={`z-10 ${
                  dropdownGrafoOpen ? "block" : "hidden"
                } font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-white dark:divide-gray-600 absolute mt-2`}
              >
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-400"
                  aria-labelledby="dropdownLargeButton"
                >
                  <li>
                    <a href="#" className="inline-flex items-center w-full px-4 py-2 hover:bg-gray-300"  onClick={handleAddEdge}>
                    <IoAnalyticsOutline className="mr-2"/>Añadir Arista
                    </a>
                  </li>
                  <li>
                    <a href="#" className="inline-flex items-center w-full px-4 py-2 hover:bg-gray-300" onClick={handleDeleteNodes}>
                      <FaTrashAlt className="mr-2"/>Eliminar Elemento
                    </a>
                  </li>
                  <li>
                    <a href="#" className="inline-flex items-center w-full px-4 py-2 hover:bg-gray-300" onClick={establishCenter}>
                      <MdFilterCenterFocus className="mr-2"/>Establecer Centro
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <button
                id="dropdownNavbarLink"
                onClick={(e) => toggleDropdown(e)}
                className="flex items-center justify-between w-full py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-white md:dark:hover:bg-transparent"
              >
                <FaDatabase className="mr-2"/>Cluster
                <svg
                  className="w-2.5 h-2.5 ms-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <div
                ref={dropdownRef}
                id="dropdownNavbar"
                className={`z-10 ${
                  dropdownClusterOpen ? "block" : "hidden"
                } font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-white dark:divide-gray-600 absolute mt-2`}
              >
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-400"
                  aria-labelledby="dropdownLargeButton"
                >
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-300" onClick={onClusterNoPersonas}>
                      Dejar Personas
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-300" onClick={onClusterNoInspecciones}>
                      Dejar Inspecciones
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-300" onClick={onClusterNoVehiculos}>
                      Dejar Vehiculos
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-300" onClick={onClusterNoTelefonos}>
                      Dejar Telefonos
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-300" onClick={handleOpenWeight}>
                      Cluster Por Peso
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-300" onClick={onOpenClusters}>
                      Abrir Clusters
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li>
                <FisicasCheck fisicas={fisicas} setFisicas={setFisicas}/>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
