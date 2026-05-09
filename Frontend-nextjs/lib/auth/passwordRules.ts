export const PASSWORD_RULES_TEXT = 'Almeno 8 caratteri, una maiuscola e un numero';

export function isPasswordValid(p: string): boolean {
    return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(p);
}

export interface PasswordRules {
    len: boolean;
    upper: boolean;
    num: boolean;
    special: boolean;
}

export function validatePassword(p: string): { ok: boolean; rules: PasswordRules } {
    const rules: PasswordRules = {
        len: p.length >= 8,
        upper: /[A-Z]/.test(p),
        num: /\d/.test(p),
        special: /[^A-Za-z0-9]/.test(p),
    };
    return { ok: rules.len && rules.upper && rules.num, rules };
}

export function passwordStrength(p: string): number {
    return [p.length >= 8, /[A-Z]/.test(p), /\d/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length;
}

