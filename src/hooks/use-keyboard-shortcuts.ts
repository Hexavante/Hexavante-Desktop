import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSidebar } from '@/components/ui/sidebar'

export function useKeyboardShortcuts(onCtrlK?: () => void) {
  const navigate = useNavigate()
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement

      if (e.key === 'Escape') {
        const closeButtons = document.querySelectorAll('[data-dialog-close]')
        if (closeButtons.length > 0) {
          (closeButtons[closeButtons.length - 1] as HTMLButtonElement).click()
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        toggleSidebar()
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        onCtrlK?.()
      }

      if ((e.ctrlKey || e.metaKey) && e.key === '1') {
        e.preventDefault()
        navigate('/')
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '2') {
        e.preventDefault()
        navigate('/cursos')
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '3') {
        e.preventDefault()
        navigate('/perfil')
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate, toggleSidebar, onCtrlK])
}
