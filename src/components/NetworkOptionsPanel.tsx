import React, { useState, useEffect } from "react";
import { useNetwork } from '../context/NetwokrContext';

export const NetworkOptionsPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { network, nodes } = useNetwork();
  const [hojaActiva, setHojaActiva] = useState(localStorage.getItem('hojaActiva') || '1');
  
  const [isHierarchical, setIsHierarchical] = useState(() => {
    const storedOptions = JSON.parse(localStorage.getItem(`opciones_${hojaActiva}`) || '{}');
    return storedOptions.layout?.hierarchical?.enabled || false;
  });

  const [options, setOptions] = useState({
    edges: {
      smooth: {
        enabled: true,
        type: "cubicBezier",
        forceDirection: "none",
        roundness: 1,
      },
    },
    physics: {
      enabled: true,
      repulsion: {
        centralGravity: 0.1,
        springLength: 200,
        springConstant: 0.05,
        nodeDistance: 410,
        damping: 0.09,
      },
      maxVelocity: 50,
      minVelocity: 0.75,
      solver: "repulsion",
      timestep: 0.5,
    },
  });

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChange = (path: string, value: any) => {
    const keys = path.split(".");
    setOptions((prev) => {
      const updated = { ...prev };
      let ref: any = updated;
      keys.forEach((key, idx) => {
        if (idx === keys.length - 1) {
          ref[key] = value;
        } else {
          ref = ref[key];
        }
      });
      return updated;
    });
  };

  const handleHierarchicalChange = (checked: boolean) => {
    setIsHierarchical(checked);
  
    if (checked) {
      // Guardar posiciones cuando la red haya estabilizado su layout jerárquico
      network?.once("stabilized", () => {
        localStorage.setItem("storedPositionsH", JSON.stringify(network?.getPositions()));
      });
      
      // Activar layout jerárquico
      setOptions((prev) => ({
        ...prev,
        layout: {
          hierarchical: {
            enabled: true,
            direction: "UD",
            sortMethod: "hubsize",
            nodeSpacing: 400,
            levelSeparation: 250,
            shakeTowards: "roots",
          },
        },
        physics: {
          enabled: false, // Asegura que la física esté desactivada
          repulsion: {
            centralGravity: 0, // Evita error al estar siempre definido
            springLength: 200,
            springConstant: 0.05,
            nodeDistance: 410,
            damping: 0.09,
          },
          maxVelocity: 50,
          minVelocity: 0.75,
          solver: "repulsion",
          timestep: 0.5,
        },
      }));
    } else {
      // Desactivar layout jerárquico y mantener las posiciones
      setOptions((prev) => ({
        ...prev,
        layout: {
          hierarchical: {
            enabled: false,
          },
        },
        physics: {
          enabled: true, // Asegura que la física esté desactivada
          repulsion: {
            centralGravity: 0, // Evita error al estar siempre definido
            springLength: 200,
            springConstant: 0.05,
            nodeDistance: 410,
            damping: 0.09,
          },
          maxVelocity: 50,
          minVelocity: 0.75,
          solver: "repulsion",
          timestep: 0.5,
        },
      }));
      
      // Recuperar y aplicar posiciones almacenadas
      const storedPositions: { [key: string]: { x: number, y: number } } = JSON.parse(localStorage.getItem("storedPositionsH") || "{}");
      if (Object.keys(storedPositions).length > 0) {
        const updatedNodes = Object.keys(storedPositions).map((nodeId) => ({
          id: nodeId,
          x: storedPositions[nodeId].x,
          y: storedPositions[nodeId].y,
          fixed: { x: false, y: false } // Fijar posiciones para evitar movimientos
        }));
        nodes.update(updatedNodes);
  
        // Asegurarse de que la red actualice la vista con las nuevas posiciones
        network?.setData({
          nodes: (network as any)?.body?.data?.nodes,
          edges: (network as any)?.body?.data?.edges,
        });
      }
    }
  };
  

  useEffect(() => {
    if (network) {
      network.setOptions(options);
    }
  }, [options, network]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newHojaActiva = localStorage.getItem('hojaActiva') || '1';
      if (newHojaActiva !== hojaActiva) {
        console.warn('efecto del form localstorage', newHojaActiva);
        setHojaActiva(newHojaActiva);
      }
    }, 300); // Verifica cada segundo

    return () => clearInterval(interval);
  }, [hojaActiva]);

  useEffect(() => {
    localStorage.setItem(`opciones_${hojaActiva}`, JSON.stringify(options));
  }, [options, hojaActiva]);

  useEffect(() => {
    const storedOptions = localStorage.getItem(`opciones_${hojaActiva}`);
    if (storedOptions) {
      setOptions(JSON.parse(storedOptions));
    }
  }, [hojaActiva]);

  useEffect(() => {
    const storedOptions = JSON.parse(localStorage.getItem(`opciones_${hojaActiva}`) || '{}');
    setIsHierarchical(storedOptions.layout?.hierarchical?.enabled || false);
  }, [hojaActiva]);

  return (
    <div className="p-4 ">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        onClick={toggleVisibility}
        style={{ position: 'fixed', bottom: '70px', right: '10px', zIndex: 9999 }}
      >
        {isVisible ? "Ocultar Panel" : "Diseñar Red"}
      </button>
      {isVisible && (
        <div className="mt-4 bg-white shadow-md rounded-lg p-6 max-w-xs" style={{ position: 'fixed', bottom: '120px', right: '10px', zIndex: 9998, maxHeight: '600px', overflowY: 'scroll' }}>
          {/* Edges Section */}
          <div className="mb-6">
            <h1 className="text-lg font-bold mb-4">Hoja: {hojaActiva}</h1>
            <h2 className="text-lg font-bold mb-4">Aristas:</h2>

            <div className="mb-4">
              <input
                type="checkbox"
                checked={isHierarchical}
                onChange={(e) => handleHierarchicalChange(e.target.checked)}
                className="w-4 h-4"
              />
              <label className="ml-2 text-sm">Jerarquia Automática: </label>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={options.edges.smooth.enabled}
                onChange={(e) =>
                  handleChange("edges.smooth.enabled", e.target.checked)
                }
                className="w-4 h-4"
              />
              <label className="ml-2 text-sm">Suavizado</label>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Tipo</label>
              <select
                value={options.edges.smooth.type}
                onChange={(e) => handleChange("edges.smooth.type", e.target.value)}
                className="mt-1 block w-full border rounded-md p-2"
              >
                <option value="cubicBezier">cubicBezier</option>
                <option value="dynamic">dynamic</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Fuerza en Dirección</label>
              <select
                value={options.edges.smooth.forceDirection}
                onChange={(e) =>
                  handleChange("edges.smooth.forceDirection", e.target.value)
                }
                className="mt-1 block w-full border rounded-md p-2"
              >
                <option value="none">none</option>
                <option value="horizontal">horizontal</option>
                <option value="vertical">vertical</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Curvatura</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={options.edges.smooth.roundness}
                onChange={(e) =>
                  handleChange("edges.smooth.roundness", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>
          </div>

          {/* Physics Section */}
          <div>
            <h2 className="text-lg font-bold mb-4">Físicas</h2>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={options.physics.enabled}
                onChange={(e) =>
                  handleChange("physics.enabled", e.target.checked)
                }
                className="w-4 h-4"
              />
              <label className="ml-2 text-sm">Físicas Habilitadas</label>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Gravedad Central</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={options.physics.repulsion.centralGravity}
                onChange={(e) =>
                  handleChange(
                    "physics.repulsion.centralGravity",
                    parseFloat(e.target.value)
                  )
                }
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Distancia de Arista</label>
              <input
                type="range"
                min={0}
                max={500}
                step={1}
                value={options.physics.repulsion.springLength}
                onChange={(e) =>
                  handleChange(
                    "physics.repulsion.springLength",
                    parseInt(e.target.value, 10)
                  )
                }
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Arista Constante</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={options.physics.repulsion.springConstant}
                onChange={(e) =>
                  handleChange(
                    "physics.repulsion.springConstant",
                    parseFloat(e.target.value)
                  )
                }
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Distancia entre Nodos</label>
              <input
                type="range"
                min={0}
                max={1000}
                step={10}
                value={options.physics.repulsion.nodeDistance}
                onChange={(e) =>
                  handleChange(
                    "physics.repulsion.nodeDistance",
                    parseInt(e.target.value, 10)
                  )
                }
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Rebote</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={options.physics.repulsion.damping}
                onChange={(e) =>
                  handleChange(
                    "physics.repulsion.damping",
                    parseFloat(e.target.value)
                  )
                }
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Timestep</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={options.physics.timestep}
                onChange={(e) =>
                  handleChange("physics.timestep", parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Modelo de Físicas</label>
              <select
                value={options.physics.solver}
                onChange={(e) => handleChange("physics.solver", e.target.value)}
                className="mt-1 block w-full border rounded-md p-2"
              >
                <option value="repulsion">repulsion</option>
                <option value="barnesHut">barnesHut</option>
                <option value="forceAtlas2Based">forceAtlas2Based</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkOptionsPanel;