import { Chauffeur } from "../models/chauffeur";
import { Employe, ProfilEmploye } from "../models/employe";
import { APIResponse, Service } from "./service";

const driverProfiles: ProfilEmploye[] =
[
    ProfilEmploye.Chauffeur,
    ProfilEmploye.Administrateur,
];

export class EmployeService extends Service<Employe>
{
    public constructor() {
        super("employe");
    }

    // TODO: server-side query ?
    public async getDrivers(): Promise<Chauffeur[]>
    {
        const response = await this.getAll();
        const drivers = response.data?.filter(e => driverProfiles.includes(e.profil)) ?? [];

        return drivers as Chauffeur[];
    }

    public setChauffeur(matricule: string): Promise<APIResponse<Chauffeur>>
    {
        return this.request("POST", matricule + '/chauffeur');
    }
}
