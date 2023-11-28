import React from 'react'
import { Row, Col } from 'react-bootstrap';
import OrdinalCard from '../OrdinalCard';

const OrdinalGrid = ({ ordinals }) => {
    return (
        <Row className='ordinal-grid-row'>
            {
                Array.isArray(ordinals) && ordinals.map((inscriptionId, index) => {
                    return (
                        <Col xs={4} sm={3} md={2} lg={2} xl={2} xxl={1} key={index} className='ordinal-grid-col'>
                            <OrdinalCard ordinalId={inscriptionId} />
                        </Col>
                    );
                })
            }
        </Row>
    );
}

export default OrdinalGrid