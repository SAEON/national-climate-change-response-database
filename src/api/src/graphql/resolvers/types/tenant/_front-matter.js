export default async self =>
  self.frontMatter ||
  JSON.stringify({
    about: {
      title: '',
      content: '',
    },
    explore: {
      title: '',
      content: '',
    },
    submit: {
      title: '',
      content: '',
    },
  })
