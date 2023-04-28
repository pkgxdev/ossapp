<script lang="ts">
  import "../app.css";
  import type { Review } from "../types";

  export let review: Review;

  const getStarType = () => {
    let star = "full";
    if (review.rating < 3) {
      star = "empty";
    } else if (review.rating < 4) {
      star = "half";
    }
    return `icon-star-${star}`;
  };

  const getStarLabel = () => {
    let label = "DELIGHTFUL";
    if (review.rating < 3) {
      label = "NOT DELIGHTFUL";
    } else if (review.rating < 4) {
      label = "DELIGHTFUL WITH NOTES";
    }
    return label;
  };
</script>

<section class="border border-gray p-4">
  <header class=" text-lg text-primary">{review.title}</header>
  <div class="mt-2 flex text-xs">
    <i class="{getStarType()} text-primary" />
    <span class="pl-2 text-gray">{getStarLabel()}</span>
  </div>
  <p class="mt-2 text-sm">{review.comment}</p>
</section>
