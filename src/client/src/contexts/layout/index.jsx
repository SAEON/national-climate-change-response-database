import { createContext, useState, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import useWindowSize from './_use-window-size'

export const context = createContext()

export default ({ children }) => {
  useLocation() // Trigger re-render on location changes
  const windowSize = useWindowSize()
  const [headerRef, setHeaderRef] = useState(null)
  const [contentRef, setContentRef] = useState(null)
  console.log('re-rendering layout')

  return (
    <context.Provider
      value={{
        windowSize,
        headerRef,
        setHeaderRef: el => setHeaderRef(el),
        contentRef,
        setContentRef: el => setContentRef(el),
      }}
    >
      {children}
    </context.Provider>
  )
}

export const SizeContent = ({ children, height = undefined, style = {} }) => {
  const { headerRef, setContentRef } = useContext(context)

  if (!headerRef) {
    return null
  }

  const css = height
    ? { height: `calc(100% - ${headerRef.offsetHeight || 0}px)` }
    : { minHeight: `calc(100% - ${headerRef.offsetHeight || 0}px)` }

  return (
    <div
      id="size-content"
      ref={setContentRef}
      style={{
        position: 'relative',
        ...css,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
