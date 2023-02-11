import { FC } from 'react'
import cn from 'classnames'

interface PillProp {
  text: string
  variant: 'success' | 'secondary'
}

const Pill: FC<PillProp> = ({ text, variant }) => {
  return (
    <span
      className={cn('text-10 px-2 py-0.5 rounded-md border', {
        'bg-green-100 border-green-400  text-green-400': variant === 'success',
        'bg-gray-100': variant === 'secondary'
      })}
    >
      {text}
    </span>
  )
}

export default Pill
