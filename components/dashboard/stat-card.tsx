import { Card, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string
  sub?: string
  subPositive?: boolean | null
  icon?: React.ReactNode
  accent?: 'primary' | 'green' | 'red' | 'accent'
}

const accentMap = {
  primary: 'text-primary',
  green: 'text-green',
  red: 'text-red',
  accent: 'text-accent',
}

export function StatCard({ title, value, sub, subPositive, icon, accent = 'primary' }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {icon && (
          <div className={cn('opacity-60', accentMap[accent])}>
            {icon}
          </div>
        )}
      </div>
      <div className={cn('text-2xl font-bold font-mono', accentMap[accent])}>
        {value}
      </div>
      {sub && (
        <p
          className={cn(
            'text-xs font-mono',
            subPositive === null ? 'text-text-muted' :
            subPositive ? 'text-green' : 'text-red'
          )}
        >
          {sub}
        </p>
      )}
    </Card>
  )
}
