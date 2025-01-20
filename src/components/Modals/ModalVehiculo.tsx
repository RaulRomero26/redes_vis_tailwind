import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNetwork } from "../../context/NetwokrContext";
import { toast } from "react-hot-toast";
import { createNodeData } from "../../helpers/createNodeData";

interface ModalVehiculoProps {
  isModalOpen: boolean;
  toggleModal: () => void;
}

interface FormInputs {
  placa: string;
  niv: string;
}

const ModalVehiculo: React.FC<ModalVehiculoProps> = ({
  isModalOpen,
  toggleModal,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    mode: "onBlur",
    reValidateMode: "onChange",
    criteriaMode: "all",
    shouldFocusError: true,
    defaultValues: {
      placa: "",
      niv: "",
    },
    resolver: async (values) => {
      const errors: any = {};
      if (!values.placa && !values.niv) {
        errors.placa = {
          type: "required",
          message: "Este campo es requerido si NIV está vacío",
        };
        errors.niv = {
          type: "required",
          message: "Este campo es requerido si Placa está vacío",
        };
      }
      return { values, errors };
    },
  });

  const { nodes } = useNetwork();

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const nodeId = `${data.placa.trim()}/${data.niv.trim()}`
      .trim()
      .toUpperCase();

    const nodeData = createNodeData(
      `${data.placa}/${data.niv}`,
      `${data.placa}/${data.niv}`,
      `${data.placa}/${data.niv}`,
      "image",
      15,
      {
        background:"rgba(255, 255, 255, 0.8)",
        border: "rgba(255, 255, 255, 0)",
        highlight: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" },
        hover: { border: "#7D2447", background: "rgba(255, 255, 255, 0)" }
      },
      "entrada-vehiculo",
      "vehiculo",
      {},
      {
        Placas: data.placa,
        NIV: data.niv,
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

  const placa = watch("placa");
  const niv = watch("niv");

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded w-1/4 overflow-auto">
        <h2 className="text-xl">Buscar Vehiculo</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="placa" className="block text-gray-700">
              Placa
            </label>
            <input
              type="text"
              id="placa"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="placa"
              {...register("placa", {
                validate: (value) =>
                  value || niv || "Este campo es requerido si NIV está vacío",
              })}
            />
            {errors.placa && (
              <span className="text-red-500">{errors.placa.message}</span>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="niv" className="block text-gray-700">
              NIV
            </label>
            <input
              type="text"
              id="niv"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="niv"
              {...register("niv", {
                validate: (value) =>
                  value ||
                  placa ||
                  "Este campo es requerido si Placa está vacío",
              })}
            />
            {errors.niv && (
              <span className="text-red-500">{errors.niv.message}</span>
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

export default ModalVehiculo;
