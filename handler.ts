import { routes } from '@routes/0.0.1';
import { authorize } from '@authorizers/auth0';

export const authenticate = authorize;

export const index = routes.index;
export const register = routes.register;