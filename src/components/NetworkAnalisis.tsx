import React, { useEffect, useState } from "react";
import { useNetwork } from "../context/NetwokrContext";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface NetworkAnalisisProps {
    onCloseModal: () => void;
}

export const NetworkAnalisis: React.FC<NetworkAnalisisProps> = ({ onCloseModal }) => {
    const [_nodeConnections, setNodeConnections] = useState<{ id: string, connections: number }[]>([]);
    const [_nodeWeights, setNodeWeights] = useState<{ id: string, weight: number }[]>([]);
    const [moreConectedNodes, setMoreConectedNodes] = useState<any[]>([]);

    const { network, nodes, edges } = useNetwork();

    const getMoreConectedNodes = () => {
        let arrayOfConections: { id: string, connections: number }[] = [];
        let moreConectedNodes: any[] = [];
        nodes.get().forEach(node => {
            const connections = network?.getConnectedNodes(node.id)?.length || 0;
            arrayOfConections.push({ id: node.id, connections });
        });
        arrayOfConections.sort((a, b) => b.connections - a.connections);
        arrayOfConections.forEach(node => {
            if (node.connections > 1) {
                moreConectedNodes.push(nodes.get(node.id));
            }
        });
        setMoreConectedNodes(moreConectedNodes);
    };


    const getNodesWeights = () => {
        let arrayOfWeights: { id: string, weight: number }[] = [];
        nodes.get().forEach(node => {
            let totalWeight = 0;
            const connectedEdges = network?.getConnectedEdges(node.id) || [];
            connectedEdges.forEach(edgeId => {
            const edge = edges.get(edgeId);
            if (edge && edge.atributos) {
                totalWeight += edge.atributos.suma || 0;
            }
            });
            arrayOfWeights.push({ id: node.id, weight: totalWeight });
        });
        setNodeWeights(arrayOfWeights);
    }

    useEffect(() => {
        if (nodes.get().length > 0) {
            getMoreConectedNodes();
            getNodesWeights();
        }
    }, [nodes]);

    useEffect(() => {
        if (nodes.get().length > 0) {
            const arrayOfConnections = nodes.get().map(node => ({
                id: node.id,
                connections: network?.getConnectedNodes(node.id)?.length || 0
            }));
            setNodeConnections(arrayOfConnections);
        }
    }, [nodes, network]);

    const chartData = {
        labels: moreConectedNodes.map((node: any) => node.id),
        datasets: [
            {
                label: 'Conexiones',
                data: moreConectedNodes.map((node: any) => network?.getConnectedNodes(node.id)?.length || 0),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            // {
            //     label: 'Peso',
            //     data: _nodeWeights.map((node) => node.weight),
            //     backgroundColor: 'rgba(153, 102, 255, 0.2)',
            //     borderColor: 'rgba(153, 102, 255, 1)',
            //     borderWidth: 1,
            // }
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Conexiones de los Nodos',
            },
        },
    };

    return (
        <>
            <div style={{ width: '100%', height: '500px' }}>
            <Bar data={chartData} options={chartOptions} />
            </div>
            <div style={{ marginTop: '20px' }}>
            <table style={{ width: '100%' }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Conexiones</th>
                    <th>Accion</th>
                </tr>
                </thead>
                <tbody>
                {moreConectedNodes.map((node: any) => (
                    <tr key={node.id}>
                    <td>{node.id}</td>
                    <td>{network?.getConnectedNodes(node.id)?.length || 0}</td>
                    <td>
                        <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => {
                            network?.selectNodes([node.id]);
                            network?.focus(node.id, { scale: 1 });
                            onCloseModal();
                        }}>
                        Ver
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </>
    );
};