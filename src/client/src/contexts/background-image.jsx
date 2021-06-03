import { createContext } from 'react'
import { NCCRD_CLIENT_BACKGROUNDS } from '../config'
import { isIE } from 'react-device-detect'
import clsx from 'clsx'
import useTheme from '@material-ui/core/styles/useTheme'

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
  const theme = useTheme()

  return (
    <>
      {/* {!isIE && (
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
      )} */}

      <div
        id="bg"
        style={{
          position: 'fixed',
          background: `radial-gradient(${theme.palette.primary.dark}, #1f1013)`,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <div className={clsx('light', 'x1')}></div>
        <div className={clsx('light', 'x2')}></div>
        <div className={clsx('light', 'x3')}></div>
        <div className={clsx('light', 'x4')}></div>
        <div className={clsx('light', 'x5')}></div>
        <div className={clsx('light', 'x6')}></div>
        <div className={clsx('light', 'x7')}></div>
        <div className={clsx('light', 'x8')}></div>
        <div className={clsx('light', 'x9')}></div>
      </div>

      {children}
    </>
  )
}
