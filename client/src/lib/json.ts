export const reviveObject = (key: string, value: any) =>
{
	if (value === null)
		return undefined;

	if (typeof(value) === 'string' && value.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/))
		return new Date(value);

	return value;
};
