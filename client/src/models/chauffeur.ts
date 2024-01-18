import { Employe, ProfilEmploye } from "./employe";

export interface Chauffeur extends Employe {
    profil: ProfilEmploye.Chauffeur,
}
