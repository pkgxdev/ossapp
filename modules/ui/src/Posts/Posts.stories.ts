import Posts from "./Posts.svelte";

export default {
  title: "Example/Posts",
  component: Posts,
  render: ({ posts }) => ({
    Component: Posts,
    props: {
      posts
    }
  })
};

// More on interaction testing: https://storybook.js.org/docs/7.0/svelte/writing-tests/interaction-testing
export const Example = {
  args: {
    posts: [
      {
        airtable_record_id: "a",
        link: "https://google.com",
        title: "Tea Inc releases game changing api!",
        sub_title: "lorem ipsum dolor sit amet",
        short_description: "lorem ipsum dolor sit amet",
        thumb_image_url: "/images/bored-ape.png",
        thumb_image_name: "borred-api.png",
        created_at: new Date(),
        updated_at: new Date(),
        published_at: new Date(),
        tags: ["news"]
      }
    ]
  }
};
