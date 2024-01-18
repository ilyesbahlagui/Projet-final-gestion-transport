import { Container, Form } from "react-bootstrap";
import { ReservationProfessionnelle } from "../../models/reservation";
import { AppContext } from "../../App";
import { useStateAsync } from "../../lib/react";
import { useState } from "react";
import { LabelledDatePicker } from "../../components/date-picker";
import { stripTimeFromDay, nextDay } from "../../lib/date";
import { Line } from "react-chartjs-2";
import { ChartData, ChartOptions, Point, Chart as ChartJS, CategoryScale, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from "chart.js";

export const Occupation = () =>
{
	const [reservations] = useStateAsync(() => AppContext.services.reservation.chauffeur().listAssigned().then(r => r.data ?? []), []);
	const [startDate, setStartDate] = useState<Date>();
	const [endDate, setEndDate] = useState<Date>();

	const filteredReservations = reservations.filter(filterByRange(startDate, endDate));
	const averageOccupancy = getAverageOccupancy(filteredReservations);

	return (
		<Container>
			<h1 className="text-lg-start">Occupation</h1>
			<h3>Taux d'occupation moyen: {(averageOccupancy * 100).toFixed()}%</h3>
			<Form className="row row-cols-lg-auto g-3">
				<LabelledDatePicker label="Date de début" onChange={setStartDate} />
				<LabelledDatePicker label="Date de fin" onChange={setEndDate} />
			</Form>
			<hr />
			<DailyOccupancyChart items={filteredReservations} />
		</Container>
	);
};

const filterByRange = (start?: Date, end?: Date) =>
	(reservation: ReservationProfessionnelle) => (!start || reservation.dateDebut >= start) && (!end || reservation.dateFin <= end);

interface Occupancy
{
	day: Date,
	/** 0..1 */
	occupancy: number,
}

const getDailyOccupancy = (reservations: ReservationProfessionnelle[]) =>
{
	const dailyOccupancy: Occupancy[] = [];

	if (reservations.length === 0)
		return dailyOccupancy;

	const latestDay = new Date(reservations
		.map(r => r.dateFin.getTime())
		.sort()
		.reverse()[0]);
	const day = stripTimeFromDay(new Date(reservations
		.map(r => r.dateDebut.getTime())
		.sort()[0]));
	const oneDay = new Date(8.64e+7);

	while (day < latestDay) // FIXME: SLOW AS BALLS FOR BIG N.
	{
		const duration = reservations
			.filter(filterByRange(day, nextDay(day))) // Match this day.
			.map(r => new Date(r.dateFin.getTime() - r.dateDebut.getTime())) // Get duration.
			.map(d => d.getTime() > oneDay.getTime() ? oneDay : d) // Clamp to one day.
			.reduce((last, value) => new Date(last.getTime() + value.getTime()), new Date(0)); // Sum duration.

		dailyOccupancy.push(
		{
			day: new Date(day),
			occupancy: duration.getTime() / oneDay.getTime(),
		});
		day.setDate(day.getDate() + 1);
	}
	
	return dailyOccupancy;
}

const getAverageOccupancy = (reservations: ReservationProfessionnelle[]) =>
{
	const occupancy = getDailyOccupancy(reservations);
	return occupancy.reduce((last, value) => last + value.occupancy, 0) / occupancy.length;
};

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
);

interface DailyOccupancyChartProps
{
	items: ReservationProfessionnelle[],
}

export const DailyOccupancyChart = ({items}: DailyOccupancyChartProps) =>
{
	const dailyOccupancy = getDailyOccupancy(items);
	const data: ChartData<'line', (number | Point | null)[], unknown> =
	{
		labels: dailyOccupancy.map(o => o.day.toLocaleDateString()),
		datasets:
		[{
			data: dailyOccupancy.map(o => o.occupancy * 100),
			borderColor: 'rgb(53, 162, 235)',
			backgroundColor: 'rgba(53, 162, 235, 0.5)',
		}],
	};
	const options: ChartOptions =
	{
		plugins:
		{
			title:
			{
				display: true,
				text: "Taux d'occupation",
				font:
				{
					size: 20,
				}
			},
			legend:
			{
				display: false,
			}
		}
	};

	return (<Line options={options} data={data} />);
};
