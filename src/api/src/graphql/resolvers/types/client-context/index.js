import region from './_region.js'

export default {
  theme: async ({ theme }) => theme,
  frontMatter: async ({ frontMatter }) => frontMatter,
  region,
}
