import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { VehiculeSociete } from '../models/vehicule-societe';
import { Categorie } from './../models/categorie-vehicule';
import { Link } from 'react-router-dom';

const VehiculeElement = (props: { vehicule: VehiculeSociete, categorie: Categorie | undefined }) => {
  return (
    <Container style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', margin: '10px', width: '200px', boxShadow: '0px 0px 5px 3px #d6d6d6' }}>
        <Link to={`/admin/vehicules/${props.vehicule.id}`} style={{ textDecoration: 'none', color: "black" }}>
            <div style={{ height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={props.vehicule.photo} alt="Vehicule" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
            </div>
            <Row style={{ textAlign: 'center', marginTop: '10px' }}>
                <Col xs={12}>{props.vehicule.immatriculation}</Col>
            </Row>
            <Row style={{ textAlign: 'center', fontSize: '14px', marginTop: '5px' }}>
                <Col xs={12}>{props.vehicule.marque}</Col>
                <Col xs={12}>{props.vehicule.modele}</Col>
            </Row>
            <Row style={{ textAlign: 'center', fontSize: '12px', marginTop: '5px' }}>
                <Col xs={12}>{props.categorie?.label}</Col>
            </Row>
        </Link>
    </Container>
  );
};

export default VehiculeElement;