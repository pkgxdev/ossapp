<script lang="ts">
  import "$appcss";
  import { t } from "$libs/translations";

  type SortOption = "popularity" | "most recent";
  export let onSort: (opt: SortOption, dir: "asc" | "desc") => void;

  let sortBy: SortOption = "popularity";
  let sortDirection: "asc" | "desc" = "desc";

  const sortOptions: SortOption[] = ["popularity", "most recent"];

  const optionLabels = {
    [sortOptions[0]]: $t("sorting.popularity"),
    [sortOptions[1]]: $t("sorting.most-recent")
  };

  const setSortBy = (opt: SortOption) => {
    sortBy = opt;
    if (onSort) {
      onSort(sortBy, sortDirection);
    }
  };
  const setSortDir = (opt: SortOption, dir: "asc" | "desc") => {
    sortDirection = dir;
    setSortBy(opt);
  };
</script>

<section class="sorting-container text-gray bg-black">
  <div class="dropdown">
    <div class="dropdown-title">{$t("sorting.label")}</div>
    <ul class="dropdown-content column flex">
      {#each sortOptions as option}
        <li class="flex items-center">
          <button
            class="sort-btn"
            class:active={sortBy === option}
            on:click={() => setSortBy(option)}
          >
            {optionLabels[option]}
          </button>
          <div class="direction-arrows">
            <button
              on:click={() => setSortDir(option, "asc")}
              class={sortBy === option && sortDirection === "asc" ? "active" : ""}>&uarr;</button
            >
            <button
              on:click={() => setSortDir(option, "desc")}
              class={sortBy === option && sortDirection === "desc" ? "active" : ""}>&darr;</button
            >
          </div>
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
  .direction-arrows {
    float: right;
  }
  .direction-arrows button {
    opacity: 0.3;
  }
  .direction-arrows button.active {
    opacity: 1;
  }

  .sorting-container {
    display: inline-block;
    text-decoration: none;
    max-width: 240px;
    width: 100%;
    height: 100%;
    min-height: 30px;
    transition: 0.1s linear;
  }

  .dropdown {
    width: 100%;
    height: auto;
    position: relative;
    display: inline-block;
    cursor: pointer;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #1a1a1a;
    width: 100%;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    color: white;
    list-style: none;
    padding: 0px;
  }

  .dropdown-content li {
    position: relative;
    padding: 0px 10px;
    height: 32px;
    width: 100%;
    line-height: 36px;
  }

  .dropdown-content li .sort-btn {
    height: 100%;
    width: calc(100% - 40px);
    opacity: 0.6;
  }

  .dropdown-content li .sort-btn.active {
    font-weight: bold;
    opacity: 1;
  }

  .dropdown-content li .direction-arrows {
    position: absolute;
    right: 10px;
    top: 0px;
  }

  .dropdown-content li:hover {
    background: #00ffd0;
    color: black;
  }
  .dropdown:hover .dropdown-content {
    display: block;
  }

  .dropdown-title {
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
  }
</style>
