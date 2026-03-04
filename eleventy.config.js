export default function(config) {

  // Passthrough Copy
  config.addPassthroughCopy("src/assets");

  // Collections
  config.addCollection("articles",   c => c.getFilteredByGlob("src/content/articles/*.md"));
  config.addCollection("projects",   c => c.getFilteredByGlob("src/content/projects/*.md"));
  config.addCollection("reviews",    c => c.getFilteredByGlob("src/content/reviews/*.md"));
  config.addCollection("echoes",     c => c.getFilteredByGlob("src/content/echoes/*.md"));

  config.addCollection("everything", c =>
    c.getFilteredByGlob(["src/content/articles/*.md", "src/content/projects/*.md", "src/content/reviews/*.md", "src/content/echoes/*.md"])
  );

  // Main content without echo posts.
  config.addCollection("mainContent", c =>
    c.getFilteredByGlob(["src/content/articles/*.md", "src/content/projects/*.md", "src/content/reviews/*.md"])
  );

  // Show device IP instead of just localhost
  config.setServerOptions({
    showAllHosts: true
  });

  return {
    dir: { input: "src", output: "_site" },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
