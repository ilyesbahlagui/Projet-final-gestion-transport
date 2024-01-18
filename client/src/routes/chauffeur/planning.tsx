import { useState } from "react";
import { Container, Stack, Table } from "react-bootstrap";
import { useStateAsync } from "../../lib/react";
import { ReservationProfessionnelle } from "../../models/reservation";
import { AppContext } from "../../App";
import { getFullName } from "../../lib/utils";
import { DayPicker } from "../../components/day-picker";
import { isSameDay } from "../../lib/date";

export const Planning = () =>
{
	const [day, setDay] = useState(new Date());
	const [reservations, setReservations] = useStateAsync(() => Promise.all(
		[
			AppContext.services.reservation.chauffeur().listAssigned(),
			AppContext.services.reservation.chauffeur().listUnassigned(),
		])
		.then(r => r.flatMap(x => x.data ?? [])), []);

	const getReservations = () => reservations.filter(r => isSameDay(r.dateDebut, day));
	const onAccept = (reservation: ReservationProfessionnelle) => AppContext.services.reservation.chauffeur()
		.accept(reservation)
		.then(response =>
		{
			if (response.error)
			{
				alert(response.error.message);
				return;
			}

			let reservation = reservations.find(r => r.id === response.data!.id);
			
			if (reservation)
				Object.assign(reservation, response.data!);
			else
				reservation = response.data!;

			setReservations([...reservations]);
		});

	return (
		<Container>
			<h1 className="text-lg-start">Planning</h1>

			<DayPicker day={[day, setDay]} />

			<ReservationTable reservations={getReservations()} onAccept={onAccept} />
		</Container>
	);
}

interface ReservationElementProps<T extends ReservationProfessionnelle = ReservationProfessionnelle> // Other types ? No.
{
	reservation: T, // No status ? Accepted if chauffeur == self
	onAccept: (reservation: T) => void,
}

const ReservationElement = ({reservation, onAccept}: ReservationElementProps) =>
{
	const [vehicule] = useStateAsync(() => AppContext.services.vehicule.getById(reservation.vehiculeID));
	const [responsable] = useStateAsync(() => AppContext.services.employe.getById(reservation.employeID));

	const isAssigned = reservation.conducteurID !== undefined;
	const dateRange = [reservation.dateDebut, reservation.dateFin]
		.map(d => d.toLocaleTimeString())
		.join(' - ');
	const accept = isAssigned
		? 'Accepté'
		: <button onClick={() => onAccept(reservation)} className="btn btn-success">Accepter la demande</button>;
	const details = 
		<Stack className="px-3">
			<span>Responsable: {responsable?.data && getFullName(responsable.data)}</span>
			<span>Téléphone: {responsable?.data?.phone}</span>
			<span>Véhicule: {vehicule?.data?.immatriculation}</span>
		</Stack>;

	return (
		<Stack key={reservation.id} gap={1} className={`border ${isAssigned ? 'bg-primary' : 'bg-secondary'}`}>
			<em>{dateRange}</em>
			{details}
			{accept}
		</Stack>
	);
};

interface ReservationTableProps<T extends ReservationProfessionnelle = ReservationProfessionnelle>
{
	reservations: T[],
	onAccept: (reservation: T) => void,
}

const ReservationTable = ({reservations, onAccept}: ReservationTableProps) =>
{
	const makeRow = (hour: number) =>
	{
		const reservation = reservations.find(r => r.dateDebut.getHours() === hour);

		return (
			<tr>
				<td>{hour}h00</td>
				<td>{reservation && <ReservationElement reservation={reservation} onAccept={onAccept} />}</td>
			</tr>
		)
	};

	return (
		<Table striped>
			<thead>
				<tr>
					<th>Heure</th>
					<th>Réservation</th>
				</tr>
			</thead>
			<tbody>
				{Array.from(Array(24).keys()).map(hour => makeRow(hour))}
			</tbody>
		</Table>
	)
};
