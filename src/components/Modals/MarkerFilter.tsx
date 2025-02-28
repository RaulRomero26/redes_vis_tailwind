interface MarkerFilterProps {
    filters: {
        Hechos: boolean;
        Detencion: boolean;
        Domicilio: boolean;
        inspeccion: boolean;
    };
    setFilters: React.Dispatch<React.SetStateAction<{
        Hechos: boolean;
        Detencion: boolean;
        Domicilio: boolean;
        inspeccion: boolean;
    }>>;
}

export const MarkerFilter: React.FC<MarkerFilterProps> = ({ filters, setFilters }) => {  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setFilters({
            ...filters,
            [name]: checked,
        });
    };

    return (
        <div className="mb-2">
         
            <label className="mr-2">
                <input
                    type="checkbox"
                    name="Hechos"
                    checked={filters.Hechos}
                    onChange={handleChange}
                />
                Hechos
            </label>
            <label className="mr-2">
                <input
                    type="checkbox"
                    name="Detencion"
                    checked={filters.Detencion}
                    onChange={handleChange}
                />
                Detención
            </label>
            <label className="mr-2">
                <input
                    type="checkbox"
                    name="Domicilio"
                    checked={filters.Domicilio}
                    onChange={handleChange}
                />
                Domicilio
            </label>
            <label className="mr-2">
                <input
                    type="checkbox"
                    name="inspeccion"
                    checked={filters.inspeccion}
                    onChange={handleChange}
                />
                Inspecciones
            </label>
        </div>
    );
};
