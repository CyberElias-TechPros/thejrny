export type WhatsAppVariant = 'fab' | 'inline' | 'pill'

export interface WhatsAppButtonProps {
  phone?: string
  message?: string
  label?: string
  variant?: WhatsAppVariant
  className?: string
}

const DEFAULT_PHONE = '2348137731227'

function waUrl(phone: string, message: string) {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${phone}?text=${encoded}`
}

const WA_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.83 14.07c-.24.69-1.41 1.32-1.95 1.4-.5.08-1.12.11-1.81-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.15-4.9-4.34-.14-.19-1.18-1.57-1.18-3 0-1.43.75-2.13 1.02-2.42.27-.29.58-.36.77-.36.19 0 .39.001.56.01.18.01.42-.07.66.5.24.58.83 2 .9 2.14.07.14.12.31.02.5-.1.19-.15.31-.29.48-.14.17-.3.38-.43.51-.14.14-.29.29-.13.57.17.29.74 1.22 1.59 1.97 1.09.97 2.01 1.27 2.3 1.41.29.14.46.12.63-.07.17-.19.71-.83.9-1.11.19-.29.38-.24.64-.14.26.1 1.66.78 1.94.93.29.14.48.21.55.33.07.12.07.69-.17 1.38z"
      fill="#fff"
    />
  </svg>
)

export default function WhatsAppButton({
  phone = DEFAULT_PHONE,
  message = "Hi JOURNEY, I'd like to ask about an order.",
  label = 'Chat on WhatsApp',
  variant = 'fab',
  className = '',
}: WhatsAppButtonProps) {
  const base =
    'fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-105 active:scale-95'
  const inline =
    'inline-flex items-center gap-2.5 border border-line rounded-none px-5 py-3 text-mono text-[10px] text-ink uppercase tracking-[0.14em] transition-colors hover:bg-ink hover:text-bone'
  const pill =
    'inline-flex items-center gap-2.5 border border-line rounded-full px-6 py-2.5 text-mono text-[10px] text-ink uppercase tracking-[0.14em] transition-colors hover:bg-ink hover:text-bone'

  const classes = variant === 'fab' ? base : variant === 'inline' ? inline : pill

  return (
    <a
      href={waUrl(phone, message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`${classes} ${className}`}
    >
      {variant === 'fab' ? WA_ICON : (
        <span className="flex items-center gap-2.5">
          {WA_ICON}
          <span>{label}</span>
        </span>
      )}
    </a>
  )
}
