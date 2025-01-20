import { useRef } from 'react';
import { useNetwork } from '../context/NetwokrContext';
import { countEdges } from '../helpers/countEdges';
import { useSheets } from './useSheets';

export const useSaveLoadNetwork = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { nodes, edges } = useNetwork();
    const { selectedSheet } = useSheets();

    // Función para guardar el grafo en un archivo JSON
    const saveGraph = () => {
        let saveNodes = nodes.get();
        let saveEdges = edges.get();
        const json = JSON.stringify({ nodes: saveNodes, edges: saveEdges }, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'graph.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Función para cargar el grafo desde un archivo JSON
    const loadGraph = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const json = e.target?.result as string;
                const graphData = JSON.parse(json);

                // Añadir nuevos nodos si no existen en el grafo actual
                graphData.nodes.forEach((node: any) => {
                    if (nodes.get(node.id) === null) {
                        node.color = {
                            ...node.color,
                            background: "rgba(255, 255, 255, 0.8)",
                            highlight: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" },
                            hover: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" }
                        };

                        node.font = {
                            background: 'rgba(255, 255, 255, 0.8)',
                            multi: 'html',
                        };

                        if (node.color.border !== "green") {
                            node.color.border = "rgba(255, 255, 255, 0)";
                        }
                        nodes.add(node);
                    }
                });

                // Añadir todas las aristas del archivo
                graphData.edges.forEach((edge: any) => {
                    if (edges.get(edge.id) === null) {
                        edges.add(edge);
                    }
                });

                const allEdges = edges.get();
                let newEdges = countEdges(allEdges);
                edges.clear();
                edges.add(newEdges);
            };
            reader.readAsText(file);

            localStorage.setItem(`nodes_sheet_${selectedSheet}`, JSON.stringify(nodes.get()));
            localStorage.setItem(`edges_sheet_${selectedSheet}`, JSON.stringify(edges.get()));
        }
    };

    return {
        saveGraph,
        loadGraph,
        fileInputRef
    };
};
