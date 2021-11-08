import { memo } from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Tooltip from '@mui/material/Tooltip'
import clsx from 'clsx'
import ButtonBase from '@mui/material/ButtonBase'
import useStyles from './style'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

export default memo(
  ({
    Component,
    primaryText,
    secondaryText,
    Icon,
    SecondaryIcon = undefined,
    disabled = false,
    style = {},
    tooltipTitle,
    onClick,
    i,
    activeIndex,
  }) => {
    const theme = useTheme()
    const xsAndDown = useMediaQuery(theme.breakpoints.down('sm'))
    const smAndUp = useMediaQuery(theme.breakpoints.up('sm'))
    const mdAndUp = useMediaQuery(theme.breakpoints.up('md'))
    const classes = useStyles()

    if (Component) {
      return <Component style={style} />
    }

    return (
      <Tooltip
        PopperProps={{
          style: {
            zIndex: 500, // Keep it under AppBars and ToolBars
          },
        }}
        title={
          tooltipTitle || disabled
            ? 'This option is disabled'
            : secondaryText || 'Missing secondaryText'
        }
        placement="right"
      >
        <ButtonBase
          disabled={disabled}
          className={clsx(classes.buttonBase, {
            [classes.active]: i === activeIndex,
          })}
          onClick={onClick}
          style={{ width: '100%' }}
        >
          <ListItem style={{ justifyContent: 'center' }}>
            {(xsAndDown || mdAndUp) && (
              <ListItemIcon style={{ justifyContent: 'center' }}>
                <Icon active={activeIndex === i} />
              </ListItemIcon>
            )}

            {smAndUp && (
              <ListItemText
                primaryTypographyProps={{
                  variant: 'overline',
                  display: 'block',
                }}
                style={{
                  textAlign: mdAndUp ? 'left' : 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                primary={primaryText || 'Missing primaryText'}
                secondary={mdAndUp && (secondaryText || 'Missing secondaryText')}
              />
            )}

            {(xsAndDown || mdAndUp) && SecondaryIcon && (
              <ListItemIcon style={{ justifyContent: 'center' }}>
                <SecondaryIcon />
              </ListItemIcon>
            )}
          </ListItem>
        </ButtonBase>
      </Tooltip>
    )
  },
  (a, b) => {
    if (a.activeIndex !== b.activeIndex) return false
    if (a.disabled !== b.disabled) return false
    if (a.Icon !== b.Icon) return false
    if (a.SecondaryIcon !== b.SecondaryIcon) return false
    if (a.style !== b.style) return false
    return true
  }
)
