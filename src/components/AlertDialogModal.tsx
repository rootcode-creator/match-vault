"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

type AlertDialogModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  showCancel?: boolean
  cancelLabel?: string
  onConfirm?: () => void
  onCancel?: () => void
}

export function AlertDialogModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "OK",
  showCancel = false,
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: AlertDialogModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {showCancel ? (
            <AlertDialogCancel onClick={onCancel}>{cancelLabel}</AlertDialogCancel>
          ) : null}
          <AlertDialogAction onClick={onConfirm}>{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
