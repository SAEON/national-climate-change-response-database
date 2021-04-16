import { useState, useEffect } from 'react'

export default ({ uri, children }) => {
  const [state, setState] = useState({
    error: undefined,
    loading: true,
    data: undefined,
  })

  useEffect(() => {
    const abortController = new AbortController()

    ;(async () => {
      try {
        const response = await fetch(uri, {
          method: 'GET',
          mode: 'cors',
          signal: abortController.signal,
        })

        if (response.status !== 200) {
          setState({
            error: new Error('Unexpected response asking for client info'),
            loading: false,
            data: undefined,
          })
        } else {
          const data = await response.json()
          setState({ error: undefined, loading: false, data })
        }
      } catch (error) {
        console.error(error)
        setState({ error, loading: false, data: undefined })
      }
    })()

    return () => {
      abortController.abort()
    }
  }, [uri])

  if (children) {
    return children(state)
  } else {
    return state
  }
}
