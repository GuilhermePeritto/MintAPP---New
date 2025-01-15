import { useEffect } from 'react'
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { useLanguage } from '@/components/language-provider'

interface EditNotificationProps {
  editCount: number
  onUndo: () => void
}

export function EditNotification({ editCount, onUndo }: EditNotificationProps) {
  const { toast } = useToast()
  const { t } = useLanguage()

  useEffect(() => {
    if (editCount > 0) {
      toast({
        title: t('changes_made'),
        description: t('edit_count', { count: editCount }),
        action: (
          <Button variant="outline" size="sm" onClick={onUndo}>
            {t('undo')}
          </Button>
        ),
        duration: 5000,
      })
    }
  }, [editCount, onUndo, toast, t])

  return null
}

