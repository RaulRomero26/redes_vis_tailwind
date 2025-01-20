import { useSheets } from "../hooks/useSheets";

export const SheetControls = () => {
    const { sheets, selectedSheet, addSheet, deleteSheet, selectSheet } = useSheets();

    return (
        <div style={{ position: 'absolute', top: `7vh`, right: `1vw`, zIndex: 1000 }}>
            <div className="flex justify-between items-center p-4">
                <div className="flex space-x-2">
                    {sheets.map((sheet: any) => (
                        <button
                            key={sheet.id}
                            onClick={() => selectSheet(sheet.id)}
                            className={`px-4 py-2 ${
                                selectedSheet === sheet.id
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200"
                            }`}
                        >
                            {sheet.id}
                        </button>
                    ))}
                    <button
                        onClick={addSheet}
                        className="px-4 py-2 bg-green-500 text-white"
                    >
                        Nueva Hoja
                    </button>
                </div>
                {sheets.length > 1 && (
                    <button
                        onClick={() => deleteSheet(selectedSheet)}
                        className="px-4 py-2 bg-red-500 text-white"
                    >
                        Eliminar Hoja
                    </button>
                )}
            </div>
        </div>
    );
};
