export default {
  fileUploads: async ({ fileUploads = {} }) => {
    if (typeof fileUploads === 'object') {
      return fileUploads
    }

    return JSON.parse(fileUploads)
  },
}
