import { ReactNode } from "react";
import { Accordion, Button, Col } from "react-bootstrap";
import { paginate } from "../lib/utils";
import { Reservation } from "../models/reservation";
import { ReservationSection } from "../routes/collaborateur/reservations/reservation-section";
import { PaginatedTable, PaginatedTableProps } from "./paginated-table";

export interface ReservationTableData<T extends Reservation> {
    header: string;
    value: (res: T) => ReactNode;
    inHistorique?: boolean;
    col?: number;
}

interface ListeReservationSectionProps<T extends Reservation> {
    title: string;
    eventKey: ReservationSection;
    data: T[];
    tableData: ReservationTableData<T>[]
    comparisonDate: (res: T) => Date;
    historiqueFilter?: (res: T) => boolean;
    showDetailsHandler?: (res: T) => void;
    annulationHandler?: (res: T) => void;
};

export const ListeReservationSection = <T extends Reservation>(props: ListeReservationSectionProps<T>) => {

    const reservationData = props.data;
    const now = new Date();
    const reservationsEnCours = reservationData.filter((el) => props.comparisonDate(el) >= now && !(props.historiqueFilter && props.historiqueFilter(el)));
    const reservationsHistorique = reservationData.filter((el) => props.comparisonDate(el) < now || (props.historiqueFilter && props.historiqueFilter(el)));

    const reservationHeader = (isHistorique = false) =>
        <tr>
            { props.tableData.map((el) => {
                if (el.inHistorique) {
                    if (!isHistorique)
                        return "";
                }
                return (
                    <th key={ el.header } className={ `col${el.col ? "-" + el.col.toString() : ""}` }>
                        { el.header }
                    </th>
                );
            }) }
            { props.showDetailsHandler && <th className="col-2"></th> }
        </tr>;

    const reservationElement = (res: T, isHistorique = false) => {
        const hasAnnulation = props.comparisonDate(res) >= now && !(props.historiqueFilter && props.historiqueFilter(res));
        return (
            <tr key={ res.id }>
                { props.tableData.map((el) => {
                    if (el.inHistorique) {
                        if (!isHistorique)
                            return "";
                    }
                    return (
                        <td key={ el.header }>
                            { el.value(res) }
                        </td>
                    );
                }) }
                { (props.showDetailsHandler || (hasAnnulation && props.annulationHandler)) &&
                    <td><div className="d-flex gap-2 justify-content-center">
                        { props.showDetailsHandler &&
                            <Button
                                variant="primary"
                                onClick={ () => props.showDetailsHandler!(res) }>
                                Détails
                            </Button>
                        }
                        { (hasAnnulation && props.annulationHandler) &&
                            <Button
                                variant="danger"
                                onClick={ () => props.annulationHandler!(res) }>
                                Annuler
                            </Button>
                        }
                    </div></td>
                }
            </tr>
        );
    };

    const itemsPerPage = 5;
    const reservationsTable = (data: T[], options: Partial<PaginatedTableProps<T>>, isHistorique = false) => {
        return (
            <PaginatedTable
                getItems={page => paginate(data, page, itemsPerPage)}
                itemsPerPage={itemsPerPage}
                renderItem={(res: T) => reservationElement(res, isHistorique)}
                totalItems={data.length}
                header={reservationHeader(isHistorique)}
                { ...options }
            />
        );
    };

    return (
        <Accordion.Item eventKey={ props.eventKey }>
            <Accordion.Header>{ props.title }</Accordion.Header>
            <Accordion.Body>
                <Col className="mb-3 d-flex flex-column justify-content-center col px-5 pt-3">
                    <div className="mb-4">
                        <div className="row mb-3">
                            <p className="h4 col mb-0">Réservations en cours</p>
                        </div>
                        { reservationsTable(
                            reservationsEnCours,
                            {
                                getItems: () => reservationsEnCours,
                                hidePagination: true,
                                ifEmpty: "Aucune réservation en cours",
                            },
                        ) }
                    </div>
                    <div className="mb-4">
                        <div className="row mb-3">
                            <p className="h4 col mb-0">Historique</p>
                        </div>
                        { reservationsTable(
                            reservationsHistorique,
                            {
                                ifEmpty: "Aucune réservation dans l'historique",
                            },
                            true,
                        ) }
                    </div>
                </Col>
            </Accordion.Body>
        </Accordion.Item>
    );
};
