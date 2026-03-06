import { VentoPlugin } from "eleventy-plugin-vento";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

export const plugins = (config) => {
  let ventoCache;
  config.on("eleventy.beforeWatch", () => ventoCache?.clear());

  config.addPlugin(VentoPlugin, {
    plugins: [(env) => { ventoCache = env.cache; }],
    shortcodes: true,
    pairedShortcodes: true,
    filters: true,
    autotrim: false
  });

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
      }
    },
    codeAttributes: {},
  });
};
