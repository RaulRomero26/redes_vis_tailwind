import { useNetwork } from '../context/NetwokrContext';
import { IdType } from 'vis-network';

export const useInteraction = (nodeId: string) => {
    console.log(nodeId);

    const { network, edges, nodes } = useNetwork();
  
    const onSeleccionarConexionesFinales = () => {
        const selectedNodes = network?.getSelectedNodes() || [];
        let allConnectedEdges: any[] = [];
        let allConnectedNodes: any[] = [];

        selectedNodes.forEach((node: IdType) => {
            const connectedEdges = network?.getConnectedEdges(node) || [];
            allConnectedEdges = [...allConnectedEdges, ...connectedEdges];

            const connectedNodes = connectedEdges.map((edgeId: any) => {
                const edge: any = edges.get(edgeId);
                return edge.from === node ? edge.to : edge.from;
            });

            allConnectedNodes = [...allConnectedNodes, ...connectedNodes];
        });

        // Eliminar duplicados
        allConnectedEdges = Array.from(new Set(allConnectedEdges));
        allConnectedNodes = Array.from(new Set(allConnectedNodes));

        // Seleccionar las aristas y nodos en la red
        network?.selectEdges(allConnectedEdges);
        network?.selectNodes([...selectedNodes, ...allConnectedNodes]);
    };

    const onSeleccionarPersonas = () => { 
        let selectedNodes = network?.getSelectedNodes() || [];
        let personas;
        if(selectedNodes.length > 1){
            console.log('hay mas de uno')
            personas = selectedNodes.filter((nodeId: any) => {
                const node = nodes.get(nodeId);
                return (node as any).entidad === 'persona' && (node as any).type !== 'inspeccion';
            });
            network?.unselectAll();
            console.log('PERSONAS:', personas);
            network?.selectNodes(personas);
        }
        if (selectedNodes.length === 1) {
            console.log('solo hay uno', nodes.get())
            personas = nodes.get().filter((node: any) => {
            return node.entidad === 'persona' && node.type !== 'inspeccion';
            }).map((node: any) => node.id); // Solo obtener los IDs de los nodos
            network?.unselectAll();
            console.log('PERSONAS:', personas);
            network?.selectNodes(personas);
        }
    };

    const onSeleccionarInspecciones = () => { 
        let selectedNodes = network?.getSelectedNodes() || [];
        let inspecciones;
        if(selectedNodes.length > 1){
            inspecciones = selectedNodes.filter((nodeId: any) => {
                const node = nodes.get(nodeId);
                return (node as any).type === 'inspeccion';
            });
            network?.unselectAll();
            console.log('Inspecciones:', inspecciones);
            network?.selectNodes(inspecciones);
        }
        if (selectedNodes.length === 1) {
            console.log('solo hay uno', nodes.get())
            inspecciones = nodes.get().filter((node: any) => {
            return node.type === 'inspeccion';
            }).map((node: any) => node.id); // Solo obtener los IDs de los nodos
            network?.unselectAll();
            console.log('Inspecciones:', inspecciones);
            network?.selectNodes(inspecciones);
        }
    };

    const onSeleccionarVehiculos = () => {
        let selectedNodes = network?.getSelectedNodes() || [];
        let vehiculos;
        if(selectedNodes.length > 1){
            vehiculos = selectedNodes.filter((nodeId: any) => {
                const node = nodes.get(nodeId);
                return (node as any).entidad === 'vehiculo';
            });
            network?.unselectAll();
            console.log('Vehiculos:', vehiculos);
            network?.selectNodes(vehiculos);
        }
        if (selectedNodes.length === 1) {
            console.log('solo hay uno', nodes.get())
            vehiculos = nodes.get().filter((node: any) => {
            return node.entidad === 'vehiculo';
            }).map((node: any) => node.id); // Solo obtener los IDs de los nodos
            network?.unselectAll();
            console.log('Vehiculos:', vehiculos);
            network?.selectNodes(vehiculos);
        }
    }

    const onSeleccionarTelefonos = () => {
        let selectedNodes = network?.getSelectedNodes() || [];
        let telefonos;
        if(selectedNodes.length > 1){
            telefonos = selectedNodes.filter((nodeId: any) => {
                const node = nodes.get(nodeId);
                return (node as any).type === 'telefono';
            });
            network?.unselectAll();
            console.log('Telefonos:', telefonos);
            network?.selectNodes(telefonos);
        }
        if (selectedNodes.length === 1) {
            console.log('solo hay uno', nodes.get())
            telefonos = nodes.get().filter((node: any) => {
            return node.type === 'telefono';
            }).map((node: any) => node.id); // Solo obtener los IDs de los nodos
            network?.unselectAll();
            console.log('Telefonos:', telefonos);
            network?.selectNodes(telefonos);
        }
    }

    return { 
        onSeleccionarConexionesFinales,
        onSeleccionarPersonas,
        onSeleccionarInspecciones,
        onSeleccionarVehiculos,
        onSeleccionarTelefonos
    }
}
