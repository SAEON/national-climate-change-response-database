export default {
  UserRoles: {
    name: 'userRoles',
    indices: [
      {
        index: 'name',
        options: {
          unique: true,
        },
      },
    ],
  },
  Users: {
    name: 'users',
    indices: [
      {
        index: 'username',
        options: {
          unique: true,
        },
      },
    ],
  },
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
