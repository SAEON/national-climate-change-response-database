import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import useLocalstorage from '../../hooks/use-localstorage'

export default ({ navItems, children }) => {
  const [activeIndex, setActiveIndex] = useLocalstorage('user-management', 0)

  return (
    <>
      <div>
        <List>
          <ListItem>
            <ListItemText primary="Single-line item" secondary={'Secondary text'} />
          </ListItem>
        </List>
      </div>
      {children({ activeIndex })}
    </>
  )
}
