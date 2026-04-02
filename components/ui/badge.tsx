import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default:  'bg-border text-text-secondary',
  success:  'bg-green/15 text-green border border-green/30',
  warning:  'bg-accent/15 text-accent border border-accent/30',
  danger:   'bg-red/15 text-red border border-red/30',
  info:     'bg-primary/15 text-primary border border-primary/30',
  muted:    'bg-border/60 text-text-muted',
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}
