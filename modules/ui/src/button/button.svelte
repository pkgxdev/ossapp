<script lang="ts">
  let clazz = "";
  export { clazz as class };

  // export let size: 'large' | 'medium' | 'small' = 'medium';

  export let onClick: undefined | ((evt?: MouseEvent) => void) = undefined;
  export let active = false;

  export let type: "outline" | "ghost" | "plain" = "ghost";
  export let color: "primary" | "secondary" | "green" | "black" | "blue" = "primary";

  export let loading = false;
</script>

<div class="button-container">
  <button
    data-testid={$$props["data-testid"] || "button"}
    type="button"
    class="w-full text-gray {clazz} {type} {color}"
    class:active
    class:animate-pulse={loading}
    on:click={(evt) => onClick && onClick(evt)}
  >
    <slot />
  </button>
</div>

<style>
  .button-container {
    position: relative;
    min-width: 100px;
    width: 100%;
    height: 100%;
  }

  /* pseudo element for hover effect - width will transition on hover */
  button::before {
    position: absolute;
    content: "";
    transition-duration: 0.2s;
    z-index: -1;
    inset: 0px auto auto 0px;
    width: 0px;
    height: 100%;
    opacity: 1;
  }

  button:hover::before {
    width: 100%;
    height: 100%;
    opacity: 1;
  }

  button {
    z-index: 0;
    position: relative;
  }

  button:hover {
    transition: color 0.3s ease 0s, background 0s ease 0.3s;
  }

  /* primary */
  button.plain.primary {
    background: #00ffd0;
    border: 1px solid #00ffd0;
    color: black;
  }

  button.plain.primary.active {
    background: #01997d;
  }

  button.plain.primary:active {
    background: #01997d;
  }

  button.plain.primary:active::before {
    background: #01997d;
  }

  button.primary::before {
    background: #0ecaa7;
  }

  button.ghost.primary:hover {
    color: white;
  }

  /* secondary */
  button.plain.secondary {
    background: #8000ff;
    border: 1px solid #8000ff;
    color: white;
  }

  button.plain.secondary.active {
    background: #410182;
  }

  button.plain.secondary:active {
    background: #410182;
  }

  button.plain.secondary:active::before {
    background: #410182;
  }

  button.secondary::before {
    background: #6000bf;
  }

  /* green */
  button.plain.green {
    background: #00a517;
    color: white;
  }

  button.green::before {
    background: #8000ff;
  }

  /* black */
  button.plain.black {
    background: #1a1a1a;
    color: white;
    border: 1px solid white;
  }

  button.black::before {
    background: white;
  }

  button.plain.black:active {
    background: #e1e1e1;
  }

  button.plain.black:active::before {
    background: #e1e1e1;
  }

  /* black button inverts colors on hover */
  button.black:hover {
    color: #1a1a1a;
    background: white;
  }

  /* blue */
  button.plain.blue {
    background: #2675f5;
    border: 1px solid #2675f5;
    color: white;
  }

  button.blue::before {
    background: #013b99;
  }

  button.plain.blue:active {
    background: #012765;
  }

  button.plain.blue:active::before {
    background: #012765;
  }
</style>
