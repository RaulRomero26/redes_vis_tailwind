import { useEffect, useState } from "react";
import { NodeData } from "../helpers/createNodeData";
import { FaArrowRight } from "react-icons/fa";
import { useNetwork } from "../context/NetwokrContext";
import { useInteraction } from "../hooks/useInteraction";

interface ContextMenuProps {
  x: number;
  y: number;
  nodeId: string | null;
  edgeId: string | null;
  onClose: () => void;
//   onShowDetails: (node: NodeData) => void;
  onSearchExtended: (query: string) => void;
  onEditAttributes: (node?: NodeData, edge?: any) => void;
}

const rules: { [key: string]: (node: NodeData) => boolean | any } = {
  'Buscar Maestro': (node: NodeData) => (node.type === 'persona' || node.type === 'entrada-persona' || node.type === 'entada-vehiculo' || node.type === 'vehiculo' || node.type === 'contacto'),
  'Extraer Telefonos': (node: NodeData) => node.entidad === 'persona' && node.atributos.Telefono,
  'Telefono Remisiones': (node: NodeData) => node.type === 'telefono' || node.type === 'entrada-telefono',
  'Telefono Contactos': (node: NodeData) => node.type === 'telefono' || node.type === 'entrada-telefono',
  'Telefono 911': (node: NodeData) => node.type === 'telefono' || node.type === 'entrada-telefono',
  'Consultas': (node: NodeData) => (node.entidad === 'persona' || node.entidad === 'vehiculo') && node.type != 'inspeccion',
  'Extraer Personas': (node: NodeData) => node.type === 'inspeccion',
  'Extraer Vehiculos': (node: NodeData) => node.type === 'inspeccion',
  'Detenido Con': (node: NodeData) => node.entidad === 'persona' && node.atributos.detenciones && node.atributos.detenciones.sarai,
  'Extraer Contactos': (node: NodeData) => node.entidad === 'persona' && node.atributos.detenciones && node.atributos.detenciones.sarai,
  'Integrantes Banda': (node: NodeData) => node.entidad === 'persona' && node.atributos.aura && node.atributos.aura.aura,
  // Agrega más reglas según sea necesario
};

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, nodeId, edgeId, onSearchExtended, onClose, onEditAttributes }) => {
  const [_nodeDetails, setNodeDetails] = useState<any>(null);
  const [_edgeDetails, setEdgeDetails] = useState<any>(null);

  const { nodes, edges } = useNetwork();
  const { onSeleccionarConexionesFinales, onSeleccionarPersonas, onSeleccionarInspecciones, onSeleccionarVehiculos, onSeleccionarTelefonos,onSeleccionarNodosConInformacion } = useInteraction(nodeId || '');

  useEffect(() => {
    if (nodeId) {
      const details = nodes.get(nodeId);
      setNodeDetails(details);
    } else if (edgeId) {
      const details = edges.get(edgeId);
      setEdgeDetails(details);
    }
  }, [nodeId, edgeId]);

  const isOptionEnabled = (option: string) => {
    if (!_nodeDetails) return false;
    const rule = rules[option as keyof typeof rules];
    return rule ? rule(_nodeDetails) : true;
  };

    const handleEdit = () => {
      if (_nodeDetails) {
        onEditAttributes(_nodeDetails, null);
      } else if (_edgeDetails) {
        onEditAttributes(_edgeDetails, null);
      }
      onClose();
    };

  return (
    <>
      <div style={{ position: 'absolute', top: y, left: x, zIndex: 1000 }} className="shadow-lg ring-1 w-50 ring-[#1f283a] ring-opacity-5 bg-white">
        <ul className=" ">
          <li className="font-bold p-1">AÑADIR ATRIBUTOS</li>
          <li className={`p-1 px-4 ${!isOptionEnabled('Buscar Maestro') ? 'bg-gray-300 cursor-not-allowed disabled' : 'cursor-pointer hover:bg-gray-200'}`} onClick={() => onSearchExtended('Buscar Maestro')} >CONSULTAR<span>&#8250;</span></li>
          <li className={`cursor-pointer hover:bg-gray-200 p-1 px-4`} onClick={handleEdit}>EDITAR ATRIBUTOS</li>
          <li className="font-bold">EXPANDIR NODOS</li>
          <li className="group relative px-4 hover:bg-gray-200" >
            <button className="flex w-full items-center justify-between space-x-3 ">
              <span>AGREGAR</span>
              <FaArrowRight />
            </button>
            <div className="invisible absolute top-0 left-full w-60 transform opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 z-50">
              <ul className="mt-1 shadow-lg ring-1 ring-[#1f283a] ring-opacity-5 bg-white">
                <li className="font-bold">NO TELEFONICO</li>
                <li className={`p-1 ${!isOptionEnabled('Extraer Telefonos') ? 'bg-gray-300 cursor-not-allowed disabled' : 'cursor-pointer hover:bg-gray-200'}`} onClick={() => onSearchExtended('Extraer Telefonos')}>EXTRAER TELEFONO(S)</li>
                <li className={`p-1 ${!isOptionEnabled('Telefono Remisiones') ? 'bg-gray-300 cursor-not-allowed disabled' : 'cursor-pointer hover:bg-gray-200'}`} onClick={() => onSearchExtended('Telefono Remisiones')}>BUSCAR EN DETENIDOS</li>
                <li className={`p-1 ${!isOptionEnabled('Telefono Contactos') ? 'bg-gray-300 cursor-not-allowed disabled' : 'cursor-pointer hover:bg-gray-200'}`} onClick={() => onSearchExtended('Telefono Contactos')}>BUSCAR EN CONTACTOS</li>
                <li className={`p-1 ${!isOptionEnabled('Telefono 911') ? 'bg-gray-300 cursor-not-allowed disabled' : 'cursor-pointer hover:bg-gray-200'}`} onClick={() => onSearchExtended('Telefono 911')}>BUSCAR EN 911</li>
                <li className="font-bold">INSPECCIONES</li>
                <li className={`p-1 ${!isOptionEnabled('Consultas') ? 'bg-gray-300 cursor-not-allowed disabled' : 'cursor-pointer hover:bg-gray-200'}`} onClick={() => onSearchExtended('Consultas')} >CONSULTAR</li>
                <li className={`p-1 ${!isOptionEnabled('Extraer Personas') ? 'bg-gray-300 cursor-not-allowed disabled' : 'cursor-pointer hover:bg-gray-200'}`} onClick={() => onSearchExtended('Extraer Personas')} >EXTRAER PERSONAS</li>
                <li className={`p-1 ${!isOptionEnabled('Extraer Vehiculos') ? 'bg-gray-300 cursor-not-allowed disabled' : 'cursor-pointer hover:bg-gray-200'}`} onClick={() => onSearchExtended('Extraer Vehiculos')} >EXTRAER VEHICULOS</li>
                <li className="font-bold">REMISIONES</li>
                <li className={`p-1 ${!isOptionEnabled('Detenido Con') ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'}`} onClick={() => onSearchExtended('Detenido Con')}>DETENIDO CON</li>
                <li className={`p-1 ${!isOptionEnabled('Extraer Contactos') ? 'bg-gray-300 cursor-not-allowed': 'cursor-pointer hover:bg-gray-200'}`} onClick={() => onSearchExtended('Extraer Contactos')} >CONTACTOS REF</li>
                <li className="font-bold">A.U.R.A.</li>
                <li className={`p-1 ${!isOptionEnabled('Integrantes Banda') ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'}`} onClick={() => onSearchExtended('Integrantes Banda')}>EXTRAER BANDA</li>
              </ul>
            </div>
          </li>
            <li className="font-bold">INTERACCION</li>
            <li className="group relative px-4 hover:bg-gray-200">
            <button className="flex w-full items-center justify-between space-x-3">
              <span>SELECCIONAR</span>
              <FaArrowRight />
            </button>
            <div className="invisible absolute top-0 left-full w-60 transform opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 z-50">
              <ul className="mt-1 shadow-lg ring-1 ring-[#1f283a] ring-opacity-5 bg-white">
                <li className="cursor-pointer hover:bg-gray-200 p-1 px-4" onClick={() => { onSeleccionarConexionesFinales(); onClose(); }}>CONEXIONES Y FINALES</li>
                <li className="cursor-pointer hover:bg-gray-200 p-1 px-4" onClick={() => { onSeleccionarNodosConInformacion(); onClose(); }}>NODOS CON INFORMACION</li>
                <li className="cursor-pointer hover:bg-gray-200 p-1 px-4" onClick={() => { onSeleccionarPersonas(); onClose(); }}>PERSONAS</li>
                <li className="cursor-pointer hover:bg-gray-200 p-1 px-4" onClick={() => { onSeleccionarInspecciones(); onClose(); }}>INSPECCIONES</li>
                <li className="cursor-pointer hover:bg-gray-200 p-1 px-4" onClick={() => { onSeleccionarVehiculos(); onClose(); }}>VEHICULOS</li>
                <li className="cursor-pointer hover:bg-gray-200 p-1 px-4" onClick={() => { onSeleccionarTelefonos(); onClose(); }}>TELEFONOS</li>
              </ul>
            </div>
            </li>
          <li className="cursor-pointer hover:bg-gray-200 p-1 px-4" onClick={onClose}>CERRAR</li>
        </ul>
      </div>
    </>
  );
};

export default ContextMenu;