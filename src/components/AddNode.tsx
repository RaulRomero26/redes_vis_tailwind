import React from 'react';
import { useNetwork } from '../context/NetwokrContext';

const AddNode: React.FC = () => {
  const { nodes } = useNetwork();

  const addNode = () => {
    const newNode = { id: nodes.length + 1, label: `Node ${nodes.length + 1}` };
    nodes.add(newNode);
  };

  return (
    <button onClick={addNode}>Add Node</button>
  );
};

export default AddNode;