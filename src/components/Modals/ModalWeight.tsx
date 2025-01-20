
import { useState } from 'react';
import Modal from 'react-responsive-modal'
import { useCluster } from '../../hooks/useCluster';

interface ModalWeightProps {
    isOpenWeight: boolean;
    onCloseModalWeight: () => void;
}

export const ModalWeight:React.FC<ModalWeightProps> = ({isOpenWeight,onCloseModalWeight}) => {

    const [weight, setWeight] = useState<number | ''>('');

    const { clusterByMaxOrEqual, clusterByMinOrEqual, clusterByEqual} = useCluster();

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            if (value === '' || /^\d+$/.test(value)) {
                setWeight(value === '' ? '' : parseInt(value, 10));
            }
        };

  return (
    <> 
        <Modal open={isOpenWeight} onClose={onCloseModalWeight}>
        <div className="p-4">
            <form className="space-y-4">
                <div className="flex flex-col">
                    <label htmlFor="weight" className="mb-2 text-lg font-medium text-gray-700">Valor:</label>
                    <input
                        type="text"
                        id="weight"
                        value={weight}
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex justify-between space-x-2">
                    <button 
                        type="button" 
                        onClick={() => {if (typeof weight === 'number') { clusterByMinOrEqual(weight); } onCloseModalWeight();}}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Peso menor que
                    </button>
                    <button 
                        type="button" 
                        onClick={() => { if (typeof weight === 'number') { clusterByEqual(weight); } onCloseModalWeight(); }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Peso igual a
                    </button>
                    <button 
                        type="button" 
                        onClick={() => { if (typeof weight === 'number') { clusterByMaxOrEqual(weight); } onCloseModalWeight(); }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Peso mayor que
                    </button>
                </div>
            </form>
        </div>
        </Modal>
    </>
  );
};
