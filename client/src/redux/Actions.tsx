import { LOAD_EMAIL, LOAD_SUBPAGE } from './Constants';

export const loadEmail = (email: string): { type: string; email: string } => ({
    type: LOAD_EMAIL,
    email: email,
});

export const loadSubpage = (subpage: string): { type: string; subpage: string } => ({
    type: LOAD_SUBPAGE,
    subpage: subpage,
});
