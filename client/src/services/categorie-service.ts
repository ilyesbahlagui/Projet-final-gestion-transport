import { Categorie } from "../models/categorie-vehicule";
import { Service } from "./service";

export class CategorieService extends Service<Categorie>
{
    public constructor() {
        super("categories");
    }
}
