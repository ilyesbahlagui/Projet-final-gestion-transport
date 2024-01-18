import { EffectCallback, useEffect, useState } from "react";

export type ReactState<T> = [T, React.Dispatch<T>];

/**
 * Lazily loads a state's value given a promise.
 * @param promise The async function used to fetch the value. This is a callback to allow inline `async () => await` from the caller.
 * @param initialState The initial value to assign to the state while the promise gets resolved.
 * @returns The state's getter/setter.
 */
export const useStateAsync = <T>(promise: () => Promise<T>, initialState?: T): ReactState<T> =>
{
	const state = useState(initialState as T);

	useConstructor(() =>
	{
		promise().then(state[1]);
	});

	return state;
};

/** 
 * Runs the callback once on construction of the component.
 * 
 * The callback can return a callback that acts as a destructor.
 * 
 * This is a thin wrapper over useEffect, mainly to hush the `react-hooks/exhaustive-deps` warning.
 */
export const useConstructor = (effect: EffectCallback) =>
{
    // eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(effect, []);
};
