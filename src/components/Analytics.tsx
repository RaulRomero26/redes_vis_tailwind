
import React from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { NetworkAnalisis } from './NetworkAnalisis';

interface AnalyticsProps {
    isOpenAnalytics: boolean;
    setIsOpenAnalytics: (isOpen: boolean) => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({isOpenAnalytics, setIsOpenAnalytics}) => {

    const onCloseModal = () => setIsOpenAnalytics(false);
return (
    <>    
        <Modal open={isOpenAnalytics} onClose={onCloseModal} center styles={{ modal: { maxWidth: '80%', width: '80%' } }}>
            <NetworkAnalisis onCloseModal={onCloseModal}/>
        </Modal>
    </>
    );
}