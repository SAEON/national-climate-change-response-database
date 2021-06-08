import { useState, useEffect } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Tooltip from '@material-ui/core/Tooltip'
import Badge from '@material-ui/core/Badge'
import InfoIcon from 'mdi-react/InformationIcon'
import { nanoid } from 'nanoid'

export default ({
  id,
  iconProps,
  tooltipProps,
  title = undefined,
  titleProps = {},
  text = 'Text missing',
  children = undefined,
  dialogueContentProps,
  dialogueProps,
  paperProps,
  icon = undefined,
  Button = undefined,
  onOpenEffect = undefined,
  badgeProps = undefined,
  hideIcon = false,
  defaultOpen = false,
  ariaLabel = 'Toggle dialogue',
  permanent = false,
  disabled = false,
  Actions = undefined,
  handleClose = () => {},
}) => {
  const [open, setOpen] = useState(defaultOpen)

  id = id || nanoid()

  useEffect(() => {
    if (open && onOpenEffect) {
      onOpenEffect()
    }
  }, [open, onOpenEffect])

  return (
    <span onClick={e => e.stopPropagation()}>
      {hideIcon ? undefined : (
        <Tooltip placement="right-end" {...tooltipProps}>
          <span>
            {Button ? (
              Button(e => {
                e.stopPropagation()
                setOpen(!open)
              })
            ) : (
              <IconButton
                disabled={disabled}
                aria-label={ariaLabel}
                aria-controls={id}
                aria-haspopup="true"
                aria-expanded={open}
                onClick={e => {
                  e.stopPropagation()
                  setOpen(!open)
                }}
                {...iconProps}
              >
                {badgeProps ? (
                  badgeProps._component ? (
                    <badgeProps._component {...badgeProps}>
                      {icon || <InfoIcon fontSize={iconProps?.fontSize || 'default'} />}
                    </badgeProps._component>
                  ) : (
                    <Badge {...badgeProps}>
                      {icon || <InfoIcon fontSize={iconProps?.fontSize || 'default'} />}
                    </Badge>
                  )
                ) : (
                  icon || <InfoIcon fontSize={iconProps?.fontSize || 'default'} />
                )}
              </IconButton>
            )}
          </span>
        </Tooltip>
      )}

      <Dialog
        id={id}
        disableBackdropClick={permanent}
        disableEscapeKeyDown={permanent}
        {...dialogueProps}
        open={open}
        onClose={() => {
          handleClose()
          setOpen(false)
        }}
        PaperProps={paperProps}
      >
        {title ? (
          <DialogTitle {...titleProps}>
            {typeof title === 'function' ? title(() => setOpen(false)) : title}
          </DialogTitle>
        ) : undefined}
        <div style={{ position: 'relative' }}>
          {children && typeof children === 'function'
            ? children(() => setOpen(false), open)
            : children}
          {children ? null : <DialogContent {...dialogueContentProps}>{text}</DialogContent>}
        </div>
        {Actions ? (
          <DialogActions style={{ justifyContent: 'flex-end' }}>
            {Actions.map(action =>
              action(e => {
                e.stopPropagation()
                setOpen(!open)
              })
            )}
          </DialogActions>
        ) : null}
      </Dialog>
    </span>
  )
}
