import { useEffect, useState } from "react";
import { Accordion, Button, Container, Dropdown, DropdownButton, Modal } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { AppContext } from "../../../App";
import { DetailsModal } from "../../../components/details-modal";
import { ListeReservationSection, ReservationTableData } from "../../../components/liste-reservation-section";
import { useStateAsync } from "../../../lib/react";
import { Maybe } from "../../../lib/types";
import { getFullName } from "../../../lib/utils";
import { Annonce, StatutAnnonce, getStatutAnnonceKey } from "../../../models/annonce";
import { ReservationCovoiturage, ReservationProfessionnelle } from "../../../models/reservation";
import { VehiculeSociete } from "../../../models/vehicule-societe";
import { APIResponse } from "../../../services/service";
import { ReservationSection, getActiveSection } from "./reservation-section";
import { Employe } from "../../../models/employe";
import { formatDate } from "../../../lib/date";

export const ListeReservation = () => {
    const [reservationsCovoiturage, setReservationsCovoiturage] = useStateAsync(() => AppContext.services.reservation.covoiturage().getAll());
    const [annonces, setAnnonces] = useState<APIResponse<Annonce>[]>();

    const [reservationsPro] = useStateAsync(() => AppContext.services.reservation.professionnelle().getAll());
    const [vehicules, setVehicules] = useState<APIResponse<VehiculeSociete>[]>();
    const [chauffeurs, setChauffeurs] = useState<APIResponse<Employe>[]>();

    useEffect(() =>
    {
        Promise.all(reservationsCovoiturage?.data
            ?.map(r => r.annonceID)
            .map(id => AppContext.services.annonce.getById(id))
            ?? [])
            .then(setAnnonces);

        Promise.all(reservationsPro?.data
            ?.map(r => r.vehiculeID)
            .map(id => AppContext.services.vehicule.getById(id))
            ?? [])
            .then(setVehicules);

        Promise.all(reservationsPro?.data
            ?.map(r => r.conducteurID)
            .filter(id => id)
            .map(id => AppContext.services.employe.getById(id!))
            ?? [])
            .then(setChauffeurs);
    }, [reservationsCovoiturage, reservationsPro]);

    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showAnnulationModal, setShowAnnulationModal] = useState(false);
    const [currentReservationCovoiturage, setCurrentReservationCovoiturage] = useState<Maybe<ReservationCovoiturage>>();

    const [queryParameters] = useSearchParams();

    if ((!reservationsCovoiturage || !annonces) || (!reservationsPro || !vehicules || !chauffeurs))
        return <></>;

    if (!reservationsCovoiturage.data)
        return <>Erreur ! {JSON.stringify(reservationsCovoiturage.error)}</>;

    if (!reservationsPro.data)
        return <>Erreur ! {JSON.stringify(reservationsPro.error)}</>;

    const getAnnonce = (reservation: Maybe<ReservationCovoiturage> = currentReservationCovoiturage) => reservation && annonces.find(a => a.data?.id === reservation.annonceID)?.data;

    const getVehicule = (reservation: Maybe<ReservationProfessionnelle>) => reservation && vehicules.find(a => a.data?.id === reservation.vehiculeID)?.data;

    const getChauffeur = (reservation: Maybe<ReservationProfessionnelle>) => reservation && chauffeurs.find(a => a.data?.id === reservation.conducteurID)?.data;

    const reservationCovoiturageTableData: ReservationTableData<ReservationCovoiturage>[] = [
        {
            header: "Date/heure",
            value: (res) => getAnnonce(res) && formatDate(getAnnonce(res)!.date),
            col: 2,
        },
        {
            header: "Départ",
            value: (res) => getAnnonce(res)?.adresseDepart,
            col: 3,
        },
        {
            header: "Destination",
            value: (res) => getAnnonce(res)?.adresseDestination,
            col: 3,
        },
        {
            header: "Statut",
            value: (res) => getStatutAnnonceKey(res.statut),
            inHistorique: true,
            col: 1,
        },
    ];

    const reservationProfessionelleTableData: ReservationTableData<ReservationProfessionnelle>[] = [
        {
            header: "Date/heure début",
            value: (res) => formatDate(res.dateDebut),
            col: 2,
        },
        {
            header: "Date/heure fin",
            value: (res) => formatDate(res.dateFin),
            col: 2,
        },
        {
            header: "Immatriculation",
            value: (res) => getVehicule(res)?.immatriculation,
            col: 2,
        },
        {
            header: "Marque",
            value: (res) => getVehicule(res)?.marque,
            col: 2,
        },
        {
            header: "Modèle",
            value: (res) => getVehicule(res)?.modele,
            col: 2,
        },
        {
            header: "Chauffeur",
            value: (res) =>
            {
                if (!res.needsChauffeur)
                    return <></>;

                if (res.conducteurID === undefined)
                    return <em>En attente</em>;

                const chauffeur = getChauffeur(res);
                return chauffeur && getFullName(chauffeur);
            },
            col: 2,
        },
    ];

    const activeSection = getActiveSection(queryParameters);

    const annulerReservation = () => {
        if (!currentReservationCovoiturage)
            return;
        const service = AppContext.services.reservation.covoiturage();
        service.cancel(currentReservationCovoiturage)
            .then((response) => {
                if (response.error)
                    throw response.error;
            })
            .then(() => service.getAll())
            .then((data) => setReservationsCovoiturage(data))
            .catch(err => { });
    }

    return (
        <Container className="pt-3">
            <h2 className="text-lg-start">Vos Réservations</h2>
            <div className="mb-3">
                <div className="d-flex justify-content-end">
                    <DropdownButton title="Réserver un transport" variant="success" drop="down-centered">
                        <Dropdown.Item as="button">
                            <Link to={ `creer?section=${ReservationSection.Covoiturage}` } className="text-decoration-none">
                                Covoiturage
                            </Link>
                        </Dropdown.Item>
                        <Dropdown.Item as="button">
                            <Link to={ `creer?section=${ReservationSection.Vehicule}` } className="text-decoration-none">
                                Véhicule de société
                            </Link>
                        </Dropdown.Item>
                    </DropdownButton>
                </div>
            </div>
            <Accordion className="mb-3" defaultActiveKey={ activeSection } alwaysOpen>
                <ListeReservationSection
                    title="Covoiturage"
                    eventKey={ ReservationSection.Covoiturage }
                    data={reservationsCovoiturage.data}
                    tableData={ reservationCovoiturageTableData }
                    comparisonDate={(res) => getAnnonce(res)?.date!}
                    historiqueFilter={(res) => res.statut === StatutAnnonce.Annulé}
                    showDetailsHandler={ (res) => { setCurrentReservationCovoiturage(res); setShowInfoModal(true); } }
                    annulationHandler={ (res) => { setCurrentReservationCovoiturage(res); setShowAnnulationModal(true); } }
                />
                <ListeReservationSection
                    title="Véhicule de société"
                    eventKey={ ReservationSection.Vehicule }
                    data={reservationsPro.data}
                    tableData={ reservationProfessionelleTableData }
                    comparisonDate={(res) => res.dateFin}
                />
            </Accordion>
            <DetailsModal
                show={ showInfoModal }
                onHide={ () => setShowInfoModal(false) }
                title="Détails du covoiturage"
                detailsMap={ {
                    "Départ": getAnnonce()?.adresseDepart,
                    "Destination": getAnnonce()?.adresseDestination,
                    "Date/Heure": getAnnonce()?.date && formatDate(getAnnonce()!.date),
                    "Modèle": `${getAnnonce()?.marque} ${getAnnonce()?.modele}`,
                    // TODO: Récupérer nom du chauffeur
                    "Chauffeur": "",
                } } />
            <Modal show={ showAnnulationModal } onHide={ () => setShowAnnulationModal(false) }>
                <Modal.Header closeButton>
                    <Modal.Title>Annulation de la réservation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Etes-vous sûr de vouloir annuler cette réservation ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={ () => setShowAnnulationModal(false) }>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={ () => { annulerReservation(); setShowAnnulationModal(false); } }>
                        Confirmer
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );

};
