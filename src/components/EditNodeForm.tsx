import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNetwork } from '../context/NetwokrContext';

interface EditNodeFormProps {
    nodeId?: string | null;
    edgeId?: string | null;
    onRequestClose: () => void;
}

const recreateLabel = (node: any) => {
    if (!node) return '';
    let newLabel = '';
    const allEditablesEmpty = Object.values(node.editables || {}).every(value => !value);
    const allAtributosEmpty = Object.values(node.atributos || {}).every(value => !value);
    if (allEditablesEmpty && allAtributosEmpty) {
        return node.label;
    }

    switch (node.type) {
        case 'persona':
        case 'entrada-persona':
        case 'contacto':
            newLabel = [
                node.label && `${node.atributos.Nombre} ${node.atributos.Ap_Paterno} ${node.atributos.Ap_Materno}`.trim().toUpperCase(),
                node.atributos?.Telefono ? `<b>Telefono: </b> ${node.atributos?.Telefono}` : '',
                node.visibles?.remisiones_label && node.editables?.remisiones_label || '',
                node.visibles?.alias && node.editables?.alias ? `<b>Alias:</b> ${node.editables.alias}` : '',
                node.visibles?.fecha_detencion && node.editables?.fecha_detencion ? `<b>Fecha Detencion:</b> ${node.editables.fecha_detencion}` : '',
                node.visibles?.no_remision && node.editables?.no_remision ? `<b>No Remision:</b> ${node.editables.no_remision}` : '',
                node.visibles?.curp && node.editables?.curp ? `<b>CURP:</b> ${node.editables.curp}` : '',
                node.visibles?.fecha_nacimiento && node.editables?.fecha_nacimiento ? `<b>Fecha Nacimiento:</b> ${node.editables.fecha_nacimiento}` : '',
                node.visibles?.delitos && node.editables?.delitos ? `<b>Delitos:</b> ${node.editables.delitos}` : '',
                node.visibles?.domicilio && node.editables?.domicilio ? `<b>Domicilio:</b> ${node.editables.domicilio}` : '',
                node.visibles?.historico_label && node.editables?.historico_label ? `${node.editables?.historico_label}` : '',
                node.visibles?.historico_folios && node.editables?.historico_folios ? `<b>Folio: </b>${node.editables?.historico_folios}` : '',
                node.visibles?.historico_fechas && node.editables?.historico_fechas ? `<b>Fecha Remision: </b>${node.editables?.historico_fechas}` : '',
                node.visibles?.historico_motivo && node.editables?.historico_motivo ? `<b>Motivo: </b>${node.editables?.historico_motivo}` : '',
                node.visibles?.historico_domicilio && node.editables?.historico_domicilio ? `<b>Domicilio: </b>${node.editables?.historico_domicilio}` : '',
                node.atributos?.otro ? `<b>Otro:</b> ${node.atributos.otro}` : ''
            ].filter(Boolean).join('\n');
            break;
        case 'telefono':
        case 'entrada-telefono':
            newLabel = [
                node.label && `${node.atributos.Telefono}`.trim(),
                node.visibles && Object.keys(node.visibles).map(key => 
                    node.visibles[key] && node.editables[key] ? `<b>${key}:</b> ${node.editables[key]}` : ''
                ).filter(Boolean).join('\n')
            ].filter(Boolean).join('\n');
            break;
        case 'inspeccion':
            newLabel = [
                node.label && `${node.atributos.Id_Inspeccion}`,
                node.atributos?.Coordenada_X ? `<b>Coordendas:</b>${node.atributos.Coordenada_X}, ${node.atributos.Coordenada_Y}`.trim(): '',
                node.atributos?.Fecha ? `<b>Fecha:</b> ${node.atributos.Fecha}` : '',
                node.atributos?.Colonia ? `<b>Ubicación:</b> ${node.atributos.Colonia}, ${node.atributos.Calle_1}, ${node.atributos.Calle_2}, ${node.atributos.No_Ext}` : ''
            ].filter(Boolean).join('\n');
            break;
        case 'vehiculo':
        case 'entrada-vehiculo':
            newLabel = [
                node.label && `<b>Placas: </b> ${node.atributos.Placas} <b>NIV: </b> ${node.atributos.NIV}`,
                node.atributos?.Marca ? `<b>Marca: </b> ${node.atributos.Marca}` : '',
                node.atributos?.Modelo ? `<b>Modelo: </b> ${node.atributos.Modelo}` : '',
                node.atributos?.Color ? `<b>Color: </b> ${node.atributos.Color}` : ''
            ].filter(Boolean).join('\n');
            break;
        default:
            newLabel = node.label;
            break;
    }

    return newLabel;
};

