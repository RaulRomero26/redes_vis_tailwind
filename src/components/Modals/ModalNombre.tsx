import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNetwork } from "../../context/NetwokrContext";
import { toast } from "react-hot-toast";
import { createNodeData } from "../../helpers/createNodeData";

interface ModalNombreProps {
  isModalOpen: boolean;
  toggleModal: () => void;
}

interface FormInputs {
  nombre: string;
  apPaterno: string;
  apMaterno: string;
}

const ModalNombre: React.FC<ModalNombreProps> = ({
  isModalOpen,
  toggleModal,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();
  const { nodes } = useNetwork();

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const nodeId =
      `${data.nombre.trim()} ${data.apPaterno.trim()} ${data.apMaterno.trim()}`
        .trim()
        .toUpperCase();
    const nodeData = createNodeData(
      nodeId,
      nodeId,
      data.nombre,
      "image",
      15,
      {
        background:"rgba(255, 255, 255, 0.8)",
        border: "rgba(255, 255, 255, 0)",
        highlight: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" },
        hover: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" }
      },
      "entrada-persona",
      "persona",
      {},
      {
        Nombre: data.nombre,
        Ap_Paterno: data.apPaterno,
        Ap_Materno: data.apMaterno,
      },
      0,
      0
    );
    console.warn("NODE DATA:", nodeData);
    if (nodes.get(nodeId)) {
      toast.error(`Ya existe una entidad identificada ${nodeId}`);
    } else {
      nodes.add(nodeData);
      toast.success(`Entidad ${nodeId} añadida exitosamente`);
    }

    toggleModal();
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded w-1/4 overflow-auto">
        <h2 className="text-xl">Buscar Persona</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Nombre"
              {...register("nombre", { required: true })}
            />
            {errors.nombre && (
              <span className="text-red-500">Este campo es requerido</span>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="apPaterno" className="block text-gray-700">
              Apellido Paterno
            </label>
            <input
              type="text"
              id="apPaterno"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Apellido Paterno"
              {...register("apPaterno", { required: true })}
            />
            {errors.apPaterno && (
              <span className="text-red-500">Este campo es requerido</span>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="apMaterno" className="block text-gray-700">
              Apellido Materno
            </label>
            <input
              type="text"
              id="apMaterno"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Apellido Materno"
              {...register("apMaterno", { required: true })}
            />
            {errors.apMaterno && (
              <span className="text-red-500">Este campo es requerido</span>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Buscar
          </button>
        </form>
        <button
          onClick={toggleModal}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalNombre;
