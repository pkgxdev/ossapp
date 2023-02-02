<script>
  let count = 0;

  const increment = () => {
    count += 1;
  };
</script>

<button class="button" on:click={increment}>
  Clicks: {count}
</button>
