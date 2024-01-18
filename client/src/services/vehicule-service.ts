import { VehiculeSociete } from "../models/vehicule-societe";
import { Service } from "./service";

export class VehiculeService extends Service<VehiculeSociete>
{
    public constructor() {
        super("vehicules");
    }
}
