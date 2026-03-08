import { VentoPlugin } from "eleventy-plugin-vento";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItFootnote from "markdown-it-footnote";
import markdownItLinkAttributes from "markdown-it-link-attributes";

// Configures markdown-it with anchor links on headings, footnotes,
// and automatic target="_blank" on external links.
export const markdown = (config) => {
  const md = markdownIt({ html: true, typographer: true, breaks: true })
    .use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.headerLink(),
      slugify: (s) =>
        s
          .toLowerCase()
          .replace(/[^\w]+/g, "-")
          .replace(/(^-|-$)/g, ""),
    })
    .use(markdownItFootnote)
    .use(markdownItLinkAttributes, {
      matcher: (href) => href.startsWith("http"),
      attrs: { target: "_blank", rel: "noopener noreferrer" },
    });

  config.setLibrary("md", md);
};

// Registers all plugins: markdown, Vento templating, and syntax highlighting.
export const plugins = (config) => {
  markdown(config);

  // Vento template engine with cache clearing on watch and shortcode/filter support.
  let ventoCache;
  config.on("eleventy.beforeWatch", () => ventoCache?.clear());

  config.addPlugin(VentoPlugin, {
    plugins: [
      (env) => {
        ventoCache = env.cache;
      },
    ],
    shortcodes: true,
    pairedShortcodes: true,
    filters: true,
    autotrim: false,
  });

  // Syntax highlighting via Prism. Adds language class and data attribute to pre elements.
  config.addPlugin(syntaxHighlight, {
    lineSeparator: "<br>",
    templateFormats: ["*"],

    preAttributes: {
      tabindex: 0,
      class: function ({ language }) {
        return `codeblock language-${language}`;
      },
      "data-language": function ({ language, content, options }) {
        return language;
      },
    },
    codeAttributes: {},
  });
};