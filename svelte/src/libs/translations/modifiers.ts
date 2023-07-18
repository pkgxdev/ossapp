import type { Modifier } from "@sveltekit-i18n/parser-default";

export const test: Modifier.T = ({ value, defaultValue }) => `${value || defaultValue} 🥳`;
