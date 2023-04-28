// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
  // interface Locals {}
  // interface PageData {}
  // interface Error {}
  // interface Platform {}
}

// Declare custom event handlers here to make typscript happy.
declare namespace svelte.JSX {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    onclick_outside?: () => void;
    onleave_delay?: () => void;
  }
}
