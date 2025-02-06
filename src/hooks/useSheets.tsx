import { useEffect, useState } from 'react';
import { useNetwork } from '../context/NetwokrContext';
import { saveData, getData, deleteData } from '../utils/indexedDB';

export const useSheets = () => {
    const [sheets, setSheets] = useState([{ id: 1, name: 'Sheet 1' }]);
    const [selectedSheet, setSelectedSheet] = useState(1);
    const [_currentSheet, setCurrentSheet] = useState(1);
    const [prevSheet, setPrevSheet] = useState(1);

    const { nodes, edges, network } = useNetwork();

    const addSheet = async () => {
        const newId = sheets.length > 0 ? Math.max(...sheets.map(sheet => sheet.id)) + 1 : 1;
        const newSheet = { id: newId, name: `Sheet ${newId}` };
        setSheets([...sheets, newSheet]);
        setSelectedSheet(newSheet.id);
        localStorage.setItem('hojaActiva', newSheet.id.toString());
        localStorage.setItem(`opciones_${newSheet.id}`, JSON.stringify({
            layout:{
                hierarchical: {
                    enabled: false,
                }
            },
            edges: {
              smooth: {
                enabled: true,
                type: "cubicBezier",
                forceDirection: "none",
                roundness: 1,
              },
            },
            physics: {
              enabled: true,
              repulsion: {
                centralGravity: 0.1,
                springLength: 200,
                springConstant: 0.05,
                nodeDistance: 410,
                damping: 0.09,
              },
              maxVelocity: 50,
              minVelocity: 0.75,
              solver: "repulsion",
              timestep: 0.5,
            },
          }));
        await saveData(`nodes_sheet_${newSheet.id}`, JSON.stringify([]));
        await saveData(`edges_sheet_${newSheet.id}`, JSON.stringify([]));
        await saveData(`zoom_level_${newSheet.id}`, JSON.stringify({ scale: 1, position: { x: 0, y: 0 } }));
        await saveData(`view_position_${newSheet.id}`, JSON.stringify({ x: 0, y: 0 })); // Guardar la posición de vista inicial
    };

    const deleteSheet = async (id: number) => {
        const updatedSheets = sheets.filter(sheet => sheet.id !== id);
        setSheets(updatedSheets);
        if (selectedSheet === id) {
            setSelectedSheet(updatedSheets.length > 0 ? updatedSheets[0].id : 1);
            localStorage.setItem('hojaActiva', updatedSheets.length > 0 ? updatedSheets[0].id.toString() : '1');
        }
        await deleteData(`nodes_sheet_${id}`);
        await deleteData(`edges_sheet_${id}`);
        await deleteData(`zoom_level_${id}`); // Eliminar el nivel de zoom almacenado
        await deleteData(`view_position_${id}`); // Eliminar la posición de vista almacenada
    };

    const clearSheet = async (id: number) => {
        await deleteData(`nodes_sheet_${id}`);
        await deleteData(`edges_sheet_${id}`);
        await deleteData(`zoom_level_${id}`); // Eliminar el nivel de zoom almacenado
        await deleteData(`view_position_${id}`); // Eliminar la posición de vista almacenada
        nodes.clear();
        edges.clear();

    };

    const selectSheet = (id: number) => {
        setPrevSheet(selectedSheet);
        setSelectedSheet(id);
        localStorage.setItem('hojaActiva', id.toString());
    };

    // Guardar la red cuando cambie la hoja seleccionada
    useEffect(() => {
        if (network && selectedSheet !== prevSheet) {
            const handleStoreNetwork = async () => {
                network.storePositions();
                await saveData(`nodes_sheet_${prevSheet}`, JSON.stringify(nodes.get()));
                await saveData(`edges_sheet_${prevSheet}`, JSON.stringify(edges.get()));
                await saveData(`zoom_level_${prevSheet}`, JSON.stringify(network.getScale()));
                await saveData(`view_position_${prevSheet}`, JSON.stringify(network.getViewPosition())); // Guardar la posición de vista
            };
            handleStoreNetwork();
            setCurrentSheet(selectedSheet);
        }
    }, [selectedSheet, prevSheet, network, nodes, edges]);

    // Cargar la red correspondiente a la hoja seleccionada
    useEffect(() => {
        if (network) {
            const loadNetwork = async () => {
                const storedNodes = await getData(`nodes_sheet_${selectedSheet}`);
                const storedEdges = await getData(`edges_sheet_${selectedSheet}`);
                const storedZoom = await getData(`zoom_level_${selectedSheet}`);
                const storedViewPosition = await getData(`view_position_${selectedSheet}`); // Cargar la posición de vista
    
                if (storedNodes && storedEdges) {
                    nodes.clear();
                    edges.clear();
                    nodes.add(JSON.parse(storedNodes));
                    edges.add(JSON.parse(storedEdges));
                } else {
                    nodes.clear();
                    edges.clear();
                }
                if (storedZoom) {
                    network.moveTo({ scale: Number(storedZoom) });
                }
                if (storedViewPosition) {
                    const viewPositionObject = JSON.parse(storedViewPosition || '{}');
                    network.moveTo({ position: viewPositionObject }); // Mover a la posición de vista almacenada
                }
            };
    
            loadNetwork();
        }
    }, [selectedSheet, network, nodes, edges]);

    return {
        sheets,
        selectedSheet,
        addSheet,
        deleteSheet,
        selectSheet,
        clearSheet
    };
};