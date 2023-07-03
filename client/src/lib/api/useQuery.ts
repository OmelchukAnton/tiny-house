import { useEffect, useCallback, useReducer } from "react"
import { server } from "./server"

interface IState<TData> {
    data: TData | null;
    loading: boolean;
    error: boolean;
}

type Action<TData> =
    | { 'FETCH '}
    | { 'FETCH_SUCCESS', payload: TData }
    | { FETCH_ERROR };

interface QueryResult<TData> extends IState<TData>{
    refetch: () => void;
}

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

export const useQuery = <TData = any>(query: string): QueryResult<TData> => {
    const fetchReducer = reducer<TData>();
    const [state, dispatch] = useReducer(fetchReducer, {
        data: null,
        loading: false,
        error: false
    });

    const fetch = useCallback(() => {
        const fetchApi = async () => {
            try {
                dispatch({type: 'FETCH'});
                const { data, errors } = await server.fetch<TData>({ query })

                if(errors && errors.length) {
                    throw new Error(errors[0].message);
                }
                dispatch({type: 'FETCH_SUCCESS', payload: data});
            } catch(err) {
                dispatch({type: 'FETCH_ERROR'});
                throw console.error(err);
            }

        };

        fetchApi();
    }, [query]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return {...state, refetch: fetch};
};

