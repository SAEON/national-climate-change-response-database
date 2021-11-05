import { useState, useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
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
                size="large"
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
        {...dialogueProps}
        open={open}
        onClose={(e, reason) => {
          if (permanent && reason) {
            return
          }
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
