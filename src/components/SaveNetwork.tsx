import React, { useRef } from 'react';
import { MdOutlineSave, MdOutlineUploadFile } from "react-icons/md";
import { useNetwork } from '../context/NetwokrContext';
import { countEdges } from '../helpers/countEdges';
// import { v4 as uuidv4 } from 'uuid';
// import { countEdges } from '../helpers/countEdges';

const SaveNetwork: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { nodes, edges } = useNetwork();

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
                    console.log(nodes.get(node.id));
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
                    if(edges.get(edge.id) === null){    
                       edges.add(edge);
                    }
                });

                const allEdges = edges.get();
                let newEdges = countEdges(allEdges);
                edges.clear();
                edges.add(newEdges);

            };
            console.log('TERMINE DE CARGAR');
            reader.readAsText(file);
        }
    };

    return (
        <div className="flex flex-row items-center space-x-4">
            <button
                onClick={saveGraph}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 flex items-center space-x-2"
            >
                <MdOutlineSave className="mr-2" />
                Guardar Grafo
            </button>
            <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={loadGraph}
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 flex items-center space-x-2"
            >
                <MdOutlineUploadFile />
                <span>Cargar Grafo</span>
            </button>
        </div>
    );
};

export default SaveNetwork;