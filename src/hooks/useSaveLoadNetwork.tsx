import { useRef } from 'react';
import { useNetwork } from '../context/NetwokrContext';
import { countEdges } from '../helpers/countEdges';
import { useSheets } from './useSheets';
import pdfMake from 'pdfmake/build/pdfmake';

export const useSaveLoadNetwork = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { nodes, edges, network } = useNetwork();
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

    const exportNetworkToImage = () => {
        if (!network) return;

        // Guardar el tamaño original del canvas
        const originalWidth =(network as any).canvas?.frame?.canvas?.width;
        const originalHeight = (network as any).canvas?.frame?.canvas?.height;

        // Hacer el canvas gigante
        network.setSize('5000px', '4000px');
        network.fit();

        // Esperar a que el canvas se redimensione
        setTimeout(() => {
            // Obtener el canvas de la red
            const canvas = (network as any).canvas?.frame?.canvas;

            // Convertir el canvas a una imagen (data URL)
            const dataURL = canvas.toDataURL('image/png');

            // Crear un enlace para descargar la imagen
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'network.png'; // Nombre del archivo de descarga
            link.click();
            link.remove();

            // Regresar el canvas a su tamaño original
            network.setSize(`${originalWidth}px`, `${originalHeight}px`);
            network.fit();
        }, 1000); // Esperar 1 segundo para asegurarse de que el canvas se haya redimensionado
      };
      

    const exportNetworkToPDF = () => {
        if (!network) return;

        // Guardar el tamaño original del canvas
        const originalWidth =(network as any).canvas?.frame?.canvas?.width;
        const originalHeight = (network as any).canvas?.frame?.canvas?.height;

        // Hacer el canvas gigante
        network.setSize('5000px', '4000px');
        network.fit();

        // Esperar a que el canvas se redimensione
        setTimeout(() => {
            // Obtener el canvas de la red
            const canvas = (network as any).canvas?.frame?.canvas;

            // Convertir el canvas a una imagen (data URL)
            const dataURL = canvas.toDataURL('image/png');

            const docDefinition = {
                pageSize: {
                    width: 5000,
                    height: 4000
                },
                content: [
                    {
                        image: dataURL,
                        width: 5000,
                        height: 4000
                    }
                ]
            };

            pdfMake.createPdf(docDefinition).download('network.pdf');

            // Regresar el canvas a su tamaño original
            network.setSize(`${originalWidth}px`, `${originalHeight}px`);
            network.fit();
        }, 1000); // Esperar 1 segundo para asegurarse de que el canvas se haya redimensionado
    }
    

    return {
        saveGraph,
        loadGraph,
        fileInputRef,
        exportNetworkToImage,
        exportNetworkToPDF
    };
};
