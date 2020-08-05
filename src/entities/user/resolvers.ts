import { User } from '@services/user';

const service = new User();

export const resolvers = {
    user: async (payload: unknown): Promise<unknown> => {
        let data;

        try {
            data = await service.execute('get', payload);
        } catch (error) {
            console.log(error);
            return new Error(error);
        }

        return data;
    }
}