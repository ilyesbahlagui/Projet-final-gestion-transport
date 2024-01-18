import { reviveObject } from "../lib/json";

// TODO: see how and where we'll persist the connection.
const getCookie = (name: string): string =>
{
	const cookies = document.cookie
		.split(';')
		.map(cookie => cookie.split('=').map(s => s.trim()));

	return cookies.find(c => c[0] === name)?.[1] || '';
}

export interface APIResponse<TData, TError = Error>
{
    data?: TData,
    error?: TError,
}

/** Base interface all model entities inherit from. */
export interface Entity
{
	id: number,
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export abstract class Service<T>
{
    public static readonly basePath = process.env.SERVER_PATH ?? "http://localhost:21394/api";

    protected readonly path: string;

    protected constructor(pathElem: string) {
        this.path = pathElem
            ? `${Service.basePath}/${pathElem}`
            : Service.basePath;
    }

    protected async request<TResponse = T, TRequest = T, TError = Error>(method: HttpMethod, pathVariable: string = '', requestData?: TRequest, params: RequestInit = {}): Promise<APIResponse<TResponse, TError>>
    {
        // TODO: Pre-emptively do a request to find the CSRF so user requests don't fail.
        const csrfToken = getCookie('XSRF-TOKEN');

        params =
        {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
			    'X-XSRF-TOKEN': csrfToken,
            },
            credentials: 'include',
            method,
            body: requestData && JSON.stringify(requestData),
            ...params,
        };

        const url = this.path + (pathVariable && "/" + pathVariable);
        const response = await fetch(url, params);
        const isOk = response.status >= 200 && response.status < 300;
        const responseData = JSON.parse(await response.text(), reviveObject);
        const apiResponse: APIResponse<TResponse, TError> =
        {
            data: isOk ? responseData : undefined,
            error: !isOk ? responseData : undefined,
        };

        return apiResponse;
    }

    public getAll(): Promise<APIResponse<T[]>>
    {
        return this.request('GET');
    }

    public getById(id: number): Promise<APIResponse<T>>
    {
        return this.request("GET", `${id}`);
    }

    public add(newEntity: Omit<T, "id">): Promise<APIResponse<T>>
    {
        return this.request("POST", '', newEntity);
    }

    public update(entity: Entity): Promise<APIResponse<T>>
    {
        return this.request("PUT", `${entity.id}`, entity);
    }

    public delete(entity: Entity): Promise<APIResponse<void>>
    {
        return this.request("DELETE", `${entity.id}`, { id: entity.id });
    }
}
