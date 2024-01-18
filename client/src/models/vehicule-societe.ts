import { Entity } from "../services/service";

export interface VehiculeSociete extends Entity
{
    immatriculation: string,
    marque: string,
    modele: string,
    placeDisponible: number,
    photo: string,
    statut: StatutVehicule,
    categorieID: number,
    latitude: number,
    longitude: number,
}

export enum StatutVehicule
{
	EnService = "EN_SERVICE",
	EnReparation = "EN_REPARATION",
	HorsService = "HORS_SERVICE",
}
