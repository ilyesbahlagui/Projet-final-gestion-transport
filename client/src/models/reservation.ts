import { Entity } from "../services/service";
import { StatutAnnonce } from "./annonce";

export interface Reservation extends Entity
{
    employeID: number,
}

export interface ReservationCovoiturage extends Reservation
{
	statut: StatutAnnonce,
	annonceID: number,
}

export interface ReservationProfessionnelle extends Reservation
{
    dateDebut: Date,
    dateFin: Date,
    conducteurID?: number,
    vehiculeID: number,
    needsChauffeur: boolean,
}
