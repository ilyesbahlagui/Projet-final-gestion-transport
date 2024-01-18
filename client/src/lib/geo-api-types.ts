export interface GeoApiResponse {
    status: string;
    error_message: string;
}

export interface AutocompleteResult {
    description: string;
    public_id: string;
}

export interface AutocompleteResponse extends GeoApiResponse {
    predictions: AutocompleteResult[];
}

export interface Location
{
    lat: number,
    lng: number,
    address: string,
}

export interface AddressDetails {
    formatted_address: string;
    geometry: {
        location: Location,
    };
}

export interface DetailsResponse extends GeoApiResponse {
    result: AddressDetails;
}

export interface RouteData {
    legs: {
        distance: {
            text: string,
        },
        duration: {
            text: string,
        },
    }[];
}

export interface RouteResponse extends GeoApiResponse {
    routes: RouteData[];
}
