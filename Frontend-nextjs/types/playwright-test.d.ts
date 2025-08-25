// Minimal declarations for @playwright/test to satisfy TypeScript
// during type checking. The real library provides rich typings, but
// here we only need basic placeholders.
declare module "@playwright/test" {
    export const test: any;
    export const expect: any;
    export const devices: any;
    export function defineConfig(config: any): any;
}
