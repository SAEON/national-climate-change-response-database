export default theme => ({
  errorMessage: {
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.grey[200]}`,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    padding: theme.spacing(1),
  },
})
