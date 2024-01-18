import { useState } from "react";
import { Container, Row, Col, Button, Modal, Form, Alert } from "react-bootstrap";
import { AppContext } from "../../../App";
import { useStateAsync } from "../../../lib/react";
import VehiculeElement from "../../../components/vehicule-element";
import { Categorie } from "../../../models/categorie-vehicule";
import { StatutVehicule, VehiculeSociete } from './../../../models/vehicule-societe';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const Vehicules = () => {
    const [vehicules] = useStateAsync(() => AppContext.services.vehicule.getAll());
    const [categories] = useStateAsync(() => AppContext.services.categorie.getAll());
    const [immatriculationFilter, setImmatriculationFilter] = useState<string>("");
    const [marqueFilter, setMarqueFilter] = useState<string>("");
    const [showModal, setShowModal] = useState(false);
    const [immatriculation, setImmatriculation] = useState("");
    const [marque, setMarque] = useState("");
    const [modele, setModele] = useState("");
    const [categorieId, setCategorieId] = useState(0);
    const [nombrePlaces, setNombrePlaces] = useState(0);
    const [photo, setPhoto] = useState("");

    const [isImmatriculationValid, setIsImmatriculationValid] = useState(false);
    const [isMarqueValid, setIsMarqueValid] = useState(false);
    const [isModeleValid, setIsModeleValid] = useState(false);
    const [isNombrePlacesValid, setIsNombrePlacesValid] = useState(false);
    const [isCategorieIdValid, setIsCategorieIdValid] = useState(false);
    const [isPhotoValid, setIsPhotoValid] = useState(false);
    
    const [error, setError] = useState("");

    const filterVehicules = (vehicule: VehiculeSociete) => {
        if (immatriculationFilter && !vehicule.immatriculation.toLowerCase().includes(immatriculationFilter.toLowerCase())){
            return false;
        }
        if (marqueFilter && !vehicule.marque.toLowerCase().includes(marqueFilter.toLowerCase())) {
            return false;
        }
        return true;
    };
    
    let filteredVehicules = vehicules?.data?.filter(filterVehicules);

    const findCategorieById = (categoryId: number): Categorie | undefined => {
        return categories?.data?.find((categorie) => categorie.id === categoryId);
    };

    const isImmatriculationRegexValid = (immatriculation: string): boolean => {
        const immatriculationRegex = /^[A-Z]{2}-\d{3}-[A-Z]{2}$/;
        return immatriculationRegex.test(immatriculation);
    };
    
    const isFormValid = () => {
        return (
            isImmatriculationValid &&
            isMarqueValid &&
            isModeleValid &&
            isNombrePlacesValid &&
            isCategorieIdValid &&
            isPhotoValid
        );
    };

    const handleAddVehicule = async () => {
        const vehicule:VehiculeSociete = {
            id: 0,
            immatriculation: immatriculation,
            marque: marque,
            modele: modele,
            placeDisponible: nombrePlaces,
            photo: photo,
            statut: StatutVehicule.EnService,
            categorieID: categorieId,
            latitude: 0,
            longitude: 0
        };
        const response = await AppContext.services.vehicule.add(vehicule);
        if (response.data) {
            setShowModal(false);
            vehicules?.data?.push(response.data);
        } else if (response.error) {
            setError(response.error.message);
        }
    };
    
    return (
        <Container className="pt-3">
            <h2 className="text-start">Véhicules</h2>
            <div className="mb-1">
                <Form>
                    <h5 className="text-start mb-3">Filtre</h5>
                    <Row className="mb-3">
                        <Form.Label className="text-start" column xs={3} lg={1}>Immatriculation</Form.Label>
                        <Col xs={6} lg={3}>
                            <Form.Control
                                type="text"
                                placeholder="Immatriculation"
                                value={immatriculationFilter}
                                onChange={(e) => setImmatriculationFilter(e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Form.Label className="text-start" column xs={3} lg={1}>Marque</Form.Label>
                        <Col xs={6} lg={3}>
                            <Form.Control
                                type="text"
                                placeholder="Marque"
                                value={marqueFilter}
                                onChange={(e) => setMarqueFilter(e.target.value)}
                            />
                        </Col>
                    </Row>
                </Form>
                <div className="d-flex justify-content-end">
                    <Link to="/admin/vehicules/geolocalisation" className="btn btn-info">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                        Géolocalisation
                    </Link>
                </div>
                <div className="d-flex justify-content-end pt-2">
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        Ajouter un véhicule
                    </Button>
                </div>
            </div>
            <Row xs={2} lg={4}>
                {filteredVehicules?.map((vehicule, index) => (
                    <Col key={index}>
                        <VehiculeElement
                            vehicule={vehicule}
                            categorie={findCategorieById(vehicule.categorieID)}
                        />
                    </Col>
                ))}
            </Row>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un véhicule</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formImmatriculation">
                            <Form.Label>Immatriculation</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez l'immatriculation"
                                value={immatriculation}
                                onChange={(e) => {
                                    setImmatriculation(e.target.value);
                                    setIsImmatriculationValid(isImmatriculationRegexValid(e.target.value));
                                }}
                            />
                            {!isImmatriculationValid && (
                                <Form.Text className="text-danger">
                                    L'immatriculation doit être au format AA-999-AA.
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group controlId="formMarque">
                            <Form.Label>Marque</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez la marque"
                                value={marque}
                                onChange={(e) => {
                                    setMarque(e.target.value);
                                    setIsMarqueValid(e.target.value.length > 0);
                                }}
                            />
                            {!isMarqueValid && (
                                <Form.Text className="text-danger">
                                    La marque est obligatoire.
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group controlId="formModele">
                            <Form.Label>Modèle</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez le modèle"
                                value={modele}
                                onChange={(e) => {
                                    setModele(e.target.value);
                                    setIsModeleValid(e.target.value.length > 0);
                                }}
                            />
                            {!isModeleValid && (
                                <Form.Text className="text-danger">
                                    Le modèle est obligatoire.
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group controlId="formCategorie">
                            <Form.Label>Catégorie</Form.Label>
                            <Form.Control
                                as="select"
                                value={categorieId}
                                onChange={(e) => {
                                    setCategorieId(parseInt(e.target.value));
                                    setIsCategorieIdValid(parseInt(e.target.value) !== 0);
                                }}
                            >
                                <option value={0}>Sélectionnez une catégorie</option>
                                {categories?.data?.map((categorie) => (
                                    <option key={categorie.id} value={categorie.id}>
                                        {categorie.label}
                                    </option>
                                ))}
                            </Form.Control>
                            {!isCategorieIdValid && (
                                <Form.Text className="text-danger">
                                    La catégorie est obligatoire.
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group controlId="formNombrePlaces">
                            <Form.Label>Nombre de places</Form.Label>
                            <Form.Control
                                type="number"
                                min={0}
                                placeholder="Entrez le nombre de places"
                                value={nombrePlaces}
                                onChange={(e) => {
                                    setNombrePlaces(parseInt(e.target.value));
                                    setIsNombrePlacesValid(parseInt(e.target.value) > 0 && parseInt(e.target.value) <= 20);
                                }}
                            />
                            {!isNombrePlacesValid && (
                                <Form.Text className="text-danger">
                                    Le nombre de places doit être compris entre 1 et 20.
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group controlId="formPhoto">
                            <Form.Label>Photo</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez l'url de la photo"
                                value={photo}
                                onChange={(e) => {
                                    setPhoto(e.target.value);
                                    setIsPhotoValid(e.target.value.length > 0);
                                }}
                            />
                            {!isPhotoValid && (
                                <Form.Text className="text-danger">
                                    L'URL de la photo est obligatoire.
                                </Form.Text>
                            )}
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
                        Fermer
                    </Button>
                    <Button variant="primary" onClick={handleAddVehicule} disabled={!isFormValid()}>
                        Ajouter
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
  };
  
  export default Vehicules;
