import { useEffect, useContext } from 'react'
import { useSnackbar } from 'notistack'
import { NCCRD_CLIENT_DEFAULT_NOTICES } from '../../config'
import { context as authContext } from '../../contexts/authentication'

/**
 * Example of a notice:
 * NCCRD_CLIENT_DEFAULT_NOTICES=Some message,warning;Some other message,info
 */
export default ({ children }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { userInfo } = useContext(authContext)

  useEffect(() => {
    if (!userInfo) return
    enqueueSnackbar(`Welcome back ${userInfo.emailAddress}`, { variant: 'info' })
  }, [enqueueSnackbar, userInfo])

  useEffect(
    () =>
      (async () => {
        for (const { msg, variant } of NCCRD_CLIENT_DEFAULT_NOTICES.split(';')
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
