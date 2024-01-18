import './App.css';
import { AnnonceService } from './services/annonce-service';
import { Router } from './routes/router';
import { AuthenticationService } from './services/authentication-service';
import { ReservationService } from './services/reservation-service';
import { VehiculeService } from './services/vehicule-service';
import { GeolocationService } from './services/geolocation-service';
import { EmployeService } from './services/employe-service';
import { CategorieService } from './services/categorie-service';

export const AppContext =
{
	services:
	{
		annonce: new AnnonceService(),
		authentication: new AuthenticationService(),
		reservation: new ReservationService(),
		vehicule: new VehiculeService(),
        geolocation: new GeolocationService(),
		categorie: new CategorieService(),
		employe: new EmployeService(),
	},
};

const App = () =>
(
    <div className="App">
		<Router />
    </div>
);

export default App;
