import { BehaviorSubject, Observable } from "rxjs";
import { AuthenticationData } from "../models/authentication-data";
import { Employe } from "../models/employe";
import { APIResponse, Service } from "./service";
import { Maybe } from "../lib/types";

export class AuthenticationService extends Service<Employe>
{
    private onAuthenticationChangedSubject = new BehaviorSubject<Maybe<Employe>>(undefined);
    employe?: Employe;

    public constructor() {
        super("");
    }

    onAuthenticationChanged(): Observable<Maybe<Employe>>
    {
        return this.onAuthenticationChangedSubject.asObservable();
    }

    // TODO: EmployeService calls this and sets its public user.
    async login(authentication: AuthenticationData): Promise<APIResponse<Employe>>
    {
        const response = await this.request('POST', 'login', authentication);

        // TODO: Check for errors.
        this.onAuthenticationChangedSubject.next(this.employe = response.data!);

        return response;
    }

    logout(): void
    {
        this.onAuthenticationChangedSubject.next(this.employe = undefined);
        // TODO: Clear cookies.
    }
}
