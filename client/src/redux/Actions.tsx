import { LOAD_EMAIL } from './Constants';

export const loadEmail = (email: string): { type: string; email: string } => ({
    type: LOAD_EMAIL,
    email: email,
});
