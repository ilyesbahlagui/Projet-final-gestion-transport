import { AppContext } from "../App";
import { Annonce, StatutAnnonce } from "../models/annonce";
import { Reservation, ReservationCovoiturage, ReservationProfessionnelle } from "../models/reservation";
import { APIResponse, Service } from "./service";

export class ReservationService<T extends Reservation = Reservation> extends Service<T>
{
    covoiturage() { return new ReservationCovoiturageService(); }

    professionnelle() { return new ReservationProfessionnelleService(); }

    chauffeur() { return new ChauffeurReservationService(); }

    constructor(subPath?: string) {
        super('reservations' + (subPath && `/${subPath}`));
    }
}

class ReservationCovoiturageService extends ReservationService<ReservationCovoiturage>
{
    constructor()
    {
        super('covoiturage');
    }

    async reserve(annonce: Annonce): Promise<void>
    {
        await this.add({annonceID: annonce.id, statut: StatutAnnonce.Confirmé, employeID: AppContext.services.authentication.employe!.id});
    }

    async cancel(reservation: ReservationCovoiturage): Promise<APIResponse<ReservationCovoiturage>>
    {
        return this.request('POST', `cancel/${reservation.id}`);
    }
}

class ReservationProfessionnelleService extends ReservationService<ReservationProfessionnelle>
{
    constructor()
    {
        super('professionnelle');
    }

    public findByVehicule(vehiculeID: number): Promise<APIResponse<ReservationProfessionnelle[]>>
    {
        return this.request("GET", 'vehicule/' + vehiculeID);
    }
}

class ChauffeurReservationService extends ReservationService<ReservationProfessionnelle>
{
    constructor()
    {
        super('chauffeur');
    }

    async listAssigned(): Promise<APIResponse<ReservationProfessionnelle[]>>
    {
        return this.request('GET', 'assigned');
    }

    async listUnassigned(): Promise<APIResponse<ReservationProfessionnelle[]>>
    {
        return this.request('GET', 'unassigned');
    }

    async accept(reservation: ReservationProfessionnelle): Promise<APIResponse<ReservationProfessionnelle>>
    {
        return this.request('POST', `accept/${reservation.id}`);
    }
}
