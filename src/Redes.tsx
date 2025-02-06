// src/Redes.tsx
import NetworkComponent from "./components/NetworkComponent";
import { useState } from 'react';
import ModalSwitch from './components/Modals/ModalSwitch';
import { Toaster } from 'react-hot-toast';
import { useNetwork } from './context/NetwokrContext';
import useContextMenu from './hooks/useContextMenu';
import ContextMenu from './components/ContextMenu';
import ModalFichas from './components/Modals/ModalFichas';
import ModalContactos from './components/Modals/ModalContactos';
import ModalEdit from './components/Modals/ModalEdit';
import SearchNode from './components/SearchNode';
import { Analytics } from './components/Analytics';
import { NavigationBar } from './ui/NavigationBar';
import { ModalWeight } from "./components/Modals/ModalWeight";
import { Symbols } from "./components/Symbols";
import { SheetControls } from "./components/SheetControls";
import { NetworkOptionsPanel } from "./components/NetworkOptionsPanel";

export const Redes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_entidad, setEntidad] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOpenAnalytics, setIsOpenAnalytics] = useState(false);
  const [isOpenWeight, setIsOpenWeight] = useState(false);
  localStorage.setItem('hojaActiva', '1');

  const { contextMenu, handleContextMenu, closeContextMenu, handleSearchExtended,
    isModalFichasOpen, setIsModalFichasOpen, isModalContactosOpen, setIsModalContactosOpen,
  } = useContextMenu();

  const { network, clickedNode, clickedEdge } = useNetwork();

  const handleMenuClick = (entidad: string) => {
    toggleModal(entidad);
  };

  const toggleModal = (entidad?: string) => {
    setIsModalOpen(!isModalOpen);
    if (entidad) {
      setEntidad(entidad);
    }
  };

  const handleEditAttributes = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div onContextMenu={(e) => e.preventDefault()}>
        <NavigationBar handleMenuClick={handleMenuClick} isOpenAnalytics={isOpenAnalytics} setIsOpenAnalytics={setIsOpenAnalytics} setIsOpenWeight={setIsOpenWeight}/>
        <SearchNode />
        <SheetControls />
        <Symbols />
        <NetworkOptionsPanel />
        <NetworkComponent handleContextMenu={handleContextMenu} />
        {(contextMenu.edgeId || contextMenu.nodeId) && (
          <>
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              nodeId={contextMenu.nodeId}
              edgeId={contextMenu.edgeId}
              onSearchExtended={handleSearchExtended}
              onEditAttributes={handleEditAttributes}
              onClose={() => {
                closeContextMenu();
                network?.setOptions({ interaction: { zoomView: true } });
              }}
            />
            {network?.setOptions({ interaction: { zoomView: false } }) ? null : null}
          </>
        )}
        {isModalFichasOpen && (
          <ModalFichas
            nodeId={clickedNode}
            isOpen={isModalFichasOpen}
            onClose={() => setIsModalFichasOpen(false)}
          />
        )}

        {isModalContactosOpen && (
          <ModalContactos
            nodeId={clickedNode}
            isOpen={isModalContactosOpen}
            onClose={() => setIsModalContactosOpen(false)}
          />
        )}
        <ModalSwitch entidad={_entidad} isModalOpen={isModalOpen} toggleModal={toggleModal} />
        <ModalEdit
          isOpen={isEditModalOpen}
          onRequestClose={closeEditModal}
          clickedNode={clickedNode}
          clickedEdge={clickedEdge}
        />
        <Analytics isOpenAnalytics={isOpenAnalytics} setIsOpenAnalytics={setIsOpenAnalytics}/>
        <ModalWeight isOpenWeight={isOpenWeight} onCloseModalWeight={() => setIsOpenWeight(false)} />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontSize: '20px',
              padding: '22px',
              background: '#333',
              color: '#fff',
            }
          }}
        />
      </div>
    </>
  );
};