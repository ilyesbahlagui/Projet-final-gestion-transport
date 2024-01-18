import { Entity } from "../services/service";

export interface Employe extends Entity
{
	matricule: string,
	email: string,
	firstName: string,
    lastName: string,
    profil: ProfilEmploye,
    phone: string,
    permis: string,
    photo: string,
}

export enum ProfilEmploye
{
    Collaborateur = 'COLLABORATEUR',
    Chauffeur = 'CHAUFFEUR',
    Administrateur = 'ADMINISTRATEUR',
}
