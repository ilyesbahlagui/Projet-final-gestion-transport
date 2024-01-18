import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { StatutVehicule, VehiculeSociete } from "../../../models/vehicule-societe";
import { ReservationProfessionnelle } from "../../../models/reservation";
import { Categorie } from "../../../models/categorie-vehicule";
import { AppContext } from "../../../App";
import { Container, Row, Col, Image, Button, Alert } from "react-bootstrap";
import { PaginatedTable, PaginatedTableProps } from "../../../components/paginated-table";
import { Employe } from "../../../models/employe";
import { formatDate } from "../../../lib/date";

const DetailsVehicule = () => {
    const { id } = useParams<{ id: string }>();
    const [vehicule, setVehicule] = useState<VehiculeSociete>({} as VehiculeSociete);
    const [categorie, setCategorie] = useState<Categorie>({} as Categorie);
    const [reservations, setReservations] = useState<ReservationProfessionnelle[]>([]);
    const [responsables, setResponsables] = useState<Employe[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchVehicule = async () => {
            const response = await AppContext.services.vehicule.getById(Number(id));
            if (response?.data !== undefined) {
                setVehicule(response.data);
            }
        };
        const fetchCategorie = async () => {
            const response = await AppContext.services.categorie.getById(Number(id));
            if (response?.data !== undefined) {
                setCategorie(response.data);
            }
        };
        const fetchReservations = async () => {
            const response = await AppContext.services.reservation.professionnelle().findByVehicule(Number(id));
            if (response?.data !== undefined) {
                setReservations(response.data);
                const responsablesPromises = response.data.map(async (reservation) => {
                    const response = await AppContext.services.employe.getById(reservation.employeID);
                    if (response?.data !== undefined) {
                        return response.data;
                    }
                });
                const responsablesData = await Promise.all(responsablesPromises);
                if (responsablesData !== undefined) {
                    setResponsables(responsablesData.filter((responsable) => responsable !== undefined) as Employe[]);
                }
            }
        };
        
        fetchVehicule();
        fetchCategorie();
        fetchReservations();
    }, [vehicule, id]);

    const reservationsEnCours = reservations.filter((r) => new Date(r.dateDebut) >= new Date());
    const reservationsHistorique = reservations.filter((r) => new Date(r.dateDebut) < new Date());

    const reservationHeader =
        <tr>
            <th className="col-4">
                Date/heure début
            </th>
            <th className="col-4">
                Date/heure fin
            </th>
            <th className="col-4">
                Responsable
            </th>
        </tr>;

    const reservationElement = (r: ReservationProfessionnelle) => {
        let responsable: Employe | undefined;
        if (responsables) {
            responsable = responsables.find((emp) => emp.id === r.employeID);
        }
    
        return (
            <tr key={ r.id }>
                <td>
                    { formatDate(r.dateDebut) }
                </td>
                <td>
                    { formatDate(r.dateFin) }
                </td>
                <td>
                    {responsable ? `${responsable.firstName} ${responsable.lastName}` : ''}
                </td>
            </tr>
        );
    };

    const reservationsTable = (data: ReservationProfessionnelle[], options?: Partial<PaginatedTableProps<ReservationProfessionnelle>>) => {
        return (
            <PaginatedTable
                getItems={page => data.slice(5 * page, 5 * page + 5)}
                itemsPerPage={5}
                renderItem={reservationElement}
                totalItems={data.length}
                header={reservationHeader}
                { ...options }
            />
        );
    }

    const handleMettreEnReparation = async () => {
        vehicule.statut = StatutVehicule.EnReparation;
        const response = await AppContext.services.vehicule.update(vehicule);
        if (response.data) {
            setVehicule(response.data);
        } else if (response.error) {
            setError(response.error.message);
        }
    };

    const handleMettreEnService = async () => {
        vehicule.statut = StatutVehicule.EnService;
        const response = await AppContext.services.vehicule.update(vehicule);
        if (response.data) {
            setVehicule(response.data);
        } else if (response.error) {
            setError(response.error.message);
        }
    };

    const handleHorsService = async () => {
        vehicule.statut = StatutVehicule.HorsService;
        const response = await AppContext.services.vehicule.update(vehicule);
        if (response.data) {
            setVehicule(response.data);
        } else if (response.error) {
            setError(response.error.message);
        }
    };

    return (
        <Container className="pt-3">
            {error && (
                <Alert variant="danger" onClose={() => setError("")} dismissible>
                    {error}
                </Alert>
            )}
            <h2 className="text-start"><Link to="/admin/vehicules" className="mb-3">Véhicules</Link> &gt; {vehicule.immatriculation}</h2>
            <Row className="pt-3 mb-3">
                <Col xs={12} md={4}>
                    <Image src={vehicule.photo} alt="Photo du véhicule" style={{ width: '250px', height: '250px', objectFit: 'cover' }}/>
                </Col>
                <Col xs={12} md={6} className="text-start">
                    <Row>
                        <Col xs={2}><p>Marque</p></Col>
                        <Col xs={10}><p>{vehicule.marque}</p></Col>
                    </Row>
                    <Row>
                        <Col xs={2}><p>Modèle</p></Col>
                        <Col xs={10}><p>{vehicule.modele}</p></Col>
                    </Row>
                    <Row>
                        <Col xs={2}><p>Catégorie</p></Col>
                        <Col xs={10}><p>{categorie.label}</p></Col>
                    </Row>
                    <Row>
                        <Col xs={2}><p>Statut</p></Col>
                        <Col xs={10}><p>{vehicule.statut}</p></Col>
                    </Row>
                </Col>
                <Col xs={12} md={2}>
                    <Row className="pt-1">
                        <Col>
                            {vehicule.statut === 'EN_SERVICE' || vehicule.statut === 'HORS_SERVICE' ? (
                            <Button variant="secondary" onClick={handleMettreEnReparation} className="w-100">
                                Mettre en réparation
                            </Button>
                            ) : null}
                        </Col>
                    </Row>
                    <Row className="pt-1">
                        <Col>
                            {vehicule.statut === 'HORS_SERVICE' || vehicule.statut === 'EN_REPARATION' ? (
                            <Button variant="secondary" onClick={handleMettreEnService} className="w-100">
                                Mettre en service
                            </Button>
                            ) : null}
                        </Col>
                    </Row>
                    <Row className="pt-1">
                        <Col>
                            {vehicule.statut === 'EN_SERVICE' || vehicule.statut === 'EN_REPARATION' ? (
                            <Button variant="danger" onClick={handleHorsService} className="w-100">
                                Hors service
                            </Button>
                            ) : null}
                        </Col>
                    </Row>
                </Col>
            </Row>
            
            <h4 className="text-start">Prochaines réservations</h4>
            { reservationsTable(
                reservationsEnCours,
                {
                    getItems: () => reservationsEnCours,
                    hidePagination: true,
                    ifEmpty: "Aucune réservation en cours",
                },
            ) }
            <h4 className="text-start">Historique des réservations</h4>
            { reservationsTable(
                reservationsHistorique,
                {
                    getItems: page => reservationsHistorique.slice(5 * page, 5 * page + 5),
                    ifEmpty: "Aucune réservation dans l'historique",
                },
            ) }
        </Container>
    );
};

export default DetailsVehicule;
