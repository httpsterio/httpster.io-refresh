export default {
  layout: "layouts/post.vto",
  permalink: "/echoes/{{ page.fileSlug }}/",
  tags: "test",
  eleventyComputed: {
    title: (data) => data.page.fileSlug,
  },
};
