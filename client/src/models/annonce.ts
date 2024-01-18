import { Entity } from "../services/service";

export interface Annonce extends Entity
{
	adresseDepart: string,
	adresseDestination: string,
	immatriculation: string,
	marque: string,
	modele: string,
	placeDisponible: number,
	date: Date,
	statut: StatutAnnonce,
    employeID: number,
}

export enum StatutAnnonce
{
	Confirmé = 'CONFIRME',
	Annulé = 'ANNULE',
	Terminé = 'TERMINE',
}

export function getStatutAnnonceKey(statut: StatutAnnonce) {
    return (Object.keys(StatutAnnonce) as (keyof typeof StatutAnnonce)[])[Object.values(StatutAnnonce).indexOf(statut)]
}
