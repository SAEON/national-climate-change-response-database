import { useState } from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Grid from '@material-ui/core/Grid'
import ButtonBase from '@material-ui/core/ButtonBase'
import Card from '@material-ui/core/Card'
import useStyles from './style'
import clsx from 'clsx'
import useTheme from '@material-ui/core/styles/useTheme'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Tooltip from '@material-ui/core/Tooltip'

export default ({ navItems, subNavChildren = null, children }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [activeIndex, setActiveIndex] = useState(0)
  const xsAndDown = useMediaQuery(theme.breakpoints.down('xs'))
  const smAndUp = useMediaQuery(theme.breakpoints.up('sm'))
  const mdAndUp = useMediaQuery(theme.breakpoints.up('md'))
  const lgAndUp = useMediaQuery(theme.breakpoints.up('lg'))

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={3}>
        <List style={{ padding: 0, display: 'flex', flexDirection: lgAndUp ? 'column' : 'row' }}>
          {navItems.map(
            (
              {
                Component,
                primaryText,
                secondaryText,
                Icon,
                disabled = false,
                style = {},
                tooltipTitle,
              },
              i
            ) => {
              if (Component) {
                return <Component key={i} />
              }
              return (
                <Tooltip
                  key={i}
                  title={tooltipTitle || disabled ? 'This option is disabled' : secondaryText}
                  placement="top-end"
                >
                  <Card
                    variant={i === activeIndex ? 'elevation' : 'outlined'}
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
                      </ListItem>
                    </ButtonBase>
                  </Card>
                </Tooltip>
              )
            }
          )}
        </List>
        {subNavChildren && subNavChildren({ setActiveIndex })}
      </Grid>

      <Grid item xs={12} lg={9}>
        <div>{children({ setActiveIndex, activeIndex })}</div>
      </Grid>
    </Grid>
  )
}
