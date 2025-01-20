import React, { useEffect, useState } from 'react';
import { useModalFunctions } from '../../hooks/useModalFunctions';
import { useNetwork } from '../../context/NetwokrContext';

interface ModalFichasProps {
    nodeId: string | null;
    isOpen: boolean;
    onClose: () => void; 
}

const ModalFichas: React.FC<ModalFichasProps> = ({ nodeId, isOpen, onClose }) => {
    
    const [findedNode, setFindedNode] = useState<any>(null);

    console.log('MODAL FICHAS MODAL FICHAS', nodeId,isOpen);

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

    const { handleSearchDetenidoCon }  = useModalFunctions({});
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 9999 }}>
            <div className="bg-white p-4 rounded w-1/4 overflow-auto">
                <div className="flex justify-between items-center">
                    <h2 className='text-xl'>EXPANDIR FICHA</h2>
                    <button onClick={handleClose} className="text-black">
                        &times;
                    </button>
                </div>
                {findedNode && findedNode.data && Array.isArray(findedNode.data.remisiones) && (
                    <div>
                        {findedNode.data.remisiones.map((remision:any, index:any) => (
                            <div key={index}>
                                <p>{remision.Ficha}</p>
                                <button 
                                    onClick={() => handleSearchDetenidoCon(findedNode,remision.Ficha,remision.No_Remision)} 
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

export default ModalFichas;