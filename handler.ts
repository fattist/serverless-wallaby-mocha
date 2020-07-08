import { defaults } from '@routes/0.0.1';
import { authorize } from '@authorizers/auth0';

export const index = defaults.index;
export const authenticate = authorize;