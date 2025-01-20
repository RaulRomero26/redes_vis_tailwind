import { useState } from 'react';
import { toast } from 'react-hot-toast';

export const useSearchEntity = () => {
  const [data, setData] = useState(null);

  type Payload = { [key: string]: any };

  const searchData = async ({ entidad, payload }: { entidad: string; payload: Payload }) => {
    console.log('Buscando Remisiones', entidad, payload);
  
    try {
      const response = await toast.promise(
        fetch('http://172.18.110.90:8087/api/search/remisiones', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }),
        {
          loading: 'Buscando información...',
          success: 'Datos encontrados exitosamente.',
          error: 'Error al buscar la información.',
        }
      );
  
      const data = await response.json();
      setData(data.data.remisiones);
  
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ocurrió un error inesperado.');
    }
  };
  
  const searchPhone = async ({ entidad, payload }: { entidad: string; payload: Payload }) => {
    console.log('Buscando Teléfono', entidad, payload);
  
    try {
      const response = await toast.promise(
        fetch('http://172.18.110.90:8087/api/search/telefono-contacto', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }),
        {
          loading: 'Buscando información del teléfono...',
          success: 'Teléfono encontrado con éxito.',
          error: 'Error al buscar el teléfono.',
        }
      );
  
      const data = await response.json();
      setData(data.data.telefono);
  
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ocurrió un error inesperado al buscar el teléfono.');
    }
  };

  const searchContacts = async ({ entidad, payload }: { entidad: string; payload: Payload }) => {
    console.log('Buscando Contactos', entidad, payload);
  
    try {
      const response = await toast.promise(
        fetch('http://172.18.110.90:8087/api/search/contactos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }),
        {
          loading: 'Buscando información de contactos...',
          success: 'Contactos encontrados con éxito.',
          error: 'Error al buscar los contactos.',
        }
      );
  
      const data = await response.json();
      setData(data.data.remisiones);
  
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ocurrió un error inesperado al buscar los contactos.');
    }
  };


  const searchHistorico = async ({ entidad, payload }: { entidad: string; payload: Payload }) => {
    console.log('Buscando Historico', entidad, payload);
  
    try {
      const response = await toast.promise(
        fetch('http://172.18.110.90:8087/api/search/historico', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }),
        {
          loading: 'Buscando información histórica...',
          success: 'Histórico encontrado con éxito.',
          error: 'Error al buscar el histórico.',
        }
      );
  
      const data = await response.json();
      setData(data.data.historico);
  
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ocurrió un error inesperado al buscar el histórico.');
    }
  };

const searchInspeccion = async ({ entidad, payload }: { entidad: string; payload: Payload }) => {
  console.log('Buscando Inspeccion', entidad, payload);

  try {
    const response = await toast.promise(
      fetch('http://172.18.110.90:8087/api/search/inspeccion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }),
      {
        loading: 'Buscando información de inspección...',
        success: 'Inspección encontrada con éxito.',
        error: 'Error al buscar la inspección.',
      }
    );

    const data = await response.json();
    setData(data.data.inspeccion);

    return data;
  } catch (error) {
    console.error('Error:', error);
    toast.error('Ocurrió un error inesperado al buscar la inspección.');
  }
};

const searchDetenidoCon = async ({ entidad, payload }: { entidad: string; payload: Payload }) => {
  console.log('Buscando Detenido Con', entidad, payload);

  try {
    const response = await toast.promise(
      fetch('http://172.18.110.90:8087/api/search/detenidoCon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }),
      {
        loading: 'Buscando información de detenido con...',
        success: 'Información de detenido con encontrada con éxito.',
        error: 'Error al buscar la información de detenido con.',
      }
    );

    const data = await response.json();
    setData(data.data.detenidoCon);

    return data;
  } catch (error) {
    console.error('Error:', error);
    toast.error('Ocurrió un error inesperado al buscar la información de detenido con.');
  }
};

const searchVehiculoInspeccion = async ({ entidad, payload }: { entidad: string; payload: Payload }) => {
  console.log('Buscando Vehiculo Inspeccion', entidad, payload);

  try {
    const response = await toast.promise(
      fetch('http://172.18.110.90:8087/api/search/vehiculoInspeccion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }),
      {
        loading: 'Buscando información del vehículo de inspección...',
        success: 'Vehículo de inspección encontrado con éxito.',
        error: 'Error al buscar la información del vehículo de inspección.',
      }
    );

    const data = await response.json();
    setData(data.data.vehiculos);

    return data;
  } catch (error) {
    console.error('Error:', error);
    toast.error('Ocurrió un error inesperado al buscar la información del vehículo de inspección.');
  }
};

const searchRemisionesTelefono = async ({ entidad, payload }: { entidad: string; payload: Payload }) => {
  console.log('Buscando Remisiones Telefono', entidad, payload);

  try {
    const response = await toast.promise(
      fetch('http://172.18.110.90:8087/api/search/remisionesTelefono', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }),
      {
        loading: 'Buscando remisiones por teléfono...',
        success: 'Remisiones por teléfono encontradas con éxito.',
        error: 'Error al buscar remisiones por teléfono.',
      }
    );

    const data = await response.json();
    setData(data.data.remisiones);

    return data;
  } catch (error) {
    console.error('Error:', error);
    toast.error('Ocurrió un error inesperado al buscar las remisiones por teléfono.');
  }
};

const buscarContactosPorTelefono = async ({ entidad, payload }: { entidad: string; payload: Payload }) => {
  console.log('Buscando Contactos Telefono', entidad, payload);

  try {
    const response = await toast.promise(
      fetch('http://172.18.110.90:8087/api/search/contactosTelefono', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }),
      {
        loading: 'Buscando contactos por teléfono...',
        success: 'Contactos por teléfono encontrados con éxito.',
        error: 'Error al buscar contactos por teléfono.',
      }
    );

    const data = await response.json();
    setData(data.data.contactos);

    return data;
  } catch (error) {
    console.error('Error:', error);
    toast.error('Ocurrió un error inesperado al buscar los contactos por teléfono.');
  }
};

const searchVehiculoRemision = async ({ entidad, payload }: { entidad: string; payload: Payload }) => {
  console.log('Buscando Vehiculo Remision', entidad, payload);

  try {
    const response = await toast.promise(
      fetch('http://172.18.110.90:8087/api/search/vehiculoRemision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }),
      {
        loading: 'Buscando vehículo de remisión...',
        success: 'Vehículo de remisión encontrado con éxito.',
        error: 'Error al buscar vehículo de remisión.',
      }
    );

    const data = await response.json();
    setData(data.data.vehiculos);

    return data;
  } catch (error) {
    console.error('Error:', error);
    toast.error('Ocurrió un error inesperado al buscar el vehículo de remisión.');
  }
};

const buscarLlamadas911 = async ({ entidad, payload }: { entidad: string; payload: Payload }) => {
  console.log('Buscando Llamadas 911', entidad, payload);

  try {
    const response = await toast.promise(
      fetch('http://172.18.110.90:8087/api/search/llamadas911', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }),
      {
        loading: 'Buscando llamadas 911...',
        success: 'Llamadas 911 encontradas con éxito.',
        error: 'Error al buscar llamadas 911.',
      }
    );

    const data = await response.json();
    setData(data.data.llamadas);

    return data;
  } catch (error) {
    console.error('Error:', error);
    toast.error('Ocurrió un error inesperado al buscar las llamadas 911.');
  }
};

const searchPersonaInspeccion = async ({ entidad, payload }: { entidad: string; payload: Payload }) => {
  console.log('Buscando Persona Inspeccion', entidad, payload);

  try {
    const response = await toast.promise(
      fetch('http://172.18.110.90:8087/api/search/inspeccion-persona', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }),
      {
        loading: 'Buscando persona de inspección...',
        success: 'Persona de inspección encontrada con éxito.',
        error: 'Error al buscar persona de inspección.',
      }
    );

    const data = await response.json();
    setData(data.data.personas);

    return data;
  } catch (error) {
    console.error('Error:', error);
    toast.error('Ocurrió un error inesperado al buscar la persona de inspección.');
  }
};

const searchInspeccionVehiculo = async ({ entidad, payload }: { entidad: string; payload: Payload }) => {
  console.log('Buscando Inspeccion Vehiculo', entidad, payload);

  try {
    const response = await toast.promise(
      fetch('http://172.18.110.90:8087/api/search/inspeccion-vehiculo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }),
      {
        loading: 'Buscando inspección de vehículo...',
        success: 'Inspección de vehículo encontrada con éxito.',
        error: 'Error al buscar la inspección del vehículo.',
      }
    );

    const data = await response.json();
    setData(data.data.vehiculos);

    return data;
  } catch (error) {
    console.error('Error:', error);
    toast.error('Ocurrió un error inesperado al buscar la inspección del vehículo.');
  }
};

  return {
    searchData,
    searchPhone,
    searchContacts,
    searchHistorico,
    searchInspeccion,
    searchDetenidoCon,
    searchVehiculoInspeccion,
    searchRemisionesTelefono,
    searchVehiculoRemision,
    buscarContactosPorTelefono,
    buscarLlamadas911,
    searchPersonaInspeccion,
    searchInspeccionVehiculo,
    data,
  };
};