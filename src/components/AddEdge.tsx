import React from 'react';
import { useNetwork } from '../context/NetwokrContext';

const AddEdge: React.FC = () => {
  const { network } = useNetwork();

  const enableAddEdgeMode = () => {
    if (network) {
      network.addEdgeMode();
    }
  };

  return (
    <button onClick={enableAddEdgeMode}>Add Edge</button>
  );
};

export default AddEdge;