import { createContext } from 'react'
import { NCCRD_CLIENT_BACKGROUNDS } from '../config'
import { isIE } from 'react-device-detect'

/**
 * Provides some measure of control over which background
 * image is displayed throughout the application. This
 * is not yet fully implemented - current the background
 * is chosen at random.
 *
 * NOTE there is currently a Material-UI bug that means
 * form controls will jump when a select is chosen: https://github.com/mui-org/material-ui/issues/17353
 * when using background cover
 */

const getBackgroundImagePath = () => {
  const backgrounds = NCCRD_CLIENT_BACKGROUNDS.split(',')
  const min = 0
  const max = backgrounds.length - 1
  const i = Math.floor(Math.random() * (max - min + 1) + min)
  return `url(/bg/${backgrounds[i]})`
}

export const BgImageContext = createContext()

export default ({ children }) => {
  return (
    <>
      {!isIE && (
        <div
          id="bg"
          style={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundSize: 'auto',
            backgroundPosition: 'left',
            backgroundImage: getBackgroundImagePath(),
            zIndex: -1,
            backgroundAttachment: 'fixed',
          }}
        />
      )}

      {children}
    </>
  )
}
