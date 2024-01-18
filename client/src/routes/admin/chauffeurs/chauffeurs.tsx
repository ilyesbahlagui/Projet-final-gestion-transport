import { Container, Row, Col, Button, Form, Modal, Alert } from "react-bootstrap";
import { AppContext } from "../../../App";
import { Employe } from "../../../models/employe";
import { useState } from "react";
import ChauffeurElement from "../../../components/chauffeur";
import { useStateAsync } from "../../../lib/react";

const Chauffeurs = () => {
    const [drivers] = useStateAsync(() => AppContext.services.employe.getDrivers(), []);
    const [matriculeFilter, setMatriculeFilter] = useState<string>("");
    const [nomFilter, setNomFilter] = useState<string>("");
    const [prenomFilter, setPrenomFilter] = useState<string>("");
    const [showModal, setShowModal] = useState(false);
    const [matricule, setMatricule] = useState('');
    const [error, setError] = useState("");

    const filterDrivers = (driver: Employe) => {
        if (matriculeFilter && !driver.matricule.toLowerCase().includes(matriculeFilter.toLowerCase())){
            return false;
        }
        if (nomFilter && !driver.lastName.toLowerCase().includes(nomFilter.toLowerCase())) {
            return false;
        }
        if (prenomFilter && !driver.firstName.toLowerCase().includes(prenomFilter.toLowerCase())) {
            return false;
        }
        return true;
    };
    
    let filteredDrivers = drivers.filter(filterDrivers);

    const handleAddChauffeur = async () => {
        const response = await AppContext.services.employe.setChauffeur(matricule);
        if (response.data) {
            setShowModal(false);
            drivers.push(response.data);
        } else if (response.error) {
            setError(response.error.message);
        }
    };
    
    return (
        <Container className="pt-3">
            <h2 className="text-start">Gérer les chauffeurs</h2>
            <div className="mb-1">
                <Form>
                    <h5 className="text-start mb-3">Filtre</h5>
                    <Row className="mb-3">
                        <Form.Label className="text-start" column xs={3} lg={1}>Matricule</Form.Label>
                        <Col xs={6} lg={3}>
                            <Form.Control
                                type="text"
                                placeholder="Matricule"
                                value={matriculeFilter}
                                onChange={(e) => setMatriculeFilter(e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Form.Label className="text-start" column xs={3} lg={1}>Nom</Form.Label>
                        <Col xs={6} lg={3}>
                            <Form.Control
                                type="text"
                                placeholder="Nom"
                                value={nomFilter}
                                onChange={(e) => setNomFilter(e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Form.Label className="text-start" column xs={3} lg={1}>Prénom</Form.Label>
                        <Col xs={6} lg={3}>
                            <Form.Control
                                type="text"
                                placeholder="Prénom"
                                value={prenomFilter}
                                onChange={(e) => setPrenomFilter(e.target.value)}
                            />
                        </Col>
                    </Row>
                </Form>
            
                <div className="d-flex justify-content-end">
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        Ajouter un chauffeur
                    </Button>
                </div>
            </div>
            <Row xs={1} lg={2}>
                {filteredDrivers.map((driver, index) => (
                    <Col key={index}>
                        <ChauffeurElement chauffeur={driver}/>
                    </Col>
                ))}
            </Row>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Nouveau chauffeur</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formMatricule">
                        <Form.Label>Matricule</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Matricule"
                            value={matricule}
                            onChange={(e) => setMatricule(e.target.value)}
                        />
                    </Form.Group>
                </Form>
                {error && (
                    <Alert variant="danger" onClose={() => setError("")} dismissible>
                        {error}
                    </Alert>
                )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleAddChauffeur}>
                        Valider
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
  };
  
  export default Chauffeurs;