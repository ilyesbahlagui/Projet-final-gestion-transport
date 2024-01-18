import { ReactNode } from "react";
import { Form } from "react-bootstrap";

export interface DatePickerProps
{
	onChange: (date: Date) => void,
}

export const DatePicker = ({onChange}: DatePickerProps) => (<Form.Control type="date" onChange={e => onChange(new Date(e.target.value))} />);

export interface LabelledDatePickerProps extends DatePickerProps
{
	label: ReactNode,
}

export const LabelledDatePicker = (props: LabelledDatePickerProps) =>
(
	<Form.Group>
		<Form.Label>{props.label}</Form.Label>
		<DatePicker {...props} />
	</Form.Group>
);
