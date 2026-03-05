// filter out posts with draft:true or if date is set in future (scheduled post). builds drafts if node is not production.
const filterDrafts = collection => {
  const now = new Date();
  if (process.env.ELEVENTY_ENV == "production") {
    return collection.filter(post => post.date <= now && !post.data.draft);
  } else {
    return collection;
  }
};

const globs = {
  articles: "src/content/articles/**/*.md",
  projects: "src/content/projects/**/*.md",
  reviews:  "src/content/reviews/**/*.md",
  echoes:   "src/content/echoes/**/*.md",
};

export const collections = {
  articles:    c => filterDrafts(c.getFilteredByGlob(globs.articles)).reverse(),
  projects:    c => filterDrafts(c.getFilteredByGlob(globs.projects)).reverse(),
  reviews:     c => filterDrafts(c.getFilteredByGlob(globs.reviews)).reverse(),
  echoes:      c => filterDrafts(c.getFilteredByGlob(globs.echoes)).reverse(),
  everything:  c => filterDrafts(c.getFilteredByGlob(Object.values(globs))).reverse(),
  mainContent: c => filterDrafts(c.getFilteredByGlob([globs.articles, globs.projects, globs.reviews])).reverse(),
};