export const EditNodeForm = ({ nodeId, edgeId, onRequestClose }: EditNodeFormProps) => {
    const [nodeEditables, setNodeEditables] = useState<{ [key: string]: string }>({});
    const [nodeVisibles, setNodeVisibles] = useState<{ [key: string]: boolean }>({});
    const [nodeAtributos, setNodeAtributos] = useState<{ [key: string]: string }>({});
    const [edgeAtributos, setEdgeAtributos] = useState<{ [key: string]: string }>({});
    const [label, setLabel] = useState('');
    const [nodeDetails, setNodeDetails] = useState<any>(null);
    const [edgeDetails, setEdgeDetails] = useState<any>(null);
    const [newNodeKey, setNewNodeKey] = useState('');
    const [newNodeValue, setNewNodeValue] = useState('');
    const [newEdgeKey, setNewEdgeKey] = useState('');
    const [newEdgeValue, setNewEdgeValue] = useState('');
    const [showAddNodeAttribute, setShowAddNodeAttribute] = useState(false);
    const [showAddEdgeAttribute, setShowAddEdgeAttribute] = useState(false);

    const { nodes, edges } = useNetwork();

    const handleNodeChange = (key: string, value: string) => {
        setNodeEditables(prev => ({ ...prev, [key]: value }));
    };

    const handleNodeChangeAtt = (key: string, value: string) => {
        setNodeAtributos(prev => ({ ...prev, [key]: value }));
    };

    const handleNodeVisibilidad = (key: string, value: boolean) => {
        setNodeVisibles(prev => ({ ...prev, [key]: value }));
    };

    const handleEdgeChangeAtt = (key: string, value: string) => {
        setEdgeAtributos(prev => ({ ...prev, [key]: value }));
    };

    const handleAddNodeAttribute = () => {
        if (newNodeKey && newNodeValue) {
            setNodeAtributos(prev => ({ ...prev, [newNodeKey]: newNodeValue }));
            setNewNodeKey('');
            setNewNodeValue('');
            setShowAddNodeAttribute(false);
        }
    };

    const handleAddEdgeAttribute = () => {
        if (newEdgeKey && newEdgeValue) {
            setEdgeAtributos(prev => ({ ...prev, [newEdgeKey]: newEdgeValue }));
            setNewEdgeKey('');
            setNewEdgeValue('');
            setShowAddEdgeAttribute(false);
        }
    };

    const handleSave = () => {
        if (edgeDetails && nodeDetails == null) {
            edges.update({
                id: edgeDetails.id,
                label,
                atributos: edgeAtributos
            });
        } 
        if (nodeDetails) {
            nodes.update({
                id: nodeDetails.id,
                editables: nodeEditables,
                visibles: nodeVisibles,
                atributos: nodeAtributos,
                label: recreateLabel({ ...nodeDetails, editables: nodeEditables, visibles: nodeVisibles, atributos: nodeAtributos })
            });
        }
        onRequestClose();
    };

    useEffect(() => {
        if (nodeId) {
            const details = nodes.get(nodeId);
            console.log('NODE:', details);
            setNodeDetails(details);
            setNodeEditables(details?.editables || {});
            setNodeVisibles(details?.visibles || {});
            setNodeAtributos(details?.atributos || {});
        }
    }, [nodeId]);

    useEffect(() => {
        if (edgeId) {
            const details = edges.get(edgeId);
            console.log('EDGE:', details);
            setEdgeDetails(details);
            setEdgeAtributos(details?.atributos || {});
            setLabel(details?.label || '');
        }
    }, [edgeId]);

    useEffect(() => {
        if (nodeDetails) {
            setLabel(recreateLabel({ ...nodeDetails, editables: nodeEditables, visibles: nodeVisibles, atributos: nodeAtributos }));
        }
    }, [nodeEditables, nodeVisibles, nodeAtributos]);

    return (
        <div>
            {edgeDetails && nodeDetails == null && (
                <>
                    <h2 className="text-xl font-bold mb-4">Editar Arista</h2>
                    <div className="mb-4 flex items-center">
                        <label className="font-bold">Label</label>
                        <input
                            type="text"
                            value={label}
                            onChange={e => setLabel(e.target.value)}
                            className="ml-2 p-1 border border-gray-300 flex-grow"
                            tabIndex={0} // Añadir tabIndex
                        />
                    </div>
                    {Object.keys(edgeAtributos).map(key => (
                        <div key={key} className="mb-4 flex items-center">
                            <label className="font-bold">{key}</label>
                            <input
                                type="text"
                                value={edgeAtributos[key]}
                                onChange={e => handleEdgeChangeAtt(key, e.target.value)}
                                className="ml-2 p-1 border border-gray-300 flex-grow"
                                tabIndex={0} // Añadir tabIndex
                            />
                        </div>
                    ))}
                    {showAddEdgeAttribute ? (
                        <>
                            <div className="mb-4">
                                <label className="font-bold">Clave</label>
                                <input
                                    type="text"
                                    value={newEdgeKey}
                                    onChange={e => setNewEdgeKey(e.target.value)}
                                    className="ml-2 p-1 border border-gray-300"
                                    tabIndex={0} // Añadir tabIndex
                                />
                            </div>
                            <div className="mb-4">
                                <label className="font-bold">Valor</label>
                                <input
                                    type="text"
                                    value={newEdgeValue}
                                    onChange={e => setNewEdgeValue(e.target.value)}
                                    className="ml-2 p-1 border border-gray-300"
                                    tabIndex={0} // Añadir tabIndex
                                />
                            </div>
                            <button onClick={handleAddEdgeAttribute} className="mt-4 p-2 mr-2 bg-green-500 text-white">Añadir Atributo</button>
                        </>
                    ) : (
                        <button onClick={() => setShowAddEdgeAttribute(true)} className="mt-4 p-2 mr-2 bg-blue-500 text-white">Añadir Atributo</button>
                    )}
                </>
            )}

            {nodeDetails && (
                <>
                    <h2 className="text-xl font-bold mb-4">Editar Nodo</h2>
                    {Object.keys(nodeEditables).filter(key => key !== 'label' && typeof nodeEditables[key] !== 'object').map(key => (
                        <div key={key} className="mb-4 flex items-center">
                            <label className="font-bold">{key}</label>
                            {key === 'comentarios' ? (
                                <textarea
                                    value={nodeEditables[key]}
                                    onChange={e => handleNodeChange(key, e.target.value)}
                                    className="ml-2 p-1 border border-gray-300 flex-grow"
                                    tabIndex={0} // Añadir tabIndex
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={nodeEditables[key]}
                                    onChange={e => handleNodeChange(key, e.target.value)}
                                    className="ml-2 p-1 border border-gray-300 flex-grow"
                                    tabIndex={0} // Añadir tabIndex
                                />
                            )}
                            <button
                                onClick={() => handleNodeVisibilidad(key, !nodeVisibles[key])}
                                className="ml-2 p-2 bg-gray-300 text-black rounded"
                            >
                                {nodeVisibles[key] && <FaEye />}
                                {!nodeVisibles[key] && <FaEyeSlash />}
                            </button>
                        </div>
                    ))}
                    {Object.keys(nodeAtributos).filter(key => key !== 'detenciones' && key !== 'detenciones_historicas' && typeof nodeEditables[key] !== 'object').map(key => (
                        <div key={key} className="mb-4 flex items-center">
                            <label className="font-bold">{key}</label>
                            <input
                                type="text"
                                value={nodeAtributos[key]}
                                onChange={e => handleNodeChangeAtt(key, e.target.value)}
                                className="ml-2 p-1 border border-gray-300 flex-grow"
                                tabIndex={0} // Añadir tabIndex
                            />
                        </div>
                    ))}
                    {showAddNodeAttribute ? (
                        <>
                            <div className="mb-4">
                                <label className="font-bold">Clave</label>
                                <select
                                    value={newNodeKey}
                                    onChange={e => setNewNodeKey(e.target.value)}
                                    className="ml-2 p-1 border border-gray-300"
                                    tabIndex={0} // Añadir tabIndex
                                >
                                    <option value="">Seleccione una clave</option>
                                    <option value="alias">Alias</option>
                                    <option value="fecha_detencion">Fecha de Detencion</option>
                                    <option value="no_remision">No Remision</option>
                                    <option value="curp">CURP</option>
                                    <option value="fecha_nacimiento">Fecha de Nacimiento</option>
                                    <option value="delitos">Delitos</option>
                                    <option value="domicilio">Domicilio</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="font-bold">Valor</label>
                                <input
                                    type="text"
                                    value={newNodeValue}
                                    onChange={e => setNewNodeValue(e.target.value)}
                                    className="ml-2 p-1 border border-gray-300"
                                    tabIndex={0} // Añadir tabIndex
                                />
                            </div>
                            <button onClick={handleAddNodeAttribute} className="mt-4 p-2 mr-2 bg-green-500 text-white">Añadir Atributo</button>
                        </>
                    ) : (
                        <button onClick={() => setShowAddNodeAttribute(true)} className="mt-4 p-2 mr-2 bg-blue-500 text-white">Añadir Atributo</button>
                    )}
                </>
            )}

            <button
                onClick={handleSave}
                className="mt-4 p-2 bg-blue-500 text-white rounded"
            >
                Guardar
            </button>
        </div>
    );
};