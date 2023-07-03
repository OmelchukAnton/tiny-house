import { useReducer } from 'react';
import { server } from "./server";

interface IState<TData> {
    data: TData | null;
    loading: boolean;
    error: boolean;
}

type Action<TData> =
    | { 'FETCH '}
    | { 'FETCH_SUCCESS', payload: TData }
    | { FETCH_ERROR };

type MutationTuple<TData, TVariables> = [
    (variables?: TVariables | undefined) => Promise<void>, IState<TData>
];

const reducer = <TData>() => (state: IState<TData>, action: Action<TData>): IState<TData> => {
    switch (action.type) {
        case 'FETCH':
            return { ...state, loading: true }
        case 'FETCH_SUCCESS':
            return { data: action.payload, loading: false, error: false}
        case 'FETCH_ERROR':
            return { ...state, loading: false, error: true }
        default:
            throw new Error();
    }
}

export const useMutation = <TData = any, TVariables = any>(
        query: string
    ): MutationTuple<TData, TVariables> => {
    const fetchReducer = reducer<TData>();
    const [state, dispatch] = useReducer(fetchReducer, {
        data: null,
        loading: false,
        error: false
    });

    const fetch = async (variables?: TVariables) => {
        try {
            dispatch({type: 'FETCH'});

            const { data, errors } = await server.fetch<TData, TVariables>({query, variables});

            if(errors && errors.length) {
                throw new Error(errors[0].message);
            }

            dispatch({type: 'FETCH_SUCCESS', payload: data});
        } catch(err) {
            dispatch({type: 'FETCH_ERROR'});
            throw console.error(err);
        }
    };

    return [fetch, state]
}

