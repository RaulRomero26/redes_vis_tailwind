import { useState, useEffect, useRef } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useNodeLocations } from '../hooks/useNodeLocations';
import { MarkerFilter } from './Modals/MarkerFilter';
import html2canvas from 'html2canvas';

// Configura el token de Mapbox
mapboxgl.accessToken = "pk.eyJ1Ijoic3NjZGlwYyIsImEiOiJjbHllcmM0dG8wNW9oMmtvaHhubWxsa3VyIn0.IwPkHtYfl3X9IOsF5U4VFA";

export const Map = () => {
    const [visible, setVisible] = useState(false);
    const [_currentSelectedNodes, _setCurrentSelectedNodes] = useState<any[]>([]);
    const [expanded, setExpanded] = useState(false);
    const mapContainerRef = useRef<HTMLDivElement | null>(null); // Contenedor del mapa
    const mapInstanceRef = useRef<mapboxgl.Map | null>(null); // Instancia del mapa
    const [filters, setFilters] = useState({
        Hechos: true,
        Detencion: true,
        Domicilio: true,
        inspeccion: true,
    });

    // Hook que maneja los nodos y ubicaciones
    const { getNodeLocations, putLocatiosnOnMap } = useNodeLocations(mapInstanceRef, filters) ;

    const handleExpand = () => {
        setExpanded(!expanded);
        setTimeout(() => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.resize();
            }
        }, 100); 
    };

    const handleExport = () => {
        const mapElement = document.getElementById('map');
        if (mapElement) {
            html2canvas(mapElement, {
                useCORS: true,
                allowTaint: true
            })
            .then(function(canvas) {
                var img = canvas.toDataURL('image/png');
                var link = document.createElement('a');
                link.href = img;
                link.download = "map.png";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }
    };

    useEffect(() => {
        if (visible && mapContainerRef.current && !mapInstanceRef.current) {
            // Inicializa el mapa SOLO si no ha sido creado antes
            mapInstanceRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: "mapbox://styles/mapbox/streets-v11",
                center: [-98.20346, 19.03793], // Coordenadas iniciales
                zoom: 12,
                preserveDrawingBuffer: true,
            });

            mapInstanceRef.current.on("load", () => {
                console.log("Mapa cargado correctamente");

                // Obtener y colocar nodos en el mapa
                const selectedNodes = getNodeLocations();
                putLocatiosnOnMap(selectedNodes);
            });
        }

        // Limpieza al desmontar
        return () => {
            if (!visible && mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [visible]);

    useEffect(() => {
        if (mapInstanceRef.current) {
            const markers = document.getElementsByClassName('mapboxgl-marker');
            Array.from(markers).forEach(marker => {
                const nodeType = marker.getAttribute('data-tipo');
                if (nodeType && filters[nodeType as keyof typeof filters]) {
                    (marker as HTMLElement).style.display = 'block';
                } else {
                    (marker as HTMLElement).style.display = 'none';
                }
            });
        }
    }, [filters]);

    return (
        <>
            <button 
            onClick={() => setVisible(!visible)} 
            className="fixed bg-white p-2 rounded-full shadow-lg" 
            style={{ bottom: `70vh`, right: `96vw`, zIndex: 9999 }}
            >
            <FaMapMarkedAlt className="w-8 h-8" />
            </button>
            
            {visible && (
            <div 
                className="fixed bg-white p-4 rounded-lg shadow-lg z-10" 
                style={{ bottom: `7vh`, right: `1vw`, width: `${expanded ? '97vw': '50vw'}`, height: `80vh`, maxWidth: '100%', maxHeight: '100%', overflow: 'hidden' }}
                id="map-panel"
            >
                <MarkerFilter filters={filters} setFilters={setFilters} handleExpand={handleExpand}/>
                <button onClick={handleExport} className="bg-blue-500 text-white p-2 rounded-lg mt-2">
                Exportar Mapa como Imagen
                </button>
                <div id="map" ref={mapContainerRef} style={{ position: 'relative', height: 'inherit', width: 'inherit'}} />
            </div>
            )}
        </>
    );
};
