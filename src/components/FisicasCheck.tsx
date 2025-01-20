import React from 'react';

interface FisicasCheckProps {
    fisicas: boolean;
    setFisicas: (value: boolean) => void;
}

const FisicasCheck: React.FC<FisicasCheckProps> = ({ fisicas, setFisicas }) => {
    return (
        <div>
            <input
            type="checkbox"
            checked={fisicas}
            onChange={(e) => setFisicas(e.target.checked)}
            />
            <span style={{ color: 'white', fontWeight: 'bold' }}>Jerarquia</span>
        </div>
    );
};

export default FisicasCheck