export default {
  Projects: {
    name: 'projects',
    indices: [],
  },
  Vocabulary: {
    name: 'vocabulary',
    indices: [
      {
        index: 'term',
        options: {
          unique: true,
        },
      },
    ],
  },
}
