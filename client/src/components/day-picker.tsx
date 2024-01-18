import { faCircleChevronLeft, faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Stack } from "react-bootstrap";
import { ReactState } from "../lib/react";

const offsetDate = (date: Date, days: number) =>
{
	date = new Date(date.getTime());
	date.setDate(date.getDate() + days);
	return date;
}

export interface DayPickerProps
{
	day: ReactState<Date>,
}

export const DayPicker = ({day}: DayPickerProps) =>
(
	<Stack direction="horizontal" gap={3}>
		<FontAwesomeIcon onClick={() => day[1](offsetDate(day[0], -1))} icon={faCircleChevronLeft} size="2x" />
		<em>{day[0].toLocaleDateString()}</em>
		<FontAwesomeIcon onClick={() => day[1](offsetDate(day[0], 1))} icon={faCircleChevronRight} size="2x"/>
	</Stack>
);
