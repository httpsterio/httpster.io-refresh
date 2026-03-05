import path from "path";
import { VentoPlugin } from "eleventy-plugin-vento";
import { collections } from "./config/collections.js";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

export default function(config) {

  // cache bust vento's cache to reload changed includes.
  let ventoCache;
  config.on("eleventy.beforeWatch", () => ventoCache?.clear());

  config.addPlugin(VentoPlugin, {
    plugins: [(env) => { ventoCache = env.cache; }],
    shortcodes: true,
    pairedShortcodes: true,
    filters: true,
    autotrim: false,

    ventoOptions: {
      includes: path.resolve("src/_includes"),
    },
  });

  config.addPlugin(syntaxHighlight, {
    // Line separator for line breaks
    lineSeparator: "<br>",
    templateFormats: ["*"],

    // Add codeblock class as well as block language
    preAttributes: {
      tabindex: 0,
      class: function ({ language }) {
        return `codeblock language-${language}`;
      },
      // Added in 4.1.0 you can use callback functions too
      "data-language": function ({ language, content, options }) {
        return language;
      }
    },
    codeAttributes: {},
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
