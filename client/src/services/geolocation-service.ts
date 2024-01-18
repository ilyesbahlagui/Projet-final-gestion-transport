import { AutocompleteResponse, DetailsResponse, Location, RouteData, RouteResponse } from "../lib/geo-api-types";

export class GeolocationService {

    static readonly BASE_URL = new URL('https://api.woosmap.com/');

    private getRequestURL(path: string): URL
    {
        const url = new URL(path, GeolocationService.BASE_URL);
        url.searchParams.append('key', process.env.REACT_APP_GEOLOCATION_API_KEY!);
        url.searchParams.append('language', 'fr');

        return url;
    }

    getAutocompleteURL(query: string): URL
    {
        const url = this.getRequestURL('address/autocomplete/json');
        url.searchParams.append('input', query);
        url.searchParams.append('components', 'country:FR');

        return url;
    }

    async autocomplete(query: string): Promise<AutocompleteResponse>
    {
        const response = await fetch(this.getAutocompleteURL(query));
        const data = await response.json() as AutocompleteResponse;

        return data;
    }

    public async fetchAddressLocation(addressId: string): Promise<Location> {
        const url = this.getRequestURL('address/details/json');
        url.searchParams.append('public_id', addressId);
        url.searchParams.append('fields', 'geometry');

        return fetch(url)
            .then(res => res.json())
            .then((data: DetailsResponse) => {
                if (data.status !== "OK")
                    throw data.status;
                return { ...data.result.geometry.location, address: data.result.formatted_address };
            })
            .catch(err => { throw err });
    }

    public async fetchRouteData(origin: Location, destination: Location): Promise<RouteData> {
        const formatLocation = (location: Location) => `${location.lat},${location.lng}`;

        const url = this.getRequestURL('distance/route/json');
        url.searchParams.append('origin', formatLocation(origin));
        url.searchParams.append('destination', formatLocation(destination));

        return fetch(url)
            .then(res => res.json())
            .then((data: RouteResponse) => {
                if (data.status !== "OK")
                    throw data.error_message;
                if (!data.routes.length)
                    throw Error("Aucun trajet disponible");
                return data.routes[0];
            })
            .catch(err => { throw err });
    }
}
