import { useEffect, useContext } from 'react'
import { useSnackbar } from 'notistack'
import { DEFAULT_NOTICES } from '../../config'
import { context as authContext } from '../../contexts/authentication'

/**
 * Example of a notice:
 * DEFAULT_NOTICES=Some message,warning;Some other message,info
 */
export default ({ children }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { user } = useContext(authContext)

  useEffect(() => {
    if (!user) return
    enqueueSnackbar(`Welcome back ${user.emailAddress}`, { variant: 'info' })
  }, [enqueueSnackbar, user])

  useEffect(
    () =>
      (async () => {
        for (const { msg, variant } of DEFAULT_NOTICES.split(';')
          .filter(_ => _)
          .map(str => {
            const [msg, variant] = str.split(',').map(s => s.trim())
            return {
              msg,
              variant,
            }
          })) {
          enqueueSnackbar(msg, {
            variant,
          })
          await new Promise(res => setTimeout(res, 250))
        }
      })(),
    [enqueueSnackbar]
  )

  return children
}
