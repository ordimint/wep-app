import React, { useState } from 'react';
import SelectWallet from './AuctionSteps/SelectWallet';
import SelectOrdinal from './AuctionSteps/SelectOrdinal';
import CreateOffer from './AuctionSteps/CreateOffer';
import { Modal, Button } from 'react-bootstrap';

const steps = [
    { name: 'Connect Wallet', component: (props) => <SelectWallet {...props} /> },
    { name: 'Select your Ordinal', component: (props) => <SelectOrdinal {...props} /> },
    { name: 'Create offer', component: (props) => <CreateOffer {...props} /> },
];

function AuctionModal(props) {
    if (!props.show) {
        return null;
    }

    const [currentStep, setCurrentStep] = useState(0);
    const [selectedWallet, setSelectedWallet] = useState('Ordimint');
    const [currentUtxo, setCurrentUtxo] = useState(null)

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const CurrentComponent = steps[currentStep].component;

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{steps[currentStep].name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3>Coming soon!</h3>
                    {/* <CurrentComponent
                        selectedWallet={selectedWallet}
                        setSelectedWallet={setSelectedWallet}
                        setCurrentUtxo={setCurrentUtxo}
                    /> */}

                    <div className='back-next-button-modal m-3'>
                        {currentStep !== 0 && (
                            <Button onClick={handleBack}>Back</Button>
                        )}
                        {currentStep !== steps.length - 1 ? (
                            <Button onClick={handleNext}>Next</Button>
                        ) : (
                            <Button type="submit">Submit</Button>
                        )}
                    </div>

                </Modal.Body>
            </Modal>
        </>
    );
}

export default AuctionModal;