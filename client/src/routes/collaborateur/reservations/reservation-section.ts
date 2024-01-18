export enum ReservationSection {
    Covoiturage = "covoiturage",
    Vehicule = "vehicule",
}

export function getActiveSection(urlParams: URLSearchParams) {
    return urlParams.get("section") as ReservationSection ?? ReservationSection.Covoiturage;
}
