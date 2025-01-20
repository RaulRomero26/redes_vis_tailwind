import  ModalNombre from './ModalNombre';
import  ModalTelefono from './ModalTelefono';
import ModalVehiculo from './ModalVehiculo';

interface ModalSwitchProps {
  entidad: string;
  isModalOpen: boolean;
  toggleModal: (entidad?: string) => void;
}

export const ModalSwitch = ({ entidad, isModalOpen, toggleModal }: ModalSwitchProps) => {
  switch (entidad) {
    case 'persona':
      return <ModalNombre isModalOpen={isModalOpen} toggleModal={toggleModal} />;
    case 'telefono':
      return <ModalTelefono isModalOpen={isModalOpen} toggleModal={toggleModal} />;
    case 'vehiculo':
      return <ModalVehiculo isModalOpen={isModalOpen} toggleModal={toggleModal} />;
    default:
      return null;
  }
};

export default ModalSwitch;