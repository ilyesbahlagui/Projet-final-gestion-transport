import { useEffect, useId, useRef, useState } from "react";
import { Accordion, Button, Carousel, Col, Container, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../../../App";
import { DetailsModal } from "../../../components/details-modal";
import { PaginatedTable } from "../../../components/paginated-table";
import { ReactState, useStateAsync } from "../../../lib/react";
import { Maybe } from "../../../lib/types";
import { Annonce } from "../../../models/annonce";
import { Categorie } from "../../../models/categorie-vehicule";
import { StatutVehicule, VehiculeSociete } from "../../../models/vehicule-societe";
import { APIResponse } from "../../../services/service";
import { ReservationSection, getActiveSection } from "../reservations/reservation-section";
import { formatDate } from "../../../lib/date";

export const CreerReservation = () => {
    const navigate = useNavigate();

    const [annonces] = useStateAsync(() => AppContext.services.annonce.getAll().then(r => r.data));

    const [vehicules] = useStateAsync(() => AppContext.services.vehicule.getAll().then(v => v.data));
    const [categories, setCategories] = useState<APIResponse<Categorie>[]>();

    const [covoiturageAdresseDepart, setCovoiturageAdresseDepart] = useState("");
    const idCovoiturageAdresseDepart = useId();

    const [covoiturageAdresseDestination, setCovoiturageAdresseDestination] = useState("");
    const idCovoiturageAdresseDestination = useId();

    const [covoiturageDuration, setCovoiturageDuration] = useState("");
    const [covoiturageDistance, setCovoiturageDistance] = useState("");

    const [showReservationCovoiturageModal, setShowReservationCovoiturageModal] = useState(false);
    const [showReservationProModal, setShowReservationProModal] = useState(false);

    const [currentAnnonce, setCurrentAnnonce] = useState<Maybe<Annonce>>();

    const [annoncesError] = useState("");

    const [queryParameters] = useSearchParams();

    const [reservationProDebut, setReservationProDebut] = useState("");
    const [reservationProFin, setReservationProFin] = useState("");

    const [reservationProWithChauffeur, setReservationProWithChauffeur] = useState(false);

    const [showReservationProDebutFeedback, setShowReservationProDebutFeedback] = useState("");
    const [showReservationProFinFeedback, setShowReservationProFinFeedback] = useState("");

    const [carouselActiveIndex, setCarouselActiveIndex] = useState(0);

    useEffect(() => {
        if (!covoiturageAdresseDepart || !covoiturageAdresseDestination)
            return;

        const updateRouteDetails = async () =>
        {
            const {geolocation} = AppContext.services;
            const getAddressLocation = (address: string) => geolocation
                .autocomplete(address)
                .then(autocomplete => autocomplete.predictions[0].public_id)
                .then(id => geolocation.fetchAddressLocation(id))
                .catch(() => null);

            const [startID, endID] = await Promise.all([covoiturageAdresseDepart, covoiturageAdresseDestination].map(getAddressLocation));

            if (!startID || !endID)
                return;

            geolocation.fetchRouteData(startID, endID)
                .then((routeData) => routeData.legs[0])
                .then(({ distance, duration }) => {
                    setCovoiturageDistance(distance.text);
                    setCovoiturageDuration(duration.text);
                })
                .catch((err) => { /* No/unknown route, ignore. */ });
        };

        updateRouteDetails();
    }, [covoiturageAdresseDepart, covoiturageAdresseDestination]);

    useEffect(() =>
    {
        Promise.all(vehicules
            ?.map(v => v.categorieID)
            .map(id => AppContext.services.categorie.getById(id))
            ?? [])
            .then(setCategories);
    }, [vehicules]);

    const filterAnnonce = (annonce: Annonce) =>
    {
        if (!covoiturageAdresseDepart)
            return false;

        // TODO: Rest.
        return annonce.adresseDepart.includes(covoiturageAdresseDepart)
            && annonce.adresseDestination.includes(covoiturageAdresseDestination);
    }
    const reserveAnnonce = (annonce: Annonce) =>
    {
        setCurrentAnnonce(annonce);
        setShowReservationCovoiturageModal(true);
    };
    const confirmReservation = () =>
    {
        if (!currentAnnonce)
            throw new Error('No annonce');

        AppContext.services.reservation.covoiturage().reserve(currentAnnonce)
            .then(() => navigate('./..'));
        setShowReservationCovoiturageModal(false);
    };

    const filteredAnnonces = annonces?.filter(filterAnnonce) ?? [];

    const activeSection = getActiveSection(queryParameters);

    const getCategorie = (vehicule: VehiculeSociete) => categories?.find(c => c.data?.id === vehicule.categorieID)?.data;

    const getCurrentVehicule = () => (vehicules ?? [])[carouselActiveIndex];

    const feedbackMsgs = {
        REQUIRED: "Veuillez remplir ce champ",
        START_DATE_BEFORE_CURRENT_DATE: "La date de réservation ne doit pas être antérieure à la date actuelle",
        END_DATE_BEFORE_START_DATE: "La date de retour ne doit pas être antérieure à la date de réservation",
    };

    const now = new Date();

    const handleShowReservationProDetailsModal = () => {
        setShowReservationProDebutFeedback("");
        setShowReservationProFinFeedback("");
        let invalid = false;
        if (!reservationProDebut) {
            invalid = true;
            setShowReservationProDebutFeedback(feedbackMsgs.REQUIRED);
        }
        if (!reservationProFin) {
            invalid = true;
            setShowReservationProFinFeedback(feedbackMsgs.REQUIRED);
        }
        const dateDebut = new Date(reservationProDebut);
        const dateFin = new Date(reservationProFin);
        if (dateDebut <= now) {
            invalid = true;
            setShowReservationProDebutFeedback(feedbackMsgs.START_DATE_BEFORE_CURRENT_DATE);
        }
        if (dateDebut >= dateFin) {
            invalid = true;
            setShowReservationProFinFeedback(feedbackMsgs.END_DATE_BEFORE_START_DATE);
        }
        if (invalid)
            return;
        setShowReservationProModal(true);
    };

    const confirmReservationVehicule = () => {
        const reservation = {
            dateDebut: new Date(reservationProDebut),
            dateFin: new Date(reservationProFin),
            employeID: AppContext.services.authentication.employe?.id!,
            vehiculeID: getCurrentVehicule().id,
            needsChauffeur: reservationProWithChauffeur,
        };
        AppContext.services.reservation.professionnelle()
            .add(reservation)
            .then(res => {
                if (res.error)
                    throw res.error;
                navigate(`./..?section=${ReservationSection.Vehicule}`);
            });
    };

    return (
        <Container className="pt-3">
            <Link to={ `./..?section=${activeSection}` }>
                <Button variant="danger">↫ Retour à la liste</Button>
            </Link>
            <h2 className="text-lg-start text-center mb-4">
                Réserver un véhicule
            </h2>
            <Accordion className="mb-3" defaultActiveKey={ activeSection }>
                <Accordion.Item eventKey={ ReservationSection.Covoiturage }>
                    <Accordion.Header>Covoiturage</Accordion.Header>
                    <Accordion.Body>
                        <Form className="mb-3 pt-3 pb-2 text-start">
                            <h5 className="fw-bold mb-3">Critères</h5>
                            <div className="ms-5">
                                <Form.Group className="mb-3" controlId={ idCovoiturageAdresseDepart }>
                                    <Form.Label>Adresse de départ</Form.Label>
                                    <AddressSearchBar addresses={annonces?.map(a => a.adresseDepart) ?? []} text={[covoiturageAdresseDepart, setCovoiturageAdresseDepart]} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId={ idCovoiturageAdresseDestination }>
                                    <Form.Label>Adresse de destination</Form.Label>
                                    <AddressSearchBar addresses={annonces?.map(a => a.adresseDestination) ?? []} text={[covoiturageAdresseDestination, setCovoiturageAdresseDestination]} />
                                </Form.Group>
                                <Form.Group className="mb-3 col-5" controlId="covoiturage-date-depart">
                                    <Form.Label>Date de départ</Form.Label>
                                    <Form.Control type="date" />
                                </Form.Group>
                                <Row>
                                    <Form.Group as={ Col } className="mb-3 col-5" controlId="covoiturage-date-depart" disabled>
                                        <Form.Label>Durée du trajet</Form.Label>
                                        <Form.Control type="text" value={ covoiturageDuration ? covoiturageDuration : "--" } readOnly plaintext />
                                    </Form.Group>
                                    <Form.Group as={ Col } className="mb-3 col-5" controlId="covoiturage-date-depart">
                                        <Form.Label>Distance</Form.Label>
                                        <Form.Control type="text" value={ covoiturageDistance ? covoiturageDistance : "--" } readOnly plaintext/>
                                    </Form.Group>
                                </Row>
                                <Form.Text className="text-danger">{ annoncesError }</Form.Text>
                            </div>
                            { filteredAnnonces.length > 0 &&
                                <>
                                    <h5 className="fw-bold mb-3 mt-3">Covoiturages</h5>
                                    <div className="ms-5">
                                        {annonceTable(filteredAnnonces, reserveAnnonce)}
                                    </div>
                                </>
                            }
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={ ReservationSection.Vehicule }>
                    <Accordion.Header>Véhicule de société</Accordion.Header>
                    <Accordion.Body>
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3 col-11" controlId="vehicule-date-debut">
                                        <Form.Label>Date/heure de réservation</Form.Label>
                                        <Form.Control type="datetime-local" onChange={ (evt) => setReservationProDebut(evt.target.value) } isInvalid={ Boolean(showReservationProDebutFeedback) } onInput={ () => setShowReservationProDebutFeedback("") }/>
                                        <Form.Control.Feedback type="invalid">{ showReservationProDebutFeedback }</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 col-11" controlId="vehicule-date-fin">
                                        <Form.Label>Date/heure de retour</Form.Label>
                                        <Form.Control type="datetime-local" onChange={ (evt) => setReservationProFin(evt.target.value) } isInvalid={ Boolean(showReservationProFinFeedback) } onInput={ () => setShowReservationProFinFeedback("") }/>
                                        <Form.Control.Feedback type="invalid">{ showReservationProFinFeedback }</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Form.Check className="col d-flex gap-2 align-items-start" type="checkbox" id="with-chauffeur">
                                    <Form.Check.Input className="float-none" defaultChecked={ reservationProWithChauffeur } onChange={ (evt) => setReservationProWithChauffeur(evt.target.checked) } />
                                    <Form.Check.Label>Avec chauffeur</Form.Check.Label>
                                </Form.Check>
                            </Row>
                            <div className="w-50 mx-auto mt-5">
                                <p className="d-flex justify-content-center gap-1">
                                    <span>{ carouselActiveIndex + 1 }</span>
                                    <span>sur</span>
                                    <span>{ vehicules?.length }</span>
                                </p>
                                <Carousel className="carousel-dark" indicators={ false } interval={ null } onSelect={ (idx) => { setCarouselActiveIndex(idx) } }>
                                    { vehicules && vehicules?.map((vehicule, idx) => {
                                        return (
                                            <Carousel.Item key={ vehicule.immatriculation }>
                                                <img className="d-block w-50 m-auto"
                                                    src={ vehicule.photo }
                                                    alt={ `${vehicule.marque } - ${vehicule.modele} (${vehicule.immatriculation})` }
                                                />
                                                <Carousel.Caption className="position-static">
                                                    <h4>{ vehicule.immatriculation + idx }</h4>
                                                    <span>{ vehicule.marque } - { vehicule.modele } </span>
                                                    <br/>
                                                    <span>{ getCategorie(vehicule)?.label }</span>
                                                </Carousel.Caption>
                                            </Carousel.Item>
                                        );
                                    }) }
                                </Carousel>
                                { getCurrentVehicule()?.statut === StatutVehicule.EnService
                                    ? <Button variant="success" onClick={ handleShowReservationProDetailsModal }>Réserver</Button>
                                    : <span className="text-uppercase text-danger">Non disponible</span>
                                }
                            </div>
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <DetailsModal
                show={ showReservationCovoiturageModal }
                onHide={ () => setShowReservationCovoiturageModal(false) }
                title="Réservation d'un covoiturage"
                footerContent={ (
                    <>
                        <Button variant="secondary" onClick={ () => setShowReservationCovoiturageModal(false) }>
                            Annuler
                        </Button>
                        <Button variant="success" onClick={ confirmReservation }>
                            Confirmer
                        </Button>
                    </>
                ) }
                detailsMap={ {
                    "Départ": currentAnnonce?.adresseDepart,
                    "Destination": currentAnnonce?.adresseDestination,
                    "Date/Heure": currentAnnonce?.date && formatDate(currentAnnonce.date),
                    "Modèle": `${currentAnnonce?.marque} ${currentAnnonce?.modele}`,
                    // TODO: Récupérer nom du chauffeur
                    "Chauffeur": "",
                } } />
            <DetailsModal
                show={ showReservationProModal }
                onHide={ () => setShowReservationProModal(false) }
                title="Réservation d'un véhicule"
                footerContent={ (
                    <>
                        <Button variant="secondary" onClick={ () => setShowReservationProModal(false) }>
                            Annuler
                        </Button>
                        <Button variant="success" onClick={ confirmReservationVehicule }>
                            Confirmer
                        </Button>
                    </>
                ) }
                detailsMap={ {
                    "Date/heure de réservation": reservationProDebut && formatDate(reservationProDebut),
                    "Date/heure de retour": reservationProFin && formatDate(reservationProFin),
                    "Immatriculation": getCurrentVehicule()?.immatriculation,
                    "Marque": getCurrentVehicule()?.marque,
                    "Modèle": getCurrentVehicule()?.modele,
                    "Avec chauffeur": reservationProWithChauffeur ? "Oui" : "Non",
                } } />
        </Container>
    );
};

const annonceTable = (annonces: Annonce[], reserve: (annonce: Annonce) => void) =>
{
    const header = (
        <tr>
            <th className="col-1">
                Date/heure
            </th>
            <th className="col-2">
                Départ
            </th>
            <th className="col-2">
                Destination
            </th>
            <th className="col-2">
                Véhicule
            </th>
            <th className="col-1">
                Chauffeur
            </th>
            <th className="col-3">
                Places disponibles
            </th>
            <th className="col-1"></th>
        </tr>
    );

    const renderElement = (annonce: Annonce) =>
    (
        <tr key={ annonce.id }>
            <td>
                { formatDate(annonce.date) }
            </td>
            <td>
                { annonce.adresseDepart }
            </td>
            <td>
                { annonce.adresseDestination }
            </td>
            <td>
                {`${annonce.marque} ${annonce.modele}`}
            </td>
            <td>
                { annonce.employeID }
            </td>
            <td>
                { annonce.placeDisponible }
            </td>
            <td>
                { annonce.placeDisponible > 0
                    && <Button
                        variant="primary"
                        onClick={ () => reserve(annonce) }>
                        Réserver
                    </Button>
                }
            </td>
        </tr>
    );

    return (
        <PaginatedTable
            getItems={ () => annonces }
            renderItem={ renderElement }
            totalItems={ annonces.length }
            header={ header }
            hidePagination
            ifEmpty={ "Aucun résultat trouvé" } />
    );
};

interface AddressSearchBarProps
{
    addresses: string[],
    text: ReactState<string>,
}

const AddressSearchBar = ({addresses, text}: AddressSearchBarProps) =>
{
    const [matches, setMatches] = useState<string[]>([]);
    const refSearchInput = useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;

    const search = (newText: string) =>
    {
        setMatches(newText.length > 0
            ? addresses.filter(a => a.includes(newText))
            : []);
    };
    const setAddress = (address: string) =>
    {
        text[1](address);
        refSearchInput.current.value = address;
        setMatches([]);
    };
    const renderMatch = (match: string) =>
    (
        <Button key={match} onClick={() => setAddress(match)}>{match}</Button>
    )

    return (
        <Stack gap={1}>
            <Form.Control type="text" ref={ refSearchInput } onChange={e => search(e.target.value)} />
            <Stack>
                {matches.map(renderMatch)}
            </Stack>
        </Stack>
    );
};
