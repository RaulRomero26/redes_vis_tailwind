import React, { useEffect, useRef, useState } from 'react';
import { Network as VisNetwork } from 'vis-network/standalone';
import { useNetwork } from '../context/NetwokrContext';
import { useGraphFunctions } from '../hooks/useGraphFunctions';
import { useSheets } from '../hooks/useSheets';
import { saveData, getData } from '../utils/indexedDB';

interface NetworkComponentProps {
  handleContextMenu: (params: any) => void;
}

const NetworkComponent: React.FC<NetworkComponentProps> = ({handleContextMenu}) => {
  const { network, nodes, edges, setNetwork, setClickedNode, setClickedEdge, fisicas,clickedNode } = useNetwork();
  const { addNode, addEdgeControl } = useGraphFunctions();
  const networkContainer = useRef<HTMLDivElement | null>(null);

  const {  selectedSheet } = useSheets();
 

  const [currentSheet, setCurrentSheet] = useState(selectedSheet);


  const options = {
    locale: 'es',
    interaction: {
      multiselect: true,
      hover: true,
      dragNodes: true,
      zoomSpeed: 1,
      zoomView: true,
      navigationButtons: true,
      keyboard: false,
    },
    manipulation: {
      enabled: false,
      initiallyActive: false,
      addNode: addNode,
      addEdge: addEdgeControl,
    },
    layout: {
      hierarchical: {
        enabled: true,
        direction: 'UD',
        sortMethod: 'hubsize',
        nodeSpacing: 400,
        levelSeparation: 250,
        shakeTowards: 'roots',
      },
    },
    edges: {
      smooth: {
        enabled: true,
        type: 'cubicBezier',
        roundness: 0.75,
      },
      arrows: {
        to: { enabled: true, scaleFactor: 1 },
      },
      font: {
        background: 'rgba(255, 255, 255, 1)',
        multi: 'html',
      },
      color: {
        color: '#000000', // Color de las aristas
        highlight: '#000000', // Color de las aristas cuando están resaltadas
        hover: '#000000', // Color de las aristas cuando se pasa el mouse sobre ellas
      },
    },
    nodes: {
      font: {
        background: 'rgba(255, 255, 255, 1)',
        multi: 'html',
      },
      shapeProperties: {
        useBorderWithImage: true,
      },
    },
    physics: {
      enabled: true,
      solver: 'hierarchicalRepulsion',
      hierarchicalRepulsion: {
        centralGravity: 0.0,
        springLength: 150,
        springConstant: 0,
        nodeDistance: 150,
        damping: 1,
        avoidOverlap: 1,
      },
      stabilization: {
        enabled: true,
        fit: false, // Ajusta la vista automáticamente
      },
    },
    autoResize: false,
    height: '100%',
    width: '100%',
  };

  const noPhisicOptions = {
    locale: 'es',
    interaction: {
      multiselect: true,
      hover: true,
      dragNodes: true,
      dragView: true,
      zoomSpeed: 1,
      zoomView: true,
      navigationButtons: true,
      keyboard: false,
    },
    manipulation: {
      enabled: false,
      initiallyActive: false,
      addNode: addNode,
      addEdge: addEdgeControl,
    },
    layout: {
      hierarchical: {
        enabled: false,
      },
    },
    edges: {
      smooth: {
        enabled: true,
        type: 'cubicBezier',
        roundness: 0.75,
      },
      arrows: {
        to: { enabled: true, scaleFactor: 1 },
      },
      font: {
        background: 'rgba(255, 255, 255, 1)',
        multi: 'html',
      },
    },
    nodes: {
      font: {
        size: 14,
        face: 'arial',
        background: 'rgba(255, 255, 255, 0)',
        strokeWidth: 0,
        multi: 'html',
      },
      // color: {
      //   border: 'rgba(255, 255, 255, 1)', // Borde blanco
      //   highlight: { background: "red", border: "rgba(255, 0, 0, 1)" },
      // },
      shapeProperties: {
        useBorderWithImage: true,
      },
      borderWidth: 3,
      borderWidthSelected: 5
    },
    physics: {
      enabled: false,
      stabilization: {
        enabled: true,
        fit: false, // Desactiva el ajuste automático de la vista
      },
    },
    autoResize: false,
    height: '100%',
    width: '100%',
  };

  useEffect(() => {
    if (networkContainer.current) {
      const network = new VisNetwork(networkContainer.current, { nodes, edges }, options);
      setNetwork(network);

      network.on('click', (params) => {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          setClickedNode(nodeId);
        } else {
          setClickedNode(null);
        }

        if (params.edges.length > 0) {
          const edgeId = params.edges[0];
          setClickedEdge(edgeId);
        } else {
          setClickedEdge(null);
        }
      });

      network.on('oncontext', (params) => {
        params.event.preventDefault();
        handleContextMenu(params);
      });

      return () => {
        network.off('click');
        network.off('oncontext');
      };
    }
  }, [networkContainer, nodes, edges, setNetwork, setClickedNode, setClickedEdge]);

  useEffect(() => {
    console.warn('NODOS:', nodes.get());
  }, [nodes]);

  useEffect(() => {
    console.log('EDGES:', edges.get());
  }, [edges]);

  useEffect(() => {
    if (network) {
      if (fisicas) {
        // network.storePositions();
        network.setOptions(options);
      } else {
        network.storePositions();
        network.setOptions(noPhisicOptions);
      }
      network.redraw();
    }
  }, [fisicas, network]);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      console.log('efecto paste')
      if (items) {
        console.log(items)
        for (const item of items) {
          console.log(item)
          if (item.kind === 'file' && item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const imageUrl = e.target?.result as string;
                console.log('node clickeado', clickedNode)
                if (clickedNode) {
                  // Si hay un nodo seleccionado, buscar el nodo por ID y asignar la imagen a ese nodo
                  const nodeToUpdate = nodes.get(clickedNode);
                  console.log('UPDATE POR CLCK', nodeToUpdate)
                  if (nodeToUpdate) {
                    nodeToUpdate.image = imageUrl;
                    nodes.update(nodeToUpdate);
                  }
                } else {
                  // Si no hay un nodo seleccionado, buscar el nodo por nombre
                  console.log(file.name.split('.')[0])
                  const nodeName = file.name.split('.')[0];
                    const allNodes = nodes.get();
                    const nodeToUpdate = allNodes.find((node: any) => node.id.toLowerCase() == nodeName.toLowerCase());
                  console.log('encontro?', nodeToUpdate)
                  if (nodeToUpdate) {
                    nodeToUpdate.image = imageUrl;
                    nodes.update(nodeToUpdate);
                  }
                }
              };
              reader.readAsDataURL(file);
            }
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [nodes, clickedNode]);


  // Guardar la red cuando cambie la hoja seleccionada
  useEffect(() => {
    console.warn('SELECCIONADA CAMBIANDO:', selectedSheet);
    if (network && currentSheet !== selectedSheet) {
      const handleStoreNetwork = async () => {
        await saveData(`nodes_sheet_${currentSheet}`, JSON.stringify(nodes.get()));
        await saveData(`edges_sheet_${currentSheet}`, JSON.stringify(edges.get()));
      };
      handleStoreNetwork();
      setCurrentSheet(selectedSheet);
    }
  }, [selectedSheet, currentSheet, network, nodes, edges]);

  // Cargar la red correspondiente a la hoja seleccionada
  useEffect(() => {
    if (network) {
      console.warn('SELECCIONADA:', selectedSheet);
      const loadNetwork = async () => {
        const storedNodes = await getData(`nodes_sheet_${selectedSheet}`);
        const storedEdges = await getData(`edges_sheet_${selectedSheet}`);
        if (storedNodes && storedEdges) {
          nodes.clear();
          edges.clear();
          nodes.add(JSON.parse(storedNodes));
          edges.add(JSON.parse(storedEdges));
        } else {
          nodes.clear();
          edges.clear();
        }
      };
      loadNetwork();
    }
  }, [selectedSheet, network, nodes, edges]);

  return <div ref={networkContainer} style={{ width: '100%', height: '92vh' }} />;
};

export default NetworkComponent;