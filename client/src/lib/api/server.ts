interface IBody<TVariables> {
    query: string;
    variables?: TVariables;
}

interface IError {
    message: string;
}

export const server = {
    fetch: async <TData = any, TVariables = any> (body: IBody<TVariables>) => {
        const res = await fetch("http://localhost:9000/api", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        if(!res.ok) {
            throw new Error('failed to fetch from server');
        }

        return res.json() as Promise<{data: TData, errors: IError[]}>;
    }
};
