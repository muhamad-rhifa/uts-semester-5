import React, { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  maxWidth?: string
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-lg',
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? 'modal-description' : undefined}
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={`w-full ${maxWidth} rounded-2xl border p-6 my-8 relative shadow-2xl transition-all`}
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 id="modal-title" className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
              {title}
            </h2>
            {description && (
              <p id="modal-description" className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg transition-base text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-raised)]"
            aria-label="Tutup dialog"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  )
}
