// useContextMenu.tsx
import { useState } from 'react';
import { useSearchEntity } from './useSearchEntity';
import { useGraphFunctions } from './useGraphFunctions';
import { createNodeData, NodeData } from '../helpers/createNodeData';
import { useNetwork } from '../context/NetwokrContext';
import toast from 'react-hot-toast';

interface ContextMenuState {
    x: number;
    y: number;
    edgeId: string | null;
    nodeId: string | null;
}

const useContextMenu = () => {
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({ x: 0, y: 0, edgeId: null, nodeId: null });
    const [isModalFichasOpen, setIsModalFichasOpen] = useState(false);  // Añade estado para el modal
    const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
    const [isModalContactosOpen, setIsModalContactosOpen] = useState(false);  // Añade estado para el modal

    const { nodes, edges, network } = useNetwork();

    const {
        searchData,
        buscarLlamadas911,
        searchHistorico,
        searchInspeccion,
        searchVehiculoInspeccion,
        searchRemisionesTelefono,
        searchVehiculoRemision,
        buscarContactosPorTelefono,
        searchPersonaInspeccion,
        searchAura,
        searchPersonasBanda
    } = useSearchEntity();

    const { addNode,addEdge } = useGraphFunctions();


    const handleContextMenu = (event: any) => {
        event.event.preventDefault();
        if (event.edges.length > 0) {
          setContextMenu({ x: event.event.clientX, y: event.event.clientY, edgeId: event.edges[0], nodeId: null });
        } 
        if (event.nodes.length > 0) {
          setContextMenu({ x: event.event.clientX, y: event.event.clientY, edgeId: null, nodeId: event.nodes[0] });
        } 
      };

    const handleSearchExtended = async(opcion:string) => {
        //console.log('le pique a una opcion de search extended',contextMenu.nodeId,'opcion:',opcion);

        if (contextMenu.nodeId !== null) {
            const node = nodes.get(contextMenu.nodeId);
            if (node) {
                //console.warn('Buscando entidad', node);
               
                if(opcion === 'Buscar Maestro')handleSearchMaestroPersona(); //Buscar Remisiones e inspecciones por Nombre
                if(opcion === 'Buscar Remisiones')handleSearchRemisiones(node); //Buscar Remisiones por Nombre
                if(opcion === 'Consultas') handleSearchInspeccion(); // Buscar inspecciones por nombre
                if(opcion === 'Telefono Remisiones') handleSearchRemisionesTelefono(node); //Busca Remisiones a partir de un telefono
                if(opcion === 'Telefono 911') handleSearchTelefono(node); // Buscar un telefono que se encuentra en atributos (911)
                if(opcion === 'Telefono Contactos') handleSearchContactosTelefono(node); // Buscar un telefono que se encuentra en atributos (Contactos)
                if(opcion === 'Extraer Vehiculos') handleSearchVehiculosInspeccion(); //Busca Vehiculos a partir de una inspeccion
                if(opcion === 'Extraer Personas') handleSearchPersonasInspeccion(); //Busca Personas a partir de una inspeccion
                /* --------- FUNCIONES QUE ME EXTRAEN DIRECTAMENTE SIN NECESIDAD DE MODAL ----------- */
                if(opcion === 'Extraer Telefonos') handleExtraerTelefonos(node); // Buscar Telefonos si hay remision
                if(opcion === 'Integrantes Banda') handleSearchBanda(); // Buscar integrantes de una banda
                /* --------- ESTAS FUNCIONES ME DISPARAN UN MODAL ----------- */
                if(opcion === 'Extraer Contactos') handleContactosModal(node); // Buscar Contactos si hay remision
                if(opcion === 'Detenido Con') handleDetenidoConModal(node); // Buscar Detenido Con si hay remision
            }
                
        } else {
            //console.log('Node not found');
        }
        setContextMenu({ x: 0, y: 0, edgeId: null, nodeId: null });
    };



    /* FUNCIONES DE EXPANSION DE LA RED  */
    const handleContactosModal = (node: NodeData) => {
        //console.log('Disparando el modal con el nodo:', node);
        setSelectedNode(node);  // Guarda el nodo seleccionado
        setIsModalContactosOpen(true);    // Abre el modal
    };

    const handleDetenidoConModal = (node: NodeData) => {
        //console.log('Disparando el modal con el nodo:', node);
        setSelectedNode(node);  // Guarda el nodo seleccionado
        setIsModalFichasOpen(true);    // Abre el modal
    };


    /* FUNCIONES DE AGREGACION DE PROPIEDADES */

    
    const handleSearchRemisiones = async(node:NodeData) => {
        let respuesta:any;
        if(node.type === 'entrada-telefono'){
            respuesta =await  searchRemisionesTelefono({ entidad: node.type || '', 
                payload: { 
                    telefono: node.atributos.Telefono, 
                    tipo: node.type 
                } 
            });
            if(respuesta.data.remisiones.length > 0){
                respuesta.data.remisiones.map((item: any) => {
                    const newNode = createNodeData(
                        `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`,
                        `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`, 
                        `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`, 
                        "image", 
                        15, 
                        {
                            background:"rgba(255, 255, 255, 0.8)",
                            border: "rgba(255, 255, 255, 0)",
                            highlight: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" },
                            hover: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" }
                          }, 
                        "persona",
                        'persona',
                        item,
                        {
                            "Nombre":item.Nombre,
                            "Ap_Paterno":item.Ap_Paterno,
                            "Ap_Materno":item.Ap_Materno,
                            "Telefono":item.Telefono
                        },
                        0,
                        0
                    );
                    //console.warn('NEW NODE TO EDGE:',newNode);
                    if(nodes.get(newNode.id) === null){
                        nodes.add(newNode);
                        edges.add({ from: node.id, to: newNode.id, label: 'Detenido Con' });
                    }else{
                        toast.error(`Ya existe una entidad identificada ${newNode.label}`)
                        edges.add({ from: node.id, to: newNode.id, label: 'Detenido Con' });
                    }
                });
            
            }
        }
        if(node.type === 'entrada-persona' || node.type === 'persona' || node.type === 'contacto'){
            respuesta = await searchData({ entidad: node.type || '', 
                payload: { 
                    label: `${node.atributos.Nombre} ${node.atributos.Ap_Paterno} ${node.atributos.Ap_Materno}`.toUpperCase(), 
                    tipo: node.type 
                } 
            });
            //console.log('RESPUESTA:',respuesta);
            if (respuesta.data.remisiones.length > 0) {
               nodes.map(async(n: any) => {


                if (n.id === node.id) {
                    let nodoModificado = n;
                    //console.log('NODO MODIFICADO:',nodoModificado);
                    nodoModificado.data.remisiones = respuesta.data.remisiones;
                    nodoModificado.atributos.Telefono = respuesta.data.remisiones
                        .map((item: any) => item.Telefono)
                        .filter((telefono: string) => !["0", "000", "00", "0000", "00000", "000000", "sd", "s/d", "SD", "S/D"].includes(telefono))
                        .join(', ');
                    nodoModificado.image = await convertToBase64(`http://172.18.110.25/sarai/files/Remisiones/${respuesta.data.remisiones[0].Ficha}/FotosHuellas/${respuesta.data.remisiones[0].No_Remision}/rostro_frente.jpeg`)
                    let viejosAtributos = nodoModificado.atributos;
                    nodoModificado.atributos = {
                        ...nodoModificado.atributos,
                        detenciones: {
                            sarai: respuesta.data.remisiones.map((item: any) => {

                                if (viejosAtributos.detenciones && viejosAtributos.detenciones.sarai) {
                                    if (viejosAtributos.detenciones.sarai.find((element:any) => element?.No_Remision === item.No_Remision)) return null;
                                }
                                return {
                                    Ficha: item.Ficha,
                                    No_Remision: item.No_Remision,
                                    CURP: item.CURP,
                                    Fec_Nac: item.Fecha_Nacimiento,
                                    Correo_Electronico: item.Correo_Electronico,
                                    Alias: item.Alias_Detenido,
                                    Fecha_Detencion: item.Fecha_Registro_Detenido,
                                    Genero: item.Genero,
                                    Nombre: item.Nombre,
                                    Ap_Paterno: item.Ap_Paterno,
                                    Ap_Materno: item.Ap_Materno,
                                    Telefono: item.Telefono,
                                    Remitido_Por: item.Faltas_Delitos_Detenido,
                                    Domicilio_Calle: item.Calle,
                                    Domicilio_Colonia: item.Colonia,
                                    Domicilio_Municipio: item.Municipio,
                                    Domicilio_Tipo: item.Tipo,
                                    Domicilio_No_Exterior: item.No_Exterior,
                                };
                            })
                        },
                        
                    };
                        nodoModificado.label = ``;
                        nodoModificado.label = `${nodoModificado.id} \n <b>Remisiones: (${respuesta.data.remisiones.length})</b>`;
                        let aliasjoin, fechadetencionjoin, noremisionjoin, curpjoin, fechanacimientojoin,delitosjoin,domiclio_join;
                        
                        aliasjoin = respuesta.data.remisiones.map((item: any) => item.Alias_Detenido).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                        noremisionjoin = respuesta.data.remisiones.map((item: any) => item.No_Remision).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                        curpjoin = respuesta.data.remisiones.map((item: any) => item.CURP).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                        fechanacimientojoin = respuesta.data.remisiones.map((item: any) => new Date(item.Fecha_Nacimiento).toLocaleDateString()).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                        fechadetencionjoin = respuesta.data.remisiones.map((item: any) => new Date(item.Fecha_Registro_Detenido).toLocaleDateString()).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                        delitosjoin = respuesta.data.remisiones.map((item: any) => item.Faltas_Delitos_Detenido).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', \n');    
                        
                        domiclio_join = respuesta.data.remisiones.map((item: any) => {
                            return `${item.Tipo} ${item.Calle} ${item.No_Exterior}, ${item.Colonia}, ${item.Municipio}\n,`;
                        }).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(' ');
                       
                        nodoModificado.editables ={
                            label: nodoModificado.id,
                            remisiones_label: `Remisiones: (${respuesta.data.remisiones.length})`,
                            alias: aliasjoin,
                            fecha_detencion: fechadetencionjoin,
                            no_remision: noremisionjoin,
                            curp: curpjoin,
                            fecha_nacimiento: fechanacimientojoin,
                            delitos: delitosjoin,
                            domicilio: domiclio_join
                        }

                        nodoModificado.visibles = {
                            label: true,
                            remisiones_label: true,
                            alias: true,
                            fecha_detencion: true,
                            no_remision: true,
                            curp: true,
                            fecha_nacimiento: true,
                            delitos: true,
                            domicilio: true
                        }


                        nodoModificado.label = `${nodoModificado.editables.label} \n <b>Remisiones: (${respuesta.data.remisiones.length})</b> \n <b>Alias: </b>${nodoModificado.editables.alias} \n<b>Fecha Detencion: </b>${nodoModificado.editables.fecha_detencion} \n<b>No Remision: </b>${nodoModificado.editables.no_remision}\n<b>Delitos: </b>${nodoModificado.editables.delitos}\n<b>Domicilios:</b>${nodoModificado.editables.domicilio} \n<b>CURP: </b>${nodoModificado.editables.curp} \n<b>Fecha Nacimiento: </b> ${nodoModificado.editables.fecha_nacimiento}
                        `;
                    
                        nodes.update(nodoModificado);
                    return nodoModificado;
                }
                return n;
                });
            }
        }
        if(node.type === 'llamada-911'){
            respuesta = await searchData({ entidad: node.type || '', 
                payload: { 
                    label: `${node.label}`, 
                    tipo: node.type 
                } 
            });
            //console.log('RESPUESTA:',respuesta);
            if (respuesta.data.remisiones.length > 0) {
                nodes.map(async (n) => {
                if (n.id === node.id) {
                    let nodoModificado = n;
                    //console.log('NODO MODIFICADO:',nodoModificado);
                    nodoModificado.data.remisiones = respuesta.data.remisiones;
                    nodoModificado.atributos.Telefono = respuesta.data.remisiones
                        .map((item: any) => item.Telefono)
                        .filter((telefono: string) => !["0", "000", "00", "0000", "00000", "000000", "sd", "s/d", "SD", "S/D"].includes(telefono))
                        .join(', ');
                    nodoModificado.image = await convertToBase64(`http://172.18.110.25/sarai/files/Remisiones/${respuesta.data.remisiones[0].Ficha}/FotosHuellas/${respuesta.data.remisiones[0].No_Remision}/rostro_frente.jpeg`)
                    let viejosAtributos = nodoModificado.atributos;
                    nodoModificado.atributos = {
                        ...nodoModificado.atributos,
                        detenciones: {
                            sarai: respuesta.data.remisiones.map((item: any) => {
                                if (viejosAtributos.detenciones && viejosAtributos.detenciones.sarai) {
                                    if (viejosAtributos.detenciones.sarai.find((element:any) => element.No_Remision === item.No_Remision)) return null;
                                }
                                return {
                                    Ficha: item.Ficha,
                                    No_Remision: item.No_Remision,
                                    CURP: item.CURP,
                                    Fec_Nac: item.Fecha_Nacimiento,
                                    Correo_Electronico: item.Correo_Electronico,
                                    Alias: item.Alias_Detenido,
                                    Fecha_Detencion: item.Fecha_Registro_Detenido,
                                    Genero: item.Genero,
                                    Nombre: item.Nombre,
                                    Ap_Paterno: item.Ap_Paterno,
                                    Ap_Materno: item.Ap_Materno,
                                    Telefono: item.Telefono,
                                };
                            })
                        },
                        
                    };
                        nodoModificado.label = ``;
                        nodoModificado.label = `${nodoModificado.id} \n <b>Remisiones: (${respuesta.data.remisiones.length})</b>`;
                        let aliasjoin, fechadetencionjoin, noremisionjoin, curpjoin, fechanacimientojoin;
                        
                        aliasjoin = respuesta.data.remisiones.map((item: any) => item.Alias_Detenido).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                        noremisionjoin = respuesta.data.remisiones.map((item: any) => item.No_Remision).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                        curpjoin = respuesta.data.remisiones.map((item: any) => item.CURP).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                        fechanacimientojoin = respuesta.data.remisiones.map((item: any) => new Date(item.Fecha_Nacimiento).toLocaleDateString()).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                        fechadetencionjoin = respuesta.data.remisiones.map((item: any) => new Date(item.Fecha_Registro_Detenido).toLocaleDateString()).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                        
                        nodoModificado.label = `${nodoModificado.label} \n <b>Alias: </b>${aliasjoin} \n<b>Fecha Detencion: </b>${fechadetencionjoin} \n<b>No Remision: </b>${noremisionjoin} \n<b>CRUP: </b>${curpjoin} \n<b>Fecha Nacimiento: </b> ${fechanacimientojoin}
                        `;
                    
                    nodes.update
                    return nodoModificado;
                }
                return n;
                });

            }
        }
        

    };


    const handleSearchHistorico = async(node:NodeData) => {

        let respuesta:any;
        if (node.type === 'entrada-persona' || node.type === 'persona' || node.type === 'contacto') {
            respuesta = await searchHistorico({ entidad: node.type || '', payload: { label: node.id, tipo: node.type } });
            //console.log('RESPUESTA:',respuesta.data.historico);
            if (respuesta.data.historico.length > 0) {
                nodes.map(n => {
                    if (n.id === node.id) {
                        let nodoModificado = n;
                        //console.log('NODO MODIFICADO:',nodoModificado);
                        nodoModificado.data.historico = respuesta.data.historico;
                        let viejosAtributos = nodoModificado.atributos;
                        nodoModificado.atributos = {
                            ...nodoModificado.atributos,
                            detenciones_historicas: {
                                historico: respuesta.data.historico.map((item: any) => {
                                    if (viejosAtributos.detenciones_historicas && viejosAtributos.detenciones_historicas.historico) {
                                        if (viejosAtributos.detenciones_historicas.historico.find((element: any) => element?.Folio === item.Folio)) return null;
                                    }
                                    return {
                                        Folio: item.Folio,
                                        No_Remision: '',
                                        CURP: '',
                                        Fec_Nac: '',
                                        Correo_Electronico: '',
                                        Alias: '',
                                        Fecha_Detencion: item.Fecha_Rem,
                                        Genero: item.Sexo_d,
                                        Nombre: item.Nombre_d,
                                        Ap_Paterno: item.Ap_paterno_d,
                                        Ap_Materno: item.Ap_materno_d,
                                    };
                                })
                            }
                        };
    
                        let foliojoin = respuesta.data.historico.map((item: any) => item.Folio).join(', ');
                        let fecharemjoin = respuesta.data.historico.map((item: any) => new Date(item.Fecha_Rem).toLocaleDateString()).join(', ');
                        let motivojoin = respuesta.data.historico.map((item: any) => item.Descripcion).join(', ');
                        let domiciliojoin = respuesta.data.historico.map((item: any) => `${item.Col_d}, ${item.Dom_d}`).join(', ');
    
                        nodoModificado.editables = {
                            ...nodoModificado.editables,
                            historico_label: `Historico: (${respuesta.data.historico.length})`,
                            historico_folios: foliojoin,
                            historico_fechas: fecharemjoin,
                            historico_motivo: motivojoin,
                            historico_domicilio: domiciliojoin
                        };
    
                        nodoModificado.visibles = {
                            ...nodoModificado.visibles,
                            historico_label: true,
                            historico_folios: true,
                            historico_fechas: true,
                            historico_motivo: true,
                            historico_domicilio: true
                        };
    
                        // Actualiza la etiqueta sin duplicar información
                        const newLabelParts = [
                            `<b>Historico: (${respuesta.data.historico.length})</b>`,
                            `<b>Folio: </b>${nodoModificado.editables?.historico_folios}`,
                            `<b>Fecha Remision: </b>${nodoModificado.editables?.historico_fechas}`,
                            `<b>Motivo: </b>${nodoModificado.editables?.historico_motivo}`,
                            `<b>Domicilio: </b>${nodoModificado.editables?.historico_domicilio}`
                        ];
    
                        const existingLabelParts = nodoModificado.label.split('\n').filter((part:any) => !newLabelParts.includes(part));
                        nodoModificado.label = [...existingLabelParts, ...newLabelParts].join('\n');
    
                        nodes.update(nodoModificado);
                        return nodoModificado;
                    }
                    return n;
                });
            }
        }
        if(node.type === 'llamada-911'){
         
            respuesta =await  searchHistorico({ entidad: node.type || '', payload: { label: node.id, tipo: node.type } });
            //console.log('RESPUESTA:',respuesta.data.historico);
            if (respuesta.data.historico.length > 0) {
                nodes.map(n => {
                    if (n.id === node.id) {
                        let nodoModificado = n;
                        //console.log('NODO MODIFICADO:',nodoModificado);
                        nodoModificado.data.historico = respuesta.data.historico;
                        let viejosAtributos = nodoModificado.atributos;
                        nodoModificado.atributos = {
                            ...nodoModificado.atributos,
                            detenciones_historicas: {
                                historico: respuesta.data.historico.map((item: any) => {
                                    if (viejosAtributos.detenciones_historicas && viejosAtributos.detenciones_historicas.historico) {
                                        if (viejosAtributos.detenciones_historicas.historico.find((element: any) => element.Folio === item.Folio)) return null;
                                    }
                                    return {
                                        Folio: item.Folio,
                                        No_Remision: '',
                                        CURP: '',
                                        Fec_Nac: '',
                                        Correo_Electronico: '',
                                        Alias: '',
                                        Fecha_Detencion: item.Fecha_Rem,
                                        Genero: item.Sexo_d,
                                        Nombre: item.Nombre_d,
                                        Ap_Paterno: item.Ap_paterno_d,
                                        Ap_Materno: item.Ap_materno_d,
                                    };
                                })
                            }
                        };
            
                        let foliojoin = respuesta.data.historico.map((item: any) => item.Folio).join(', ');
                        let fecharemjoin = respuesta.data.historico.map((item: any) => new Date(item.Fecha_Rem).toLocaleDateString()).join(', ');
                        let motivojoin = respuesta.data.historico.map((item: any) => item.Descripcion).join(', ');
                        let domiciliojoin = respuesta.data.historico.map((item: any) => `${item.Col_d}, ${item.Dom_d}`).join(', ');
            
                        nodoModificado.editables = {
                            ...nodoModificado.editables,
                            historico_label: `Historico: (${respuesta.data.historico.length})`,
                            historico_folios: foliojoin,
                            historico_fechas: fecharemjoin,
                            historico_motivo: motivojoin,
                            historico_domicilio: domiciliojoin
                        };
            
                        nodoModificado.visibles = {
                            ...nodoModificado.visibles,
                            historico_label: true,
                            historico_folios: true,
                            historico_fechas: true,
                            historico_motivo: true,
                            historico_domicilio: true
                        };
            
                        // Actualiza la etiqueta sin duplicar información
                        const newLabelParts = [
                            `<b>Historico: (${respuesta.data.historico.length})</b>`,
                            `<b>Folio: </b>${nodoModificado.editables?.historico_folios}`,
                            `<b>Fecha Remision: </b>${nodoModificado.editables?.historico_fechas}`,
                            `<b>Motivo: </b>${nodoModificado.editables?.historico_motivo}`,
                            `<b>Domicilio: </b>${nodoModificado.editables?.historico_domicilio}`
                        ];
            
                        const existingLabelParts = nodoModificado.label.split('\n').filter((part: any) => !newLabelParts.includes(part));
                        nodoModificado.label = [...existingLabelParts, ...newLabelParts].join('\n');
            
                        nodes.update(nodoModificado);
                        return nodoModificado;
                    }
                    return n;
                });
            }
        }
    };

    const handleSearchAura = async(node:NodeData) => {
        console.warn('Buscando Aura', node);
        let respuesta:any;
        if (node.type === 'entrada-persona' || node.type === 'persona' || node.type === 'contacto') {
            respuesta = await searchAura({ entidad: node.type || '', payload: { label: node.id, tipo: node.type } });
            console.log('RESPUESTA:',respuesta);
            if (respuesta.data.aura && respuesta.data.aura.length > 0) {
                nodes.map(n => {
                    if (n.id === node.id) {
                        let nodoModificado = n;
                        //console.log('NODO MODIFICADO:',nodoModificado);
                        nodoModificado.data.aura = respuesta.data.aura;
                        let viejosAtributos = nodoModificado.atributos;
                        nodoModificado.atributos = {
                            ...nodoModificado.atributos,
                            aura: {
                                aura: respuesta.data.aura.map((item: any) => {
                                    if (viejosAtributos.aura && viejosAtributos.aura.aura) {
                                        if (viejosAtributos.aura.aura.find((element: any) => element?.Id_Persona === item.Id_Persona)) return null;
                                    }
                                    return {
                                        Id_Persona: item.Id_Persona,
                                        Id_Seguimiento: item.Id_Seguimiento,
                                        Banda: item.Nombre_grupo_delictivo,
                                        Nombre_completo: item.Nombre_completo,
                                        Curp: item.Curp,
                                        Telefono: item.Telefono,
                                        Alias: item.Alias,
                                    };
                                })
                            }
                        };
    
    
                        nodoModificado.editables = {
                            ...nodoModificado.editables,
                            aura_label: `Aura:)`,
                            aura_seguimiento: respuesta.data.aura.map((item: any) => item.Id_Seguimiento).join(', '),
                            aura_banda: respuesta.data.aura.map((item: any) => item.Nombre_grupo_delictivo).join(', '),
                        };
    
                        nodoModificado.visibles = {
                            ...nodoModificado.visibles,
                            aura_label: true,
                            aura_seguimiento: true,
                            aura_banda: true
                        };
    
                        // Actualiza la etiqueta sin duplicar información
                        const newLabelParts = [
                            `<b>Aura: </b>`,
                            `<b>Seguimiento: </b>${nodoModificado.editables?.aura_seguimiento}`,
                            `<b>Banda: </b>${nodoModificado.editables?.aura_banda}`
                        ];
    
                        const existingLabelParts = nodoModificado.label.split('\n').filter((part:any) => !newLabelParts.includes(part));
                        nodoModificado.label = [...existingLabelParts, ...newLabelParts].join('\n');
    
                        nodes.update(nodoModificado);
                        return nodoModificado;
                    }
                    return n;
                });
            }
        }
    };

    const handleSearchInspeccion = async() => {
        let payload = {};
        let respuesta:any;
        const selectedNodes = network?.getSelectedNodes() || [];
        if (selectedNodes.length === 0) {
            toast.error('No hay nodos seleccionados.');
            return;
        }
        for (const nodeId of selectedNodes) {
            const node = nodes.get(nodeId);
            if (node) {
            if (node.entidad === 'vehiculo') {
                payload = { placas: node.atributos.Placas, niv: node.atributos.NIV };
                respuesta = await searchVehiculoInspeccion({ entidad: node.type || '', payload: payload }); //BUSCA UNA PLACA O NIV EN INSPECCIONES
                //console.log('RESPUESTA:',respuesta.data.vehiculos);
                if (respuesta.data.vehiculos.length > 0) {
                respuesta.data.vehiculos.map((item: any) => {
                    //console.log('item:',item);
                    if (item.Telefono === '') return;
                    const newNode = createNodeData(
                    `${item.Id_Inspeccion}`,
                    `${item.Id_Inspeccion}`,
                    `${item.Id_Inspeccion}`,
                    "image",
                    15,
                    {
                        background:"rgba(255, 255, 255, 0.8)",
                        border: "rgba(255, 255, 255, 0)",
                        highlight: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" },
                        hover: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" }
                      }, 
                    "inspeccion",
                    'persona',
                    item,
                    {
                        Alias: item.Alias,
                        Fecha: new Date(item.Fecha_Hora_Inspeccion).toLocaleDateString(),
                        Colonia: item.Colonia,
                        Calle_1: item.Calle_1,
                        Calle_2: item.Calle_2,
                        No_Exterior: item.No_Ext,
                        Coordenada_X: item.Coordenada_X,
                        Coordenada_Y: item.Coordenada_Y,
                        Id_Inspeccion: item.Id_Inspeccion,
                    },
                    0,
                    0
                    );

                    //console.warn('NEW NODE TO EDGE:',newNode);
                    addNode({ newNode: newNode, parentPosition: network?.getPosition(node.id) }, (data: any) => {
                    //console.log('Node added:', data);
                    if (data.status == false) {
                        console.error('Error adding node');
                        addEdge({ from: node.id, to: data.encontro.id, label: 'Inspeccion' }, (data: any) => {
                        console.log('Edge added:', data);
                        });
                    } else {
                        //console.log('QUE ME ESTA HAYANDO:',data);
                        if (newNode && data.status == true) {
                        addEdge({ from: node.id, to: newNode.id, label: 'Inspeccion' }, (data: any) => {
                            console.log('Edge added:', data);
                        });
                        }
                    }
                    });
                });
                }
            }
            if (node.entidad === 'persona') {
                payload = { label: node.id };
                respuesta = await searchInspeccion({ entidad: node.type || '', payload: payload });
                //console.log('RESPUESTA:',respuesta.data.inspeccion);
                if (respuesta.data.inspeccion.length > 0) {
                respuesta.data.inspeccion.map((item: any) => {
                    //console.log('item:',item);
                    if (item.Telefono === '') return;
                    const newNode = createNodeData(
                    `${item.Id_Inspeccion}`,
                    `${item.Id_Inspeccion}`,
                    `${item.Id_Inspeccion}`,
                    "image",
                    15,
                    {
                        background:"rgba(255, 255, 255, 0.8)",
                        border: "rgba(255, 255, 255, 0)",
                        highlight: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" },
                        hover: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" }
                      }, 
                    "inspeccion",
                    'persona',
                    item,
                    {
                        Alias: item.Alias,
                        Fecha: new Date(item.Fecha_Hora_Inspeccion).toLocaleDateString(),
                        Colonia: item.Colonia,
                        Calle_1: item.Calle_1,
                        Calle_2: item.Calle_2,
                        No_Exterior: item.No_Ext,
                        Coordenada_X: item.Coordenada_X,
                        Coordenada_Y: item.Coordenada_Y,
                        Id_Inspeccion: item.Id_Inspeccion,
                    },
                    0,
                    0
                    );

                    //console.warn('NEW NODE TO EDGE:',newNode);
                    addNode({ newNode: newNode, parentPosition: network?.getPosition(node.id) }, (data: any) => {
                    //console.log('Node added:', data);
                    if (data.status == false) {
                        console.error('Error adding node');
                        addEdge({ from: node.id, to: newNode.id, label: 'Inspeccion' }, (data: any) => {
                        console.log('Edge added:', data);
                        });
                    } else {
                        if (newNode && data.status == true) {
                        addEdge({ from: node.id, to: newNode.id, label: 'Inspeccion' }, (data: any) => {
                            console.log('Edge added:', data);
                        });
                        }
                    }
                    });
                });
                }
            }
            }
        }
    };

    const handleSearchVehiculosInspeccion = async() => {
        const selectedNodes = network?.getSelectedNodes() || [];
        if (selectedNodes.length === 0) {
            toast.error('No hay nodos seleccionados.');
            return;
        }
        for (const nodeId of selectedNodes) {
            const node = nodes.get(nodeId);
            if (node) {
                const respuesta = await searchVehiculoInspeccion({ entidad: node.type || '', payload: { inspeccion: node.atributos.Id_Inspeccion, placas: node.atributos.Placas_Vehiculo, NIV: node.atributos.NIV } });
                //console.log('RESPUESTA:',respuesta.data.vehiculos);
                if (respuesta.data.vehiculos.length > 0) {
                    respuesta.data.vehiculos.map((item: any) => {
                        //console.log('item:',item);
                        if (item.Placas === '') return;
                        const newNode = createNodeData(
                            `${item.Placas_Vehiculo.trim()}/${item.NIV.trim()}`,
                            `${item.Placas_Vehiculo.trim()}/${item.NIV.trim()}`,
                            `${item.Placas_Vehiculo.trim()}/${item.NIV.trim()}`,
                            "image",
                            15,
                            {
                                background:"rgba(255, 255, 255, 0.8)",
                                border: "rgba(255, 255, 255, 0)",
                                highlight: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" },
                                hover: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" }
                            }, 
                            "vehiculo",
                            'vehiculo',
                            item,
                            {
                                Marca: item.Marca,
                                Modelo: item.Modelo,
                                Tipo: item.Tipo,
                                Placas: item.Placas_Vehiculo,
                                Color: item.Color,
                                NIV: item.NIV,
                                Submarca: item.Submarca,
                                Colocacion_Placas: item.Colocacion_Placa,
                            },
                            0,
                            0
                        );
                        //console.warn('NEW NODE TO EDGE:',newNode);
                        addNode({ newNode: newNode, parentPosition: network?.getPosition(node.id) }, (data: any) => {
                            //console.log('Node added:', data.status);
                            if (data.status == false) {
                                console.error('Error adding node');
                                addEdge({ from: node.id, to: data.encontro.id, label: 'Vehiculo' }, (data: any) => {
                                    console.log('Edge added:', data);
                                });
                            } else {
                                if (newNode && data.status == true) {
                                    addEdge({ from: node.id, to: newNode.id, label: 'Vehiculo' }, (data: any) => {
                                        console.log('Edge added:', data);
                                    });
                                }
                            }
                        });
                    });
                }
            }
        }
    };
        

    const handleSearchTelefono = async (node: NodeData) => {
        try {
          const respuesta = await buscarLlamadas911({ 
            entidad: node.type || '', 
            payload: { telefono: node.atributos.Telefono } 
          });
          
          //console.log('RESPUESTA:', respuesta.data.llamadas);
      
          if (respuesta.data.llamadas.length) {
            //console.log('SI HAY LLAMADAS');
      
            for await (const item of respuesta.data.llamadas) {
              //console.log('item:', item);
              // Crear el nodo a partir de los datos
              const newNode = createNodeData(
                `${item['Nom completo']}`.trim().toUpperCase(),
                item['Nom completo'],
                item['Nom completo'],
                "image",
                15,
                {
                    background:"rgba(255, 255, 255, 0.8)",
                    border: "rgba(255, 255, 255, 0)",
                    highlight: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" },
                    hover: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" }
                  }, 
                "llamada-911",
                'persona',
                item,
                {
                  "Telefono": item.Telefono,
                  "Comentarios": item.Comentarios,
                  "Ubicacion": item.Ubicacion
                },
                0,
                0
              );
      
              //console.warn('NEW NODE TO EDGE:', newNode);
      
              // Validar si el nodo ya existe
                // Agregar el nodo
                addNode({newNode: newNode, parentPosition: network?.getPosition(node.id)}, (data: any) => {
                    console.log('Node added:', data.status,'encontrado:',data.encontro);
                        if (data.status == false) {
                            console.error('Error adding node');
                            addEdge({ from: node.id, to: data.encontro.id, label: 'Llamada al 911' }, (data: any) => {
                                console.log('Edge added:', data);
                            });
                        }
                        else{
                            if(newNode && data.status==true){
                                addEdge({ from: node.id, to: newNode.id, label: `Llamada al 911` }, (data: any) => {
                                    console.log('Edge added:', data);
                                });
                            }
                        }
                    
                    });
                };
      
                
              }
          
        } catch (error) {
          console.error('Error in handleSearchTelefono:', error);
        }
    };
      
    const handleSearchRemisionesTelefono = async(node:NodeData) => { 

        const respuesta = await searchRemisionesTelefono({ entidad: node.type || '', payload: { telefono: node.atributos.Telefono } });
        //console.log('RESPUESTA:',respuesta.data.remisiones);
        if (respuesta.data.remisiones.length > 0) {
            respuesta.data.remisiones.map((item: any) => {
                const newNode = createNodeData(
                    `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`,
                    `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`, 
                    `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`, 
                    "image", 
                    15, 
                    {
                        background:"rgba(255, 255, 255, 0.8)",
                        border: "rgba(255, 255, 255, 0)",
                        highlight: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" },
                        hover: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" }
                      }, 
                    "persona",
                    'persona',
                    item,
                    {
                        "Nombre":item.Nombre,
                        "Ap_Paterno":item.Ap_Paterno,
                        "Ap_Materno":item.Ap_Materno,
                        "Telefono":item.Telefono
                    },
                    0,
                    0
                );
                //console.warn('NEW NODE TO EDGE:',newNode);
                addNode({newNode: newNode, parentPosition: network?.getPosition(node.id)}, (data: any) => {
                    //console.log('Node added:', data.status);
                    if (data.status == false) {
                        console.error('Error adding node');
                        addEdge({ from: node.id, to: newNode.id, label: 'Telefono dado por' }, (data: any) => {
                            console.log('Edge added:', data);
                        });
                    }
                    else{
                        if(newNode && data.status==true){
                            addEdge({ from: node.id, to: newNode.id, label: `Dio el Telefono ${item.Telefono}` }, (data: any) => {
                                console.log('Edge added:', data);
                            });
                        }
                    }
                });
            });
        }
    };
