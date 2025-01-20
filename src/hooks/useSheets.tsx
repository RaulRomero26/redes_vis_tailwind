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
        await saveData(`nodes_sheet_${newSheet.id}`, JSON.stringify([]));
        await saveData(`edges_sheet_${newSheet.id}`, JSON.stringify([]));
    };

    const deleteSheet = async (id: number) => {
        const updatedSheets = sheets.filter(sheet => sheet.id !== id);
        setSheets(updatedSheets);
        if (selectedSheet === id) {
            setSelectedSheet(updatedSheets.length > 0 ? updatedSheets[0].id : 1);
        }
        await deleteData(`nodes_sheet_${id}`);
        await deleteData(`edges_sheet_${id}`);
    };

    const selectSheet = (id: number) => {
        setPrevSheet(selectedSheet);
        setSelectedSheet(id);
    };

    // Guardar la red cuando cambie la hoja seleccionada
    useEffect(() => {
        if (network && selectedSheet !== prevSheet) {
            const handleStoreNetwork = async () => {
                await saveData(`nodes_sheet_${prevSheet}`, JSON.stringify(nodes.get()));
                await saveData(`edges_sheet_${prevSheet}`, JSON.stringify(edges.get()));
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
                if (storedNodes && storedEdges) {
                    nodes.clear();
                    edges.clear();
                    nodes.add(JSON.parse(storedNodes));
                    edges.add(JSON.parse(storedEdges));
                } else {
                    nodes.clear();
                    edges.clear();
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
        selectSheet
    };
};