import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@mui/material'

export default function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmColor = 'primary',
  maxWidth = 'xs',
  onConfirm,
  onCancel,
}) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth={maxWidth}
      fullWidth
      sx={{ '& .MuiDialog-paper': { borderRadius: 0 } }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{description}</DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onCancel} sx={{ borderRadius: 0 }}>{cancelLabel}</Button>
        <Button
          color={confirmColor}
          variant="contained"
          onClick={onConfirm}
          sx={{ borderRadius: 0 }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
