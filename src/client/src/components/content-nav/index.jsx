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
  const smAndUp = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <List style={{ padding: 0 }}>
          {navItems.map(({ primaryText, secondaryText, Icon }, i) => (
            <Card variant="outlined" key={i}>
              <ButtonBase
                className={clsx({
                  [classes.active]: i === activeIndex,
                })}
                onClick={() => setActiveIndex(i)}
                style={{ width: '100%' }}
              >
                <ListItem>
                  <ListItemIcon style={{ justifyContent: 'center' }}>
                    <Icon />
                  </ListItemIcon>
                  {smAndUp && <ListItemText primary={primaryText} secondary={secondaryText} />}
                </ListItem>
              </ButtonBase>
            </Card>
          ))}
        </List>
        {subNavChildren && subNavChildren({ setActiveIndex })}
      </Grid>

      <Grid item xs={12} sm={9}>
        <div>{children({ setActiveIndex, activeIndex })}</div>
      </Grid>
    </Grid>
  )
}
