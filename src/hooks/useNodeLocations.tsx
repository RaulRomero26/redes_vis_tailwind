import { useState, useCallback } from "react";
import { useNetwork } from "../context/NetwokrContext";
import mapboxgl from "mapbox-gl";
import { useSearchEntity } from './useSearchEntity';
import inspeccion from '../assets/inspeccion.png';

export const useNodeLocations = (mapInstanceRef: any, filters: any) => {
    const [_selectedNodes, setSelectedNodes] = useState<any[]>([]);
    const [_localizacionesRemision, setLocalizacionesRemision] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(false); // Estado para controlar las peticiones
    const { network, nodes } = useNetwork();
    const { searchUbicacionesRemision } = useSearchEntity();

    const debounce = (func: Function, wait: number) => {
        let timeout: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    const getNodeLocations = () => {
        const selectedNodes = network?.getSelectedNodes();
        let selectedNodesInfo: any[] = [];

        selectedNodes?.forEach((node) => {
            selectedNodesInfo.push(nodes.get(node));
        });

        setSelectedNodes(selectedNodesInfo);
        return selectedNodesInfo;
    };

    const handleSelectNode = useCallback(debounce(() => {
        console.warn("Nodo seleccionado");
        const selectedNodes = getNodeLocations();
        putLocatiosnOnMap(selectedNodes);
    }, 300), [network]);

    if (network) {
        network.on("selectNode", handleSelectNode);
    }

    const CreateCustomMarker = async (tipo_nodo: any, ficha: any, remision: any, tipo: any, data: any) => {
        let markerElement: HTMLDivElement | null = null;
        let popup: mapboxgl.Popup | null = null;
        console.log('Tipo nodo:', tipo_nodo);
        switch (tipo_nodo) {
            case 'inspeccion':
                const imageUrl = inspeccion;
                // Crear un marcador con una imagen personalizada
                markerElement = document.createElement("div");
                markerElement.style.backgroundImage = `url(${imageUrl})`;
                markerElement.style.width = "25px"; // Ajusta el tamaño
                markerElement.style.height = "25px";
                markerElement.style.backgroundSize = "cover";
                markerElement.style.borderRadius = "50%"; // Hace la imagen redonda
                markerElement.setAttribute('data-tipo', 'inspeccion');
                popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
                    <div style="font-size: 12px; line-height: 1.5;">
                    <strong>Tipo:</strong> ${tipo_nodo}<br/>
                    <strong>Fecha:</strong> ${data.Fecha_Hora_Inspeccion.toLocaleString()}<br/>
                    <strong>Remision:</strong> ${data.Id_Inspeccion}<br/>
                    <strong>Nombre:</strong> ${data.Nombre} ${data.Ap_Paterno} ${data.Ap_Materno}<br/>
                    <strong>Motivo:</strong> ${data.Motivo_Inspeccion} 
                    </div>
                `);
                break;
            case 'persona':
                const imageURL = `http://172.18.110.25/sarai/public/files/Remisiones/${ficha}/FotosHuellas/${remision}/rostro_frente.jpeg`;
                // Crear un marcador con una imagen personalizada
                markerElement = document.createElement("div");
                markerElement.style.backgroundImage = `url(${imageURL})`;
                markerElement.style.width = "50px"; // Ajusta el tamaño
                markerElement.style.height = "50px";
                markerElement.style.backgroundSize = "cover";
                markerElement.style.borderRadius = "50%"; // Hace la imagen redonda
                markerElement.setAttribute('data-tipo', tipo);
                popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
                    <div style="font-size: 12px; line-height: 1.5;">
                    <strong>Tipo:</strong> ${tipo}<br/>
                    <strong>Fecha:</strong> ${data.Fecha_Hora}<br/>
                    <strong>Remision:</strong> ${data.No_Remision}<br/>
                    <strong>Nombre:</strong> ${data.Nombre} ${data.Ap_Paterno} ${data.Ap_Materno}<br/>
                    <strong>Motivo:</strong> ${data.Faltas_Delitos_Detenido} 
                    </div>
                `);
                break;
            default:
                break;
        }

        return { markerElement, popup };
    };

    const isValidCoordinate = (lng: number, lat: number) => {
        return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
    };

    const putLocatiosnOnMap = async (selected: any) => {
        if (!mapInstanceRef.current || isFetching) {
            console.error("El mapa aún no está inicializado o ya se están realizando peticiones");
            return;
        }

        setIsFetching(true); // Marcar que se están realizando peticiones

        // Eliminar todos los marcadores existentes en el mapa
        const markers = document.getElementsByClassName('mapboxgl-marker');
        while (markers.length > 0) {
            markers[0].remove();
        }
        console.log("Marcadores seleccionados:", selected);
        for (const node of selected) {
            switch (node.type) {
                case "inspeccion":
                    const { Coordenada_X, Coordenada_Y } = node.data;
                    const { markerElement, popup } = await CreateCustomMarker(node.type, '', '', 'Inspeccion', node.data);
                    if (markerElement) {
                        new mapboxgl.Marker({ element: markerElement })
                            .setLngLat(isValidCoordinate(Coordenada_X, Coordenada_Y) ? [Coordenada_X, Coordenada_Y] : [0, 0])
                            .setPopup(popup)
                            .addTo(mapInstanceRef.current);
                    }
                    break;
                case "persona":
                    const { remisiones } = node.data;
                    if (remisiones !== undefined && remisiones.length > 0) {
                        const localizaciones = await Promise.all(
                            remisiones.map(async (remision: any) => {
                                const ubicacion = await searchUbicacionesRemision(remision.No_Remision);
                                return ubicacion;
                            })
                        );
                        console.log("Localizaciones:", localizaciones);
                        setLocalizacionesRemision(localizaciones);

                        localizaciones.forEach((ubicaciones_remision) => {
                            if (ubicaciones_remision && ubicaciones_remision.data) {
                                const { ubicaciones } = ubicaciones_remision.data;
                                if (ubicaciones) {
                                    if (ubicaciones.detencion) {
                                        ubicaciones.detencion.forEach(async (ubicacion: any) => {
                                            const { markerElement, popup } = await CreateCustomMarker(node.type, ubicacion.Ficha, ubicacion.No_Remision, 'Detencion', ubicacion);
                                            const { Coordenada_X, Coordenada_Y } = ubicacion;
                                            if (markerElement) {
                                                new mapboxgl.Marker({ element: markerElement })
                                                    .setLngLat(isValidCoordinate(Coordenada_X, Coordenada_Y) ? [Coordenada_X, Coordenada_Y] : [0, 0])
                                                    .setPopup(popup)
                                                    .addTo(mapInstanceRef.current);
                                            }
                                        });
                                    }
                                    if (ubicaciones.domicilio) {
                                        ubicaciones.domicilio.forEach(async (ubicacion: any) => {
                                            const { markerElement, popup } = await CreateCustomMarker(node.type, ubicacion.Ficha, ubicacion.No_Remision, 'Domicilio', ubicacion);
                                            const { Coordenada_X, Coordenada_Y } = ubicacion;
                                            if (markerElement) {
                                                new mapboxgl.Marker({ element: markerElement })
                                                    .setLngLat(isValidCoordinate(Coordenada_X, Coordenada_Y) ? [Coordenada_X, Coordenada_Y] : [0, 0])
                                                    .setPopup(popup)
                                                    .addTo(mapInstanceRef.current);
                                            }
                                        });
                                    }
                                    if (ubicaciones.hechos) {
                                        ubicaciones.hechos.forEach(async (ubicacion: any) => {
                                            const { markerElement, popup } = await CreateCustomMarker(node.type, ubicacion.Ficha, ubicacion.No_Remision, 'Hechos', ubicacion);
                                            const { Coordenada_X, Coordenada_Y } = ubicacion;
                                            if (markerElement) {
                                                new mapboxgl.Marker({ element: markerElement })
                                                    .setLngLat(isValidCoordinate(Coordenada_X, Coordenada_Y) ? [Coordenada_X, Coordenada_Y] : [0, 0])
                                                    .setPopup(popup)
                                                    .addTo(mapInstanceRef.current);
                                            }
                                        });
                                    }
                                } else {
                                    console.warn('ubicaciones is undefined or null');
                                }
                            } else {
                                console.warn('ubicaciones_remision.data is undefined or null');
                            }
                        });
                    }
                    break;

                default:
                    break;
            }
        }

        setIsFetching(false); // Marcar que las peticiones han terminado
    };

    return { getNodeLocations, putLocatiosnOnMap };
};