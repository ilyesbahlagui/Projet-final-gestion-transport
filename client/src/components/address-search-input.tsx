import { useRef } from "react";
import { AppContext } from "../App";
import Autocomplete from "../lib/bootstrap-autocomplete/bootstrap-autocomplete";
import { AutocompleteResponse, Location } from "../lib/geo-api-types";
import { useConstructor } from "../lib/react";

interface AddressSearchInputProps {
    inputId: string;
    onPick: (location: Location) => void;
}

export const AddressSearchInput = (props: AddressSearchInputProps) => {

    const searchInputRef = useRef<HTMLInputElement>(null);

    const getAddressLatLng = async (addressId: string) => {
        return AppContext.services.geolocation.fetchAddressLocation(addressId)
            .catch(err => { throw err });
    };

    useConstructor(() => {
        const elem = searchInputRef.current;
        if (!elem)
            return;
        const autocomplete = new Autocomplete<AutocompleteResponse>(elem, {
            preProcess: (res) => {
                return res.predictions.map((result) => ({ text: result.description, dataValue: result.public_id }));
            },
            filter: AppContext.services.geolocation.getAutocompleteURL('#QUERY#').toString(),
            filterDelay: 700,
            filterMinChars: 3,
            maxResult: 6,
            onPick: async (_, item) => {
                const addressId = item.getAttribute("data-value");
                if (!addressId)
                    return;
                props.onPick(await getAddressLatLng(addressId));
            },
        });
        return () => {
            autocomplete.dispose();
        };
    });

    return (
        <>
            <input
                type="text"
                className="form-control"
                id={ props.inputId }
                ref={ searchInputRef } />
        </>
    );
};
