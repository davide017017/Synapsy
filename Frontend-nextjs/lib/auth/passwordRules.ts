export const PASSWORD_RULES_TEXT = 'Almeno 8 caratteri, una maiuscola e un numero';

export function isPasswordValid(p: string): boolean {
  return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(p);
}

