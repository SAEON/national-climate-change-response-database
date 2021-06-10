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

export default ({ navItems, subNavChildren = null, children }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [activeIndex, setActiveIndex] = useState(0)
  const mdAndUp = useMediaQuery(theme.breakpoints.up('md'))
  const smAndUp = useMediaQuery(theme.breakpoints.up('sm'))
  const xsAndDown = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <List style={{ padding: 0, display: 'flex', flexDirection: mdAndUp ? 'column' : 'row' }}>
          {navItems.map(({ primaryText, secondaryText, Icon, disabled = false }, i) => (
            <Card
              variant="outlined"
              style={{
                flexBasis: mdAndUp ? 'auto' : 0,
                flexGrow: 1,
                border: 'none',
              }}
              className={clsx(classes.card, {
                [classes.disabled]: disabled,
              })}
              key={i}
            >
              <ButtonBase
                disabled={disabled}
                className={clsx({
                  [classes.active]: i === activeIndex,
                })}
                onClick={() => setActiveIndex(i)}
                style={{ width: '100%' }}
              >
                <ListItem>
                  {(xsAndDown || mdAndUp) && (
                    <ListItemIcon style={{ justifyContent: 'center' }}>
                      <Icon />
                    </ListItemIcon>
                  )}

                  {smAndUp && (
                    <ListItemText
                      style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      primary={primaryText}
                      secondary={mdAndUp && secondaryText}
                    />
                  )}
                </ListItem>
              </ButtonBase>
            </Card>
          ))}
        </List>
        {subNavChildren && subNavChildren({ setActiveIndex })}
      </Grid>

      <Grid item xs={12} md={9}>
        <div>{children({ setActiveIndex, activeIndex })}</div>
      </Grid>
    </Grid>
  )
}
