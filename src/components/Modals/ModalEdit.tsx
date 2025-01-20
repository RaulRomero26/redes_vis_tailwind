import React from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { EditNodeForm } from '../EditNodeForm';

interface ModalEditProps {
  isOpen: boolean;
  onRequestClose: () => void;
  clickedNode: string | null;
  clickedEdge: string | null;
}

const ModalEdit: React.FC<ModalEditProps> = ({ isOpen, onRequestClose, clickedNode, clickedEdge }) => {

  return (
    <Modal open={isOpen} onClose={onRequestClose} center>
      {clickedNode || clickedEdge ? (
        <EditNodeForm
          nodeId={clickedNode}
          edgeId={clickedEdge}
          onRequestClose={onRequestClose}
        />
      ) : (
        <p>No data to edit</p>
      )}
    </Modal>
  );
};

export default ModalEdit;