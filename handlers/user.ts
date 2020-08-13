import { associate, graph, login, register } from '@routes/0.0.1/user';

export const mfa = associate;
export const query = graph;
export const session = login;
export const signup = register;