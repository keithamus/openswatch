export default (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("swatch-picker");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("favicon.png");
  return {
    dir: {
      layouts: "_layouts",
      includes: "_includes",
    },
  };
};
