import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean
}

export function Card({ className, glow = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-bg-card border border-border p-4',
        glow && 'glow-border',
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4', className)} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-sm font-medium text-text-secondary uppercase tracking-wider', className)}
      {...props}
    />
  )
}

export function CardValue({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('text-2xl font-bold font-mono text-text-primary mt-1', className)}
      {...props}
    />
  )
}
