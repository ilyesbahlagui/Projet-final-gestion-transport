import { BrowserRouter, Navigate, Route, RouteProps, Routes } from "react-router-dom";
import { Login } from "./login/login";
import { NavMenu } from "../components/nav-menu";
import { ListeReservation } from "./collaborateur/reservations/liste-reservation";
import { useEffect, useState } from "react";
import { Maybe } from "../lib/types";
import { Employe, ProfilEmploye } from "../models/employe";
import { AppContext } from "../App";
import { AnnonceCreate } from "./collaborateur/annonces/annonce-create";
import { CreerReservation } from "./collaborateur/reservations/creer-reservation";
import Chauffeurs from "./admin/chauffeurs/chauffeurs";
import Vehicules from "./admin/vehicules/vehicules";
import DetailsVehicule from "./admin/vehicules/vehicule-detail";
import GeolocalisationVehicules from "./admin/vehicules/geolocalisation/geolocalisation-vehicules";
import { Planning } from "./chauffeur/planning";
import { Occupation } from "./chauffeur/occupation";
import { AnnoncesListes } from "./collaborateur/annonces/annonces-listes";

const collaborateurRoutes: RouteProps[] =
[
	{path: "*", element: <Navigate to='collaborateur/annonces' />},
	{path: "collaborateur/annonces", element: <AnnoncesListes />},
	{path: "collaborateur/annonces/creer", element: <AnnonceCreate />},
	{path: "collaborateur/reservations", element: <ListeReservation />},
	{path: "collaborateur/reservations/creer", element: <CreerReservation />},
	{path: "collaborateur/statistiques", element: "STATISTIQUES"},
];
const chauffeurRoutes: RouteProps[] =
[
	{path: "*", element: <Navigate to='chauffeur/planning' />},
	{path: "chauffeur/occupation",  element: <Occupation />},
	{path: "chauffeur/planning",  element: <Planning />},
];
const adminRoutes: RouteProps[] =
[
	{path: "*", element: <Navigate to='admin/chauffeurs' />},
	{path: "admin/chauffeurs", element: <Chauffeurs />},
	{path: "admin/vehicules", element: <Vehicules />},
	{path: "admin/vehicules/:id", element: <DetailsVehicule />},
	{path: "admin/vehicules/geolocalisation", element: <GeolocalisationVehicules />},
];

const routesPerUser = new Map<ProfilEmploye, RouteProps[]>
([
	[ProfilEmploye.Collaborateur, collaborateurRoutes],
	[ProfilEmploye.Chauffeur, chauffeurRoutes],
	[ProfilEmploye.Administrateur, adminRoutes],
]);

export const Router = () =>
{
	const [employe, setEmploye] = useState<Maybe<Employe>>();
	const [selectedProfile, setSelectedProfile] = useState<Maybe<ProfilEmploye>>();

	useEffect(() =>
	{
		const subscription = AppContext.services.authentication.onAuthenticationChanged().subscribe(setEmploye);

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	const handleProfileSelection = (selectedProfile: ProfilEmploye) => {
		setSelectedProfile(selectedProfile);
	};

	const handleLogout = () => {
		AppContext.services.authentication.logout();
		setSelectedProfile(undefined);
	};

	const getRoutes = (): RouteProps[] =>
	{
		if (!selectedProfile)
			return [{path: "*", element: <Login onProfileSelection={handleProfileSelection} />}];

		return routesPerUser.get(selectedProfile)!;
	}

	return (
		<BrowserRouter>
			{employe && <NavMenu onLogout={handleLogout}/>}
			<Routes>{getRoutes().map(r => <Route key={r.path} {...r} />)}</Routes>
		</BrowserRouter>
	);
};
