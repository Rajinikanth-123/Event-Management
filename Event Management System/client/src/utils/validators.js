export const isStrongPassword = (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value || '');

export const validateEmail = (value) => /^\S+@\S+\.\S+$/.test(value || '');

export const required = (value) => Boolean(String(value || '').trim());