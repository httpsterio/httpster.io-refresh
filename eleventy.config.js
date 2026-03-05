import path from "path";

export default function(config) {

  // Passthrough Copy
  config.addPassthroughCopy("src/assets");
  config.addPassthroughCopy("src/content/**/*.{jpg,jpeg,png,webp,avif,gif,svg,webm,mp4}");

  // Collections
  config.addCollection("articles",   c => c.getFilteredByGlob("src/content/articles/**/*.md"));
  config.addCollection("projects", c => c.getFilteredByGlob("src/content/projects/**/*.md"));
  config.addCollection("reviews", c => c.getFilteredByGlob("src/content/reviews/**/*.md"));
  config.addCollection("echoes", c => c.getFilteredByGlob("src/content/echoes/**/*.md"));

  config.addCollection("everything", c =>
    c.getFilteredByGlob(["src/content/articles/**/*.md", "src/content/projects/**/*.md", "src/content/reviews/**/*.md", "src/content/echoes/**/*.md"])
  );

  // Main content without echo posts.
  config.addCollection("mainContent", c =>
    c.getFilteredByGlob(["src/content/articles/**/*.md", "src/content/projects/**/*.md", "src/content/reviews/**/*.md"])
  );


  // Rewrite relative media paths in content to match passthrough copy output location
  config.addTransform("rewrite-relative-media", function(content) {
    // skip any outputs that are not html
    if (!this.page.outputPath?.endsWith(".html")) return content;

    // skip anything except /content/
    if (!this.page.inputPath?.includes("/content/")) return content;

    const contentBase = path.relative("src", path.dirname(this.page.inputPath));

    return content
      // find all relative images (not https://, / or data:) and rewrites to absolute paths
      .replace(/(<img\b[^>]*\bsrc=")(?!https?:\/\/|\/|data:)([^"]+)(")/g,
        (_, pre, src, post) => `${pre}/${contentBase}/${src}${post}`)
      .replace(/(<source\b[^>]*\bsrc=")(?!https?:\/\/|\/|data:)([^"]+)(")/g,
        (_, pre, src, post) => `${pre}/${contentBase}/${src}${post}`);
  });

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
