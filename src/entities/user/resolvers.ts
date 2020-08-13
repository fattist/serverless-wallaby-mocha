import { User } from '@services/user';

let data;
const service = new User();

export const resolvers = {
    register: async (payload: { [key: string]: string }): Promise<unknown> => {
        try {
            const user = await service.register(payload);
            data = await service.execute('put', { ...payload, sub: `auth0|${user['_id']}`});
        } catch (error) {
            const msg = error.message || `${error.name}[${error.code}]: ${error.description}`;
            console.error(error);
            return new Error(msg);
        }

        return data;
    },
    user: async (payload: unknown): Promise<unknown> => {
        try {
            data = await service.execute('get', payload);
        } catch (error) {
            console.error(error);
            return new Error(error);
        }

        return data;
    }
}