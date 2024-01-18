export interface AutocompleteOptions<T = any> {
    list?: string | HTMLElement;
    prefetch?: string;
    filter?: string;
    filterDelay?: number;
    filterMinChars?: number;
    filterRelation?: object;
    maxResult?: number;
    preProcess?: (res: T) => { text: string, dataValue: string }[];
    onPick?: (input: HTMLElement, item: HTMLAnchorElement) => void;
    onItemRendered?: () => void;
}

class Autocomplete<T = any> {
    readonly _config: Required<AutocompleteOptions>;
    constructor(element: HTMLElement, config: AutocompleteOptions<T>);
    _findFromAjax(): void;
    dispose(): void;
}

export default Autocomplete;
