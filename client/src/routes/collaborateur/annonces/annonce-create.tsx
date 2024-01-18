import { CSSProperties, useState, useEffect, useId } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { AppContext } from "../../../App";
import { StatutAnnonce } from "../../../models/annonce";
import { Accordion, Row, Col, Alert } from "react-bootstrap";
import { AddressSearchInput } from "../../../components/address-search-input-create-annonce";
import { Link } from "react-router-dom";
import { Maybe } from "../../../lib/types";
import ModalComponent from "../../../components/modal";
import { Location } from "../../../lib/geo-api-types";
import { formatDate, formatDateField } from "../../../lib/date";

export const AnnonceCreate = () => {
  // États pour les champs du formulaire
    const [, setAdresseDepart] = useState("");
    const [, setAdresseDestination] = useState("");
    const [immatriculation, setImmatriculation] = useState("");
    const [marque, setMarque] = useState("");
    const [modele, setModele] = useState("");
    const [date, setDate] = useState<Date | null>(null);
    const [placesDisponibles, setPlacesDisponibles] = useState(0);
    const [statut, setStatut] = useState<StatutAnnonce>(StatutAnnonce.Confirmé);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const [isAdresseDepartValid, setIsAdresseDepartValid] = useState(false);
    const [isAdresseDestinationValid, setIsAdresseDestinationValid] = useState(false);
    const [isImmatriculationValid, setIsImmatriculationValid] = useState(false);
    const [isMarqueValid, setIsMarqueValid] = useState(false);
    const [isModeleValid, setIsModeleValid] = useState(false);
    const [isNombrePlacesValid, setIsNombrePlacesValid] = useState(false);
    const [isValidDate, setIsValidDate] = useState(false);

    const isFormValid = () => {
        return (
            isAdresseDepartValid &&
            isAdresseDestinationValid &&
            isImmatriculationValid &&
            isMarqueValid &&
            isModeleValid &&
            isNombrePlacesValid &&
            isValidDate
        );
    };

    const [
        covoiturageAdresseDepartCoordinates,
        setCovoiturageAdresseDepartCoordinates,
    ] = useState<Maybe<Location>>();

    const idCovoiturageAdresseDepart = useId();

    const [
        covoiturageAdresseDestinationCoordinates,
        setCovoiturageAdresseDestinationCoordinates,
    ] = useState<Maybe<Location>>();
    const idCovoiturageAdresseDestination = useId();

    const [covoiturageDuration, setCovoiturageDuration] = useState("");
    const [covoiturageDistance, setCovoiturageDistance] = useState("");

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setShowConfirmationModal(true);
    };

    const handleDateChange = (selectedDate: string) => {
        let newDate = new Date();
        newDate.setMinutes(Math.floor(newDate.getMinutes() / 10) * 10);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
        if (date){
            newDate = new Date(date)
        }
        newDate.setFullYear(Number(selectedDate.substring(0, 4)));
        newDate.setMonth(Number(selectedDate.substring(5, 7)) - 1);
        newDate.setDate(Number(selectedDate.substring(8, 10)));
        setDate(newDate);
        setIsValidDate(newDate > new Date());
    };

    const handleHourChange = (selectedHour: string) => {
        let newDate = new Date();
        newDate.setMinutes(Math.floor(newDate.getMinutes() / 10) * 10);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
        if (date){
            newDate = new Date(date)
        }
        newDate.setHours(Number(selectedHour));
        setDate(newDate);
        setIsValidDate(newDate > new Date());
    };

    const handleMinutesChange = (selectedMinutes: string) => {
        let newDate = new Date();
        newDate.setMinutes(Math.floor(newDate.getMinutes() / 10) * 10);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
        if (date){
            newDate = new Date(date)
        }
        newDate.setMinutes(Number(selectedMinutes));
        setDate(newDate);
        setIsValidDate(newDate > new Date());
    };

    const confirmPublication = async () => {
        if (date) {
            const nouvelleAnnonce = {
                adresseDepart: covoiturageAdresseDepartCoordinates?.address!,
                adresseDestination: covoiturageAdresseDestinationCoordinates?.address!,
                immatriculation,
                marque,
                modele,
                placeDisponible: Number(placesDisponibles),
                date,
                statut,
                employeID: AppContext.services.authentication.employe!.id,
            };
            const response = await AppContext.services.annonce.add(nouvelleAnnonce);
    
            setCovoiturageAdresseDepartCoordinates(undefined);
            setCovoiturageAdresseDestinationCoordinates(undefined);
            setAdresseDepart("");
            setAdresseDestination("");
            setImmatriculation("");
            setMarque("");
            setModele("");
            setCovoiturageDistance("");
            setCovoiturageDuration("");
            setDate(null);
            setPlacesDisponibles(0);
            setStatut(StatutAnnonce.Confirmé);
            setShowConfirmationModal(false);
            setSuccessMessage("Annonce publiée avec succès!");
        }
    };

    useEffect(() => {
        if (
        !covoiturageAdresseDepartCoordinates ||
        !covoiturageAdresseDestinationCoordinates
        )
        return;

        AppContext.services.geolocation
        .fetchRouteData(
            covoiturageAdresseDepartCoordinates,
            covoiturageAdresseDestinationCoordinates
        )
        .then(routeData => routeData.legs[0])
        .then(({ distance, duration }) => {
            setCovoiturageDistance(distance.text);
            setCovoiturageDuration(duration.text);
        })
        .catch(err => {
            throw err;
        });
    }, [
        covoiturageAdresseDepartCoordinates,
        covoiturageAdresseDestinationCoordinates,
    ]);

    // STYLE
    const FormStyle: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        marginBottom: "10px",
    };

    const mainStyle: CSSProperties = {
        minHeight: "800px",
        height: "auto",
        backgroundColor: "white",
        borderRadius: "13px",
        padding: "30px",
    };
    // composant
    return (
        <div
            className="col-12 d-flex flex-column  align-items-center"
            style={mainStyle}
        >
            <div className="col-12 d-flex justify-content-start">
                <Link to="/collaborateur/annonces" className="btn btn-primary">
                    Retour à la liste
                </Link>
            </div>
            
            {successMessage && (
                <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
                    {successMessage}
                </Alert>
            )}
            {errorMessage && (
                <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible>
                    {errorMessage}
                </Alert>
            )}

            <div className="col-lg-10 col-12">
                <h1 className="text-lg-start text-center">Publier une annonce</h1>
            </div>

            <Form
                noValidate
                onSubmit={handleSubmit}
                className="col-lg-10 col-12"
            >
                <Accordion defaultActiveKey={["0", "1", "2"]} alwaysOpen>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header className="bg-primary">
                        Itinéraire
                        </Accordion.Header>
                        <Accordion.Body>
                        <Col className="mb-3 d-flex flex-column justify-content-center align-items-center">
                            <Form.Group
                                as={Col}
                                md="6"
                                controlId={idCovoiturageAdresseDepart}
                                style={FormStyle}
                            >
                                <Form.Label>Adresse de départ</Form.Label>
                                <AddressSearchInput
                                    inputId={idCovoiturageAdresseDepart}
                                    onPick={opt => {
                                        setIsAdresseDepartValid(true);
                                        setCovoiturageAdresseDepartCoordinates(opt);
                                    }}
                                    onInputChange={(value) => {
                                        setAdresseDepart(value);
                                        setIsAdresseDepartValid(false);
                                    }}
                                />
                                {!isAdresseDepartValid && (
                                    <Form.Text className="text-danger">
                                        L'adresse de départ est une adresse inconnue
                                    </Form.Text>
                                )}
                            </Form.Group>

                            <Form.Group
                                as={Col}
                                md="6"
                                controlId={idCovoiturageAdresseDestination}
                                style={FormStyle}
                            >
                                <Form.Label>Adresse de destination</Form.Label>
                                <AddressSearchInput
                                    inputId={idCovoiturageAdresseDestination}
                                    onPick={opt => {
                                        setIsAdresseDestinationValid(true);
                                        setCovoiturageAdresseDestinationCoordinates(opt);
                                    }}
                                    onInputChange={(value) => {
                                        setAdresseDestination(value);
                                        setIsAdresseDestinationValid(false);
                                    }}
                                />
                                {!isAdresseDestinationValid && (
                                    <Form.Text className="text-danger">
                                        L'adresse de destination est une adresse inconnue
                                    </Form.Text>
                                )}
                            </Form.Group>

                            <Row>
                                <Form.Group
                                    as={Col}
                                    md="6"
                                    controlId="covoiturage-date-depart"
                                    disabled
                                    style={FormStyle}
                                >
                                    <Form.Label>Durée du trajet</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={covoiturageDuration ? covoiturageDuration : "--"}
                                        readOnly
                                        plaintext
                                    />
                                </Form.Group>

                                <Form.Group
                                    as={Col}
                                    md="6"
                                    controlId="covoiturage-date-depart"
                                    style={FormStyle}
                                >
                                    <Form.Label>Distance</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={covoiturageDistance ? covoiturageDistance : "--"}
                                        readOnly
                                        plaintext
                                    />
                                </Form.Group>
                            </Row>
                        </Col>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Véhicule</Accordion.Header>
                        <Accordion.Body>
                            <Col className="mb-3 d-flex flex-column justify-content-center align-items-center">
                                <Form.Group controlId="Immatriculation" as={Col} md="6" style={FormStyle}>
                                    <Form.Label>Immatriculation*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Immatriculation"
                                        required
                                        value={immatriculation}
                                        onChange={(e) => {
                                            setImmatriculation(e.target.value)
                                            setIsImmatriculationValid(e.target.value.length > 0);
                                        }}
                                    />
                                    {!isImmatriculationValid && (
                                        <Form.Text className="text-danger">
                                            L'immatriculation est obligatoire
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <Form.Group controlId="Marque" as={Col} md="6" style={FormStyle}>
                                    <Form.Label>Marque*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Marque"
                                        required
                                        value={marque}
                                        onChange={(e) => {
                                            setMarque(e.target.value)
                                            setIsMarqueValid(e.target.value.length > 0);
                                        }}
                                    />
                                    {!isMarqueValid && (
                                        <Form.Text className="text-danger">
                                            La marque est obligatoire.
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <Form.Group controlId="Modèle" as={Col} md="6" style={FormStyle}>
                                    <Form.Label>Modèle*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Modèle"
                                        required
                                        value={modele}
                                        onChange={(e) => {
                                            setModele(e.target.value)
                                            setIsModeleValid(e.target.value.length > 0);
                                        }}
                                    />
                                    {!isModeleValid && (
                                        <Form.Text className="text-danger">
                                            Le modèle est obligatoire.
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <Form.Group controlId="placesDisponibles" as={Col} md="6" style={FormStyle}>
                                    <Form.Label>Nombre de places disponibles</Form.Label>
                                    <Form.Control
                                        type="number"
                                        required
                                        min="1"
                                        max="20"
                                        value={placesDisponibles}
                                        onChange={(e) => {
                                            setPlacesDisponibles(parseInt(e.target.value));
                                            setIsNombrePlacesValid(parseInt(e.target.value) > 0 && parseInt(e.target.value) <= 20);
                                        }}
                                    />
                                    {!isNombrePlacesValid && (
                                        <Form.Text className="text-danger">
                                            Le nombre de places doit être compris entre 1 et 20.
                                        </Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>Date et Horaire</Accordion.Header>
                        <Accordion.Body>
                            <Row className="mb-3 d-flex flex-column justify-content-center align-items-center">
                                <Col md={6}>
                                    <Row>
                                        <Form.Label className="text-start">Date / Heure</Form.Label>
                                    </Row>
                                    <Row>
                                        <Form.Group as={Col} md="5" controlId="formDateTime">
                                            <Form.Control
                                                type="date"
                                                value={date ? formatDateField(date) : ''}
                                                onChange={(e) => handleDateChange(e.target.value)}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group as={Col} md="3" controlId="formHour">
                                            <Form.Control
                                                as="select"
                                                value={date ? date.getHours() : 0}
                                                onChange={(e) => handleHourChange(e.target.value)}
                                                required
                                            >
                                            {Array.from({ length: 24 }).map((_, i) => (
                                                <option key={i} value={i}>
                                                {i}
                                                </option>
                                            ))}
                                            </Form.Control>
                                        </Form.Group>
                                        <Col md="1">
                                            <span>h</span>
                                        </Col>
                                        <Form.Group as={Col} md="3" controlId="formMinutes">
                                            <Form.Control
                                                as="select"
                                                value={date ? Math.floor(date.getMinutes() / 10) * 10 : 0}
                                                onChange={(e) => handleMinutesChange(e.target.value)}
                                                required
                                            >
                                                {Array.from({ length: 6 }).map((_, i) => (
                                                    <option key={i} value={i * 10}>
                                                    {i * 10}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        {!date && (
                                            <Form.Text className="text-danger text-start">
                                                La date et l'heure sont obligatoires
                                            </Form.Text>
                                        )}
                                        {date && !isValidDate && (
                                            <Form.Text className="text-danger text-start">
                                                La date ne peut pas être antérieure à aujourd'hui
                                            </Form.Text>
                                        )}
                                    </Row>
                                </Col>   
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <div className="  d-flex justify-content-end mt-1">
                    <Button type="submit" className="btn-primary" disabled={!isFormValid()}>
                        Publier
                    </Button>
                </div>
            </Form>
            <ModalComponent
                show={showConfirmationModal}
                handleClose={() => setShowConfirmationModal(false)}
                onSave={confirmPublication}
                title={"Confirmation de votre proposition"}
                body={
                    <div>
                        <Row>
                            <Col xs={6} className="text-end">
                                <p>Départ</p>
                            </Col>
                            <Col xs={6}>
                                <p>{covoiturageAdresseDepartCoordinates?.address}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6} className="text-end">
                                <p>Destination</p>
                            </Col>
                            <Col xs={6}>
                                <p>{covoiturageAdresseDepartCoordinates?.address}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6} className="text-end">
                                <p>Marque</p>
                            </Col>
                            <Col xs={6}>
                                <p>{marque}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6} className="text-end">
                                <p>Modèle</p>
                            </Col>
                            <Col xs={6}>
                                <p>{modele}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6} className="text-end">
                                <p>Nombre de places disponibles</p>
                            </Col>
                            <Col xs={6}>
                                <p>{placesDisponibles}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6} className="text-end">
                                <p>Date/heure</p>
                            </Col>
                            <Col xs={6}>
                                <p>{date ? formatDate(date) : ""}</p>
                            </Col>
                        </Row>
                    </div>
                }
                closeButtonLabel={"Annuler"}
                saveButtonLabel={"Confirmer"}
            />
        </div>
    );
};