// Buscar Contactos referidos a partir del telefono
    const handleSearchContactosTelefono = async(node:NodeData) => {
        const respuesta = await buscarContactosPorTelefono({ entidad: node.type || '', payload: { telefono: node.atributos.Telefono } });
        //console.log('RESPUESTA:',respuesta.data.contactos);
        if(respuesta.data.contactos.length){
            //console.log('SI HAY TELEFONOS');
            respuesta.data.contactos.map((item: any) => {
                //console.log('item:',item);
                if(item.Telefono === '') return;
                const newNode = createNodeData(
                    `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`, 
                    `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`, 
                    `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`, 
                    "image", 
                    15, 
                    {
                        background:"rgba(255, 255, 255, 0.8)",
                        border: "rgba(255, 255, 255, 0)",
                        highlight: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" },
                        hover: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" }
                      }, 
                    "persona", 
                    'persona',
                    item,
                    {
                        "Telefono":item.Telefono,
                        "Nombre":item.Nombre,
                        "Ap_Paterno":item.Ap_Paterno,
                        "Ap_Materno":item.Ap_Materno,
                    },
                    0,
                    0
                );
                //console.warn('NEW NODE TO EDGE:',newNode);
                addNode({newNode: newNode, parentPosition: network?.getPosition(node.id)}, (data: any) => {
                    //console.log('Node added:', data.status);
                    if (data.status == false) {
                        console.error('Error adding node');
                        addEdge({ from: node.id, to: newNode.id, label: 'Telefono de Contacto' }, (data: any) => {
                            console.log('Edge added:', data);
                        });
                    }else{
                        if(newNode && data.status==true){
                            addEdge({ from: node.id, to: newNode.id, label:'Telefono de Contacto' }, (data: any) => {
                                console.log('Edge added:', data);
                            });
                        }
                    }
                });

            });
        }
    };

    const handleSearchVehiculoRemision = async(node:NodeData) => {
        const respuesta = await searchVehiculoRemision({ entidad: node.type || '', payload: { placa: node.atributos.Placas, niv: node.atributos.NIV } });
        //console.log('RESPUESTA:',respuesta.data.vehiculos);
        if(respuesta.data.vehiculos.length > 0){
            //console.warn('SI HAY VEHICULOS');
            nodes.map(async(n) => {
                if (n.id === node.id) {
                    let nodoModificado = n;
                    //console.log('NODO MODIFICADO:',nodoModificado);
                    nodoModificado.data.vehiculos = respuesta.data.vehiculos;
                    let viejosAtributos = nodoModificado.atributos;

                    if (viejosAtributos.detenciones && viejosAtributos.detenciones.sarai) {
                        if (viejosAtributos.detenciones.sarai.find((element:any) => element.No_Remision === respuesta.data.vehiculos[0].No_Remision)) return n;
                    }

                    nodoModificado.atributos = {
                        ...nodoModificado.atributos,
                        detenciones: {
                            sarai: respuesta.data.vehiculos.map((item: any) => ({
                                Placa: item.Placa_Vehiculo.trim(),
                                Marca: item.Marca,
                                Submarca: item.Submarca,
                                Tipo: item.Tipo_Vehiculo,
                                Modelo: item.Modelo,
                                Color: item.Color,
                                Sena_Particular: item.Sena_Particular,
                                Observaciones: item.Observacion_Vehiculo,
                                NIV: item.No_Serie.trim(),
                                No_Remision: item.No_Remision,
                                Nombre: item.Nombre,
                                Ap_Paterno: item.Ap_Paterno,
                                Ap_Materno: item.Ap_Materno,	
                                Fecha_Remision: item.Fecha_Hora,
                                ID_VEHICULO: item.ID_VEHICULO
                            }))
                        }
                    };
                    nodoModificado.image = await convertToBase64(`http://172.18.110.25/sarai/public/files/Vehiculos/${respuesta.data.vehiculos[0].ID_VEHICULO}/Fotos/costado_conductor.jpeg`)
                    nodoModificado.label = ``;
                    nodoModificado.label = `${nodoModificado.label} \n <b>Remisiones: (${respuesta.data.vehiculos.length})</b>`;
                    let placasjoin, nivjoin, nombresjoin, fechasjoin, remisionesjoin;
                    placasjoin = respuesta.data.vehiculos.map((item: any) => item.Placa_Vehiculo).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                    nivjoin = respuesta.data.vehiculos.map((item: any) => item.No_Serie).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                    nombresjoin = respuesta.data.vehiculos.map((item: any) => `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                    fechasjoin = respuesta.data.vehiculos.map((item: any) => new Date(item.Fecha_Hora).toLocaleDateString()).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');
                    remisionesjoin = respuesta.data.vehiculos.map((item: any) => item.No_Remision).filter((value: string, index: number, self: string[]) => self.indexOf(value) === index).join(', ');

                    nodoModificado.label = `${nodoModificado.label} \n <b>Nombre: </b>${nombresjoin}\n<b>Placas: </b>${placasjoin} \n<b>Niv: </b>${nivjoin} \n<b>No Remision: </b>${remisionesjoin} \n<b>Fecha:</b> ${fechasjoin}`;

                    return nodoModificado;
                }
                return n;
                });
                //Agregamos a las personas de los vehiculos
                respuesta.data.vehiculos.map((item: any) => {
                    const newNode = createNodeData(
                        `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`,
                        `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`, 
                        `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`, 
                        "image", 
                        15, 
                        {
                            background:"rgba(255, 255, 255, 0.8)",
                            border: "rgba(255, 255, 255, 0)",
                            highlight: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" },
                            hover: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" }
                          }, 
                        "persona",
                        'persona',
                        item,
                        {
                            "Nombre":item.Nombre,
                            "Ap_Paterno":item.Ap_Paterno,
                            "Ap_Materno":item.Ap_Materno,
                            "Telefono":item.Telefono
                        },
                        0,
                        0
                    );
                    //console.warn('NEW NODE TO EDGE:',newNode);
                    addNode({newNode: newNode, parentPosition: network?.getPosition(node.id)}, (data: any) => {
                        //console.log('Node added:', data.status);
                        if (data.status == false) {
                            console.error('Error adding node');
                        }
                        else{
                            if(newNode && data.status==true){
                                addEdge({ from: node.id, to: newNode.id, label: 'Detenido Con' }, (data: any) => {
                                    console.log('Edge added:', data);
                                });
                            }
                        }
                    });
                });

        }
    }

    const handleExtraerTelefonos = async(node:NodeData) => { 

        if(node.type === 'contacto'){
            //console.log('ES UN CONTACTO');
            if(node.atributos.Telefono === '') return;
            let invalidPhones = ["0", "000", "00", "0000", "00000", "000000", "sd", "s/d", "SD", "S/D"];
            if (/^0+$/.test(node.atributos.Telefono)) return;
            if(invalidPhones.find(valor => valor === node.atributos.Telefono) ) return;
            const newNode = createNodeData(
                `${node.atributos.Telefono}`, 
                node.atributos.Telefono, 
                node.atributos.Telefono, 
                "image", 
                15, 
                {
                    background:"rgba(255, 255, 255, 0.8)",
                    border: "rgba(255, 255, 255, 0)",
                    highlight: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" },
                    hover: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" }
                  }, 
                "telefono", 
                'telefono',
                node.atributos,
                {
                    "Telefono":node.atributos.Telefono
                },
                0,
                0
            );
            //console.warn('NEW NODE TO EDGE:',newNode);
            addNode({newNode: newNode, parentPosition: network?.getPosition(node.id)}, (data: any) => {
                //console.log('Node added:', data.status);
                if (data.status == false) {
                    console.error('Error adding node');
                }
                else{
                    
                    if(newNode && data.status==true ){
                        addEdge({ from: node.id, to: newNode.id, label:'Telefono de Contacto' }, (data: any) => {
                            console.log('Edge added:', data);
                        });
                    }
                }
            });
        }else {

            const respuesta = node.data.remisiones;
            respuesta.map((item: any) => {
                //console.log('item:',item);
                let invalidPhones = ["0", "000", "00", "0000", "00000", "000000", "sd", "s/d", "SD", "S/D"];
                if (/^0+$/.test(node.atributos.Telefono)) return;
                if(invalidPhones.find(valor => valor === item.Telefono) ) return;
                const newNode = createNodeData(
                    `${item.Telefono}`, 
                    item.Telefono, 
                    item.Telefono, 
                    "image", 
                    15, 
                    {
                        background:"rgba(255, 255, 255, 0.8)",
                        border: "rgba(255, 255, 255, 0)",
                        highlight: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" },
                        hover: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" }
                      }, 
                    "telefono", 
                    'telefono',
                    item,
                    {
                        "Telefono":item.Telefono
                    },
                    0,
                    0
                );
                //console.warn('NEW NODE TO EDGE:',newNode);
                addNode({newNode: newNode, parentPosition: network?.getPosition(node.id)}, (data: any) => {
                    //console.log('Node added:', data.status);
                    if (data.status == false) {
                        console.error('Error adding node');
                    }
                    else{
                        if(newNode && data.status==true){
                            addEdge({ from: node.id, to: newNode.id, label:'Telefono de Contacto' }, (data: any) => {
                                console.log('Edge added:', data);
                            });
                        }
                    }
                });
            });
        }

    }

    const handleSearchPersonasInspeccion = async() => {
        const selectedNodes = network?.getSelectedNodes() || [];
        if (selectedNodes.length === 0) {
            toast.error('No hay nodos seleccionados.');
            return;
        }
        for (const nodeId of selectedNodes) {
            const node = nodes.get(nodeId);
            if (node) {
                const respuesta = await searchPersonaInspeccion({ entidad: node.type || '', payload: { inspeccion: node.atributos.Id_Inspeccion } });
                //console.log('RESPUESTA:',respuesta.data.personas);
                if (respuesta.data.personas.length > 0) {
                    respuesta.data.personas.map((item: any) => {
                        //console.log('item:',item);
                        if (item.Placas === '') return;
                        const newNode = createNodeData(
                            `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`,
                            `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`,
                            `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`,
                            "image",
                            15,
                            {
                                background:"rgba(255, 255, 255, 0.8)",
                                border: "rgba(255, 255, 255, 0)",
                                highlight: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" },
                                hover: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" }
                              }, 
                            "persona",
                            'persona',
                            item,
                            {
                                Nombre: item.Nombre,
                                Ap_Paterno: item.Ap_Paterno,
                                Ap_Materno: item.Ap_Materno,
                            },
                            0,
                            0
                        );
                        //console.warn('NEW NODE TO EDGE:',newNode);
                        addNode({ newNode: newNode, parentPosition: network?.getPosition(node.id) }, (data: any) => {
                            //console.log('Node added:', data.status);
                            if (data.status == false) {
                                console.error('Error adding node');
                                addEdge({ from: node.id, to: newNode.id, label: 'Persona Inspeccionada' }, (data: any) => {
                                    console.log('Edge added:', data);
                                });
                            } else {
                                if (newNode && data.status == true) {
                                    addEdge({ from: node.id, to: newNode.id, label: 'Persona Inspeccionada' }, (data: any) => {
                                        console.log('Edge added:', data);
                                    });
                                }
                            }
                        });
                    });
                }
            }
        }
    }


    const handleSearchMaestroPersona = async() => {
        const selectedNodes = network?.getSelectedNodes() || [];
        if (selectedNodes.length === 0) {
            toast.error('No hay nodos seleccionados.');
            return;
        }
        for (const nodeId of selectedNodes) {
            const node = nodes.get(nodeId);
            if (node) {
                if(node.type === 'entrada-vehiculo' || node.type === 'vehiculo'){
                    await handleSearchVehiculoRemision(node);
                } else {
                    await handleSearchRemisiones(node); //Recuerda con el await lo hacemos secuencial para no repetir informacion en el label del nodo
                    await handleSearchHistorico(node);
                    await handleSearchAura(node);
                }
            }
        }
        for (const nodeId of selectedNodes) {
            const nodeToUpdate = nodes.get(nodeId);
            if (nodeToUpdate) {
                nodes.update({
                    id: nodeId,
                    color: {
                        ...nodeToUpdate.color,
                        border: 'green'
                    }
                });
            }
        }
    };

    const handleSearchBanda = async() => {
        const selectedNodes = network?.getSelectedNodes() || [];
        if (selectedNodes.length === 0) {
            toast.error('No hay nodos seleccionados.');
            return;
        }
        for (const nodeId of selectedNodes) {
            const node = nodes.get(nodeId);
            if (node) {
                const respuesta = await searchPersonasBanda({ entidad: node.type || '', payload: { Banda: node.editables?.aura_banda } });
                console.log('RESPUESTA:',respuesta.data.aura);
                if (respuesta.data.aura.length > 0) {
                    respuesta.data.aura.map((item: any) => {
                        //console.log('item:',item);
                        if (item.Nombre === '') return;
                        const newNode = createNodeData(
                            `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`,
                            `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`,
                            `${item.Nombre} ${item.Ap_Paterno} ${item.Ap_Materno}`,
                            "image",
                            15,
                            {
                                background:"rgba(255, 255, 255, 0.8)",
                                border: "rgba(255, 255, 255, 0)",
                                highlight: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" },
                                hover: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" }
                              }, 
                            "persona",
                            'persona',
                            item,
                            {
                                Nombre: item.Nombre,
                                Ap_Paterno: item.Ap_Paterno,
                                Ap_Materno: item.Ap_Materno,
                                Banda: item.Nombre_grupo_delictivo,
                                Telefono: item.Telefono
                            },
                            0,
                            0
                        );
                        //console.warn('NEW NODE TO EDGE:',newNode);
                        addNode({ newNode: newNode, parentPosition: network?.getPosition(node.id) }, (data: any) => {
                            //console.log('Node added:', data.status);
                            if (data.status == false) {
                                console.error('Error adding node');
                                addEdge({ from: node.id, to: newNode.id, label: 'Integrande de la Banda' }, (data: any) => {
                                    console.log('Edge added:', data);
                                });
                            } else {
                                if (newNode && data.status == true) {
                                    addEdge({ from: node.id, to: newNode.id, label: 'Integrande de la Banda' }, (data: any) => {
                                        console.log('Edge added:', data);
                                    });
                                }
                            }
                        });
                    });
                }
            }
        }
    }

    const convertToBase64 = async (url: string): Promise<string> => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result as string);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Error converting image to base64:', error);
            return '';
        }
    };


    return {
        contextMenu,
        handleContextMenu,
        handleSearchExtended,
        handleDetenidoConModal,    // Exporta esta función para usarla
        isModalFichasOpen,
        selectedNode,
        setIsModalFichasOpen,
        isModalContactosOpen,
        setIsModalContactosOpen,
        closeContextMenu: () => setContextMenu({ x: 0, y: 0, edgeId: null, nodeId: null }),
    };
};

export default useContextMenu;