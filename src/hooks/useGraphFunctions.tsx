import { useNetwork } from "../context/NetwokrContext";
import { toast } from "react-hot-toast";
import { createNodeData } from "../helpers/createNodeData";
import { v4 as uuidv4 } from 'uuid';
import { EdgeData } from "../helpers/edgeData";
import Swal from 'sweetalert2';

export const useGraphFunctions = () => {

    const { network, nodes, edges, clickedNode, clickedEdge } = useNetwork();

    const addNode = (nodeData: any, callback: (data: any) => void) => {
        console.warn('node data:', nodeData);
        console.log('network:', network);
        console.log(clickedNode, clickedEdge,edges);
        const { newNode, parentPosition } = nodeData;
        let prevData = nodes;
        try {
            console.log('ANDO BUSCANDO UN NODO')
            let alreadyExist = nodes.get(newNode.id.toString());
            console.log('ENCONTRE UN NODO:', alreadyExist);
            if (alreadyExist) {

                toast.error(`Ya existe una entidad identificada ${newNode.label}`)
                callback({ status: false, encontro: newNode });
                return prevData;
            }

            newNode.color =   {
                background:"rgba(255, 255, 255, 0.8)",
                border: "rgba(255, 255, 255, 0)",
                highlight: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" },
                hover: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" }
            };

            let addNode = createNodeData(
                newNode.id.toString().trim().toUpperCase(), // Generate a unique ID
                newNode.label.toString().toUpperCase() || "Nuevo Nodo",
                newNode.name || "Nuevo Nodo",
                "image", // newNode.shape is always "image"
                newNode.size || 15,
                newNode.color,
                newNode.type || "persona",
                newNode.entidad, // No default value needed
                newNode.data || {},
                newNode.atributos || {},
                newNode.x || parentPosition.x + Math.floor(Math.random() * (350 - 270 + 1)) + 270,
                newNode.y || parentPosition.y + Math.floor(Math.random() * (350 - 270 + 1)) + 270,

            );
            addNode.font = { multi: 'html', size: 12 };

            // Validaciones especiales de acuerdo al type diferente a entidad
            console.log('NEW NODE:', newNode.type);
            if (newNode.type === 'contacto') {
                addNode.label = `${addNode.label} \n <b>Telefono: </b> ${addNode.atributos.Telefono}`;
            }

            if (newNode.type === 'inspeccion') {
                "inspeccion"
                addNode.label = `${addNode.label} \n <b>Coordenadas:</b> ${addNode.atributos.Coordenada_X}, ${addNode.atributos.Coordenada_Y} \n<b>Fecha: </b> ${addNode.atributos.Fecha} \n <b>Ubicación: </b> ${addNode.atributos.Colonia}, ${addNode.atributos.Calle_1},\n ${addNode.atributos.Calle_2}, ${addNode.atributos.No_Ext}`;
            }

            if (newNode.type === 'vehiculo') {
                addNode.label = `<b>Placas: </b> ${addNode.atributos.Placas} <b>NIV: </b> ${addNode.atributos.NIV} \n <b>Marca: </b> ${addNode.atributos.Marca} \n <b>Modelo: </b> ${addNode.atributos.Modelo} \n <b>Color: </b> ${addNode.atributos.Color}`;
            }

            
            nodes.add(addNode);
            checkPartialVehicle(addNode);
            calculateWeight(clickedNode,addNode);
            callback({ status: true }); // Indicate that the node was added successfully
            return prevData;

        } catch (error) {
            console.log('ERROR DESDE EL ADD:', error);
        }
    };

    const addEdgeControl = (edgeData: any, callback: (data: any) => void) => {
        console.log('edgeData:', edgeData); 
        if (!edgeData.id) {
            edgeData.id = uuidv4();
        }
        
        try {
            edges.update(edgeData);
            callback({ status: true }); // Indicate that the edge was updated successfully
        } catch (error) {
            console.log('ERROR DESDE EL UPDATE EDGE:', error);
            callback({ status: false, error });
        }
        
        console.log('edges:', edges.get());
    }

    /*const validateEdge = (edgeData: any) => {
        const existingEdge = edges.get().find((edge: any) => edge.from === edgeData.from && edge.to === edgeData.to);

        if (existingEdge) {
            existingEdge.atributos.suma = (existingEdge.suma || 0) + 1;
            existingEdge.label = `${existingEdge.label || ''} ${edgeData.label || ''}`;
            edges.update(existingEdge);
            return false; // Indicate that the edge was not added because it already exists
        }

        return true; // Indicate that the edge can be added
    };*/

    const checkPartialVehicle = (nodeData: any) => {
        let currentNodes = nodes.get();
        if (nodeData.type === 'vehiculo') {
            let placa = nodeData.atributos.Placas;
            let niv = nodeData.atributos.NIV;
            let existingNode = currentNodes.find((node: any) => node.atributos.Placas === placa || node.atributos.NIV === niv);
            if (existingNode) {
                console.log('EXISTE UN VEHICULO PARCIAL:', existingNode);
                Swal.fire({
                    title: 'Vehículo Parcial',
                    text: `Se ha encontrado un vehículo parcial con la misma placa o NIV. ¿Desea reemplazar dicho nodo?`,
                    showDenyButton: true,
                    confirmButtonText: `Sí`,
                    denyButtonText: `No`,
                }).then((result) => {
                    if (result.isConfirmed) {
                        let nodeToRemove = existingNode.id;
                        network?.selectNodes([nodeToRemove]);
                        let edgesToReconect = network?.getConnectedEdges(nodeToRemove);
                        console.log(edgesToReconect);
                        edgesToReconect?.forEach((edge: any) => {
                            let edgeData = edges.get(edge) as unknown as EdgeData;
                            if (edgeData.from === nodeToRemove) {
                                edgeData.from = nodeData.id;
                                edges.update(edgeData);
                            } 
                        });
                        nodes.remove(nodeToRemove);
                    }
                })
               
               
            }

        }
    };

    const addEdge = (edgeData: any, callback: (data: any) => void) => {
        try {
            const newEdge = {
              id: uuidv4(), // Generate a unique ID
              from: edgeData.from,
              to: edgeData.to,
              label: edgeData.label || "Nueva Arista",
              color: edgeData.color || "black",
              width: edgeData.width || 1,
            };
           /* let responseValidation = validateEdge(newEdge);
            if (responseValidation){
                edges.add(newEdge);
                callback(true);
            }else{
                callback(false);
            }
            */
            edges.add(newEdge);
            callback(true);
            return newEdge;
      
        } catch (error) {
          console.error("Error adding edge:", error);
          callback(false);
        }
        
      };

      const calculateWeight = (fatherNodeId: any,nodeData: any) => {
        console.warn('CALCULANDO PESO');
        console.log('fatherNodeId:', fatherNodeId);
        console.log('nodeData:', nodeData);
        if(fatherNodeId){
            let fatherNode = nodes.get(fatherNodeId);
            console.log('fatherNode:', fatherNode);
            if(fatherNode){
                let fatherNodeData = fatherNode as any;
                console.log('fatherNodeData:', fatherNodeData);
                
                    console.warn('PESO ACTUAL:', fatherNodeData.atributos.weight);
                    nodeData.atributos.weight = fatherNodeData.atributos.weight + 1;
                
                console.warn('HIJO ACTUALIZADO:', nodeData);
                nodes.update(nodeData);
            }
        }
    }

    return {
        addNode,
        addEdgeControl,
        addEdge
    }
}
