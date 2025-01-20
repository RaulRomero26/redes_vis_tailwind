import React, { useEffect, useState } from 'react';
import { useModalFunctions } from '../../hooks/useModalFunctions';
import { useNetwork } from '../../context/NetwokrContext';

interface ModalContactosProps {
    nodeId: string | null;
    isOpen: boolean;
    onClose: () => void; 
}

const ModalContactos: React.FC<ModalContactosProps> = ({ nodeId, isOpen, onClose }) => {
    console.log('MODAL CONTACTOS', nodeId,isOpen);

    const [findedNode, setFindedNode] = useState<any>(null);

    const { nodes } = useNetwork();

    useEffect(() => {
        if (nodeId) {
            const node = nodes.get(nodeId);
            setFindedNode(node);
        }
    }, [nodeId]);

    const handleClose = () => {
        onClose();
    };

    const { handleSearchContactos }  = useModalFunctions({});
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 9999 }}>
            <div className="bg-white p-4 rounded w-1/4 overflow-auto">
                <div className="flex justify-between items-center">
                    <h2 className='text-xl'>EXPANDIR CONTACTOS</h2>
                    <button onClick={handleClose} className="text-black">
                        &times;
                    </button>
                </div>
                {findedNode && (
                    <div>
                        {findedNode.data.remisiones.map((remision:any, index:any) => (
                            <div key={index}>
                                <p>{remision.No_Remision}</p>
                                <button 
                                    onClick={() => handleSearchContactos(findedNode,remision.Ficha,remision.No_Remision)} 
                                    className="ml-2 p-1 bg-blue-500 text-white rounded"
                                >
                                    Expandir
                                </button>
                            </div>
                            
                        ))}
                    </div>
     
            )}
            </div>
        </div>
    );
};

export default ModalContactos;