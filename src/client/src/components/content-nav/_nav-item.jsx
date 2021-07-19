import { memo } from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Tooltip from '@material-ui/core/Tooltip'
import clsx from 'clsx'
import ButtonBase from '@material-ui/core/ButtonBase'
import Card from '@material-ui/core/Card'
import useStyles from './style'
import useTheme from '@material-ui/core/styles/useTheme'
import useMediaQuery from '@material-ui/core/useMediaQuery'

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
    setActiveIndex,
    i,
    activeIndex,
  }) => {
    const theme = useTheme()
    const xsAndDown = useMediaQuery(theme.breakpoints.down('xs'))
    const smAndUp = useMediaQuery(theme.breakpoints.up('sm'))
    const mdAndUp = useMediaQuery(theme.breakpoints.up('md'))
    const classes = useStyles()

    if (Component) {
      return <Component style={style} />
    }

    return (
      <Tooltip
        title={tooltipTitle || disabled ? 'This option is disabled' : secondaryText}
        placement="top-end"
      >
        <Card
          style={{
            flexBasis: mdAndUp ? 'auto' : 0,
            flexGrow: 1,
            border: 'none',
            ...style,
          }}
          className={clsx(classes.card, {
            [classes.disabled]: disabled,
          })}
        >
          <ButtonBase
            disabled={disabled}
            className={clsx(classes.buttonBase, {
              [classes.active]: i === activeIndex,
            })}
            onClick={() => setActiveIndex(i)}
            style={{ width: '100%' }}
          >
            <ListItem style={{ justifyContent: 'center' }}>
              {(xsAndDown || mdAndUp) && (
                <ListItemIcon style={{ justifyContent: 'center' }}>
                  <Icon />
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
                  primary={primaryText}
                  secondary={mdAndUp && secondaryText}
                />
              )}

              {(xsAndDown || mdAndUp) && SecondaryIcon && (
                <ListItemIcon style={{ justifyContent: 'center' }}>
                  <SecondaryIcon />
                </ListItemIcon>
              )}
            </ListItem>
          </ButtonBase>
        </Card>
      </Tooltip>
    )
  },
  (a, b) => {
    if (a.activeIndex !== b.activeIndex) return false
    if (a.disabled !== b.disabled) return false
    if (a.Icon !== b.Icon) return false
    if (a.SecondaryIcon !== b.SecondaryIcon) return false
    if (a.syncing !== b.syncing) return false
    if (a.style !== b.style) return false
    return true
  }
)
