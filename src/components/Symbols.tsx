import { useState } from 'react';
import persona from '../assets/persona.png';
import telefono from '../assets/telefono-inteligente.png';
import vehiculo from '../assets/vehiculo.png';
import consulta from '../assets/inspeccion.png';
import { VscSymbolVariable } from "react-icons/vsc";

export const Symbols = () => {
    const [visible, setVisible] = useState(false);

    const toggleVisibility = () => {
        console.log('toggleVisibility', visible);
        setVisible(!visible);
    };

    return (
        <>
            <button 
                onClick={toggleVisibility} 
                className="fixed bg-white p-2 rounded-full shadow-lg" 
                style={{ bottom: `80vh`, right: `96vw`, zIndex: 9999 }}
            >
                <VscSymbolVariable className="w-8 h-8" />
            </button>
            {visible && (
                <div 
                    className="fixed bg-white p-4 rounded-lg shadow-lg w-64" 
                    style={{ bottom: `57vh`, right: `85vw` }}
                >
                    <h2 className="text-lg font-bold mb-4">Simbología</h2>
                    <div className="flex items-center mb-2">
                        <img src={persona} alt="Persona" className="w-8 h-8 mr-2" />
                        <span>Persona</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <img src={telefono} alt="Teléfono Inteligente" className="w-8 h-8 mr-2" />
                        <span>Teléfono</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <img src={vehiculo} alt="Vehículo" className="w-8 h-8 mr-2" />
                        <span>Vehículo</span>
                    </div>
                    <div className="flex items-center">
                        <img src={consulta} alt="Consulta" className="w-8 h-8 mr-2" />
                        <span>Consulta</span>
                    </div>
                </div>
            )}
        </>
    );
};
