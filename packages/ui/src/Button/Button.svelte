<script type="ts">
  import './button.css';
  import { createEventDispatcher } from 'svelte';
  /**
   * Is this the principal call to action on the page?
   */
  export let primary = false;

  /**
   * What background color to use
   */
  export let backgroundColor:string = '';
  /**
   * How large should the button be?
   */
  export let size:string = 'medium';
  /**
   * Button contents
   */
  export let label:string = '';

  $: mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';

  $: style = backgroundColor ? `background-color: ${backgroundColor}` : '';

  const dispatch = createEventDispatcher();

  /**
   * Optional click handler
   */
  export let onClick = (event: any) => {
    dispatch('click', event);
  };
</script>

<button
  type="button"
  class={['storybook-button', `storybook-button--${size}`, 'hover:font-light', mode].join(' ')}
  {style}
  on:click={onClick}
>
  {label}
</button>
