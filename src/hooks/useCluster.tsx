
import { useNetwork } from '../context/NetwokrContext';

export const useCluster = () => {
  const { network, clickedNode } = useNetwork();

const onClusterNoPersonas = () => {
    if (network) {
        const clusterOptionsByData = {
            joinCondition: (nodeOptions: any) => {
                return !['persona', 'contacto', 'entrada-persona'].includes(nodeOptions.type);
            },
            clusterNodeProperties: {
                id: 'cluster:no-personas',
                borderWidth: 3,
                shape: 'database',
                label: 'Sin Personas',
            },
        };
        network.cluster(clusterOptionsByData);
    }
};

const onClusterNoInspecciones = () => {
    if (network) {
        const clusterOptionsByData = {
            joinCondition: (nodeOptions: any) => {
                return !['inspeccion'].includes(nodeOptions.type);
            },
            clusterNodeProperties: {
                id: 'cluster:no-inspecciones',
                borderWidth: 3,
                shape: 'database',
                label: 'Sin Inspecciones',
            },
        };
        network.cluster(clusterOptionsByData);
    }
};

const onClusterNoVehiculos = () => {
    if (network) {
        const clusterOptionsByData = {
            joinCondition: (nodeOptions: any) => {
                return !['vehiculo','entrada-vehiculo'].includes(nodeOptions.type);
            },
            clusterNodeProperties: {
                id: 'cluster:no-vehiculos',
                borderWidth: 3,
                shape: 'database',
                label: 'Sin Vehiculos',
            },
        };
        network.cluster(clusterOptionsByData);
    }
};

const onClusterNoTelefonos = () => {
    if (network) {
        const clusterOptionsByData = {
            joinCondition: (nodeOptions: any) => {
                return !['telefono','entrada-telefono'].includes(nodeOptions.type);
            },
            clusterNodeProperties: {
                id: 'cluster:no-telefonos',
                borderWidth: 3,
                shape: 'database',
                label: 'Sin Telefonos',
            },
        };
        network.cluster(clusterOptionsByData);
    }
};

const clusterByMaxOrEqual = (max: number) => {
    if(network){
        const clusterOptionsByData = {
            joinCondition: (nodeOptions: any) => {
                return nodeOptions.atributos?.weight >= max;
            },
            clusterNodeProperties: {
                id: `cluster:max-${max}`,
                borderWidth: 3,
                shape: 'database',
                label: `Superiores a: ${max}`,
            },
        };
        network.cluster(clusterOptionsByData);
    }
};

const clusterByMinOrEqual = (min: number) => {
    if(network){
        const clusterOptionsByData = {
            joinCondition: (nodeOptions: any) => {
                return nodeOptions.atributos?.weight <= min;
            },
            clusterNodeProperties: {
                id: `cluster:min-${min}`,
                borderWidth: 3,
                shape: 'database',
                label: `Menores a: ${min}`,
            },
        };
        network.cluster(clusterOptionsByData);
    }
};

const clusterByEqual = (value: number) => {
    if(network){
        const clusterOptionsByData = {
            joinCondition: (nodeOptions: any) => {
                return nodeOptions.atributos?.weight != value;
            },
            clusterNodeProperties: {
                id: `cluster-equal-${value}`,
                borderWidth: 3,
                shape: 'database',
                label: `Diferente a: ${value}`,
            },
        };
        network.cluster(clusterOptionsByData);
    }
};

const onOpenClusters = () => {
    if (clickedNode && network?.isCluster(clickedNode)) {
    const openClusterObj = {
        releaseFunction: (clusterPosition: any, containedNodesPositions: any) => {
            console.log('clusterPosition', clusterPosition);
            return containedNodesPositions;
        }
    };

    network.openCluster(clickedNode, openClusterObj);
    }
};

  return { 
    onClusterNoPersonas,
    onClusterNoInspecciones,
    onClusterNoVehiculos,
    onClusterNoTelefonos,
    onOpenClusters,
    clusterByMaxOrEqual,
    clusterByMinOrEqual,
    clusterByEqual
  };
};