import { useEffect, useRef } from "react";
import { AppContext } from "../App";
import Autocomplete from "../lib/bootstrap-autocomplete/bootstrap-autocomplete";
import { AutocompleteResponse, Location } from "../lib/geo-api-types";

interface AddressSearchInputProps {
  inputId: string;
  onPick: (option: Location) => void;
  onInputChange: (value: string) => void;
  
}

export const AddressSearchInput = (props: AddressSearchInputProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    props.onInputChange(newValue);
  };

  const getAddressLocation = async (addressId: string): Promise<Location> => {
    return AppContext.services.geolocation
      .fetchAddressLocation(addressId)
      .catch(err => {
        throw err;
      });
  };

  useEffect(() => {
    const elem = searchInputRef.current;
    if (!elem) return;
    const autocomplete = new Autocomplete<AutocompleteResponse>(elem, {
      preProcess: res => {
        return res.predictions.map(result => ({
          text: result.description,
          dataValue: result.public_id,
        }));
      },
      filter: AppContext.services.geolocation.getAutocompleteURL("#QUERY#").toString(),
      filterDelay: 700,
      filterMinChars: 3,
      maxResult: 6,
      onPick: async (_, item) => {
        const addressId = item.getAttribute("data-value");
        if (!addressId) return;
        props.onPick(await getAddressLocation(addressId));
      },
    });
    return () => {
      autocomplete.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <input
        type="text"
        className="form-control"
        id={props.inputId}
        ref={searchInputRef}
        onChange={handleChange}
      />
    </>
  );
};
