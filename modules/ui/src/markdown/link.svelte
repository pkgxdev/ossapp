<script>
  import he from "he";
  export let href = "";
  export let title = "";
  let isBlank = href.includes("http") || href.includes("https");
  let isEmail = href.includes("mailto");
  console.log("href", href);

  const email = isEmail ? he.decode(href.replace("mailto:", "")) : "";
</script>

<a href={email ? `mailto:${email}` : href} {title} target={isBlank ? "_blank" : ""} rel="">
  {#if isEmail}
    {email}
  {:else}
    <slot />
  {/if}
</a>
