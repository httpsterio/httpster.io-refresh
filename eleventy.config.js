import path from "path";
import { VentoPlugin } from "eleventy-plugin-vento";
import { collections } from "./config/collections.js";


export default function(config) {

  config.addPlugin(VentoPlugin, {
    plugins: [],
    shortcodes: true,
    pairedShortcodes: true,
    filters: true,
    autotrim: false,

    ventoOptions: {
      includes: path.resolve("src/_includes"),
    },
  });

  // Passthrough Copy
  config.addPassthroughCopy("src/assets");
  config.addPassthroughCopy("src/content/**/*.{jpg,jpeg,png,webp,avif,gif,svg,webm,mp4}");

  // Collections
  for (const [name, fn] of Object.entries(collections)) {
    config.addCollection(name, fn);
  }


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
    templateFormats: ["vto", "njk", "md"],
    markdownTemplateEngine: "vto",
    htmlTemplateEngine: "vto",
  };
}
