import { Annonce } from "../models/annonce";
import { APIResponse, Service } from "./service";

export class AnnonceService extends Service<Annonce>
{
    public constructor() {
        super("annonces");
    }

    async cancel(annonce: Annonce): Promise<APIResponse<Annonce>>
    {
        return this.request('POST', `cancel/${annonce.id}`);
    }
}
