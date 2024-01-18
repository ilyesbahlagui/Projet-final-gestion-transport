import { Employe } from "../models/employe";

export const paginate = <T>(list: T[], page: number, itemsPerPage: number): T[] =>
{
    const offset = page * itemsPerPage;
    return list.slice(offset, offset + itemsPerPage);
};

export const getFullName = (employe: Employe) => [employe.lastName.toUpperCase(), employe.firstName].join(' ');
