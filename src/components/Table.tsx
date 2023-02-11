import { FC, ReactNode } from 'react'
import cn from 'classnames'
import Loader from './Loader'

interface TableProps {
  headers: string[]
  render: (item: unknown, i: number) => ReactNode
  data: unknown[]
  gridCols: string
  loading?: boolean
  onItemClick: (item: unknown, i: number) => void
}

const Table: FC<TableProps> = ({
  headers,
  render,
  data,
  gridCols,
  loading = false,
  onItemClick
}) => {
  const baseStyle =
    'grid gap-2 justify-between w-full border-b border-gray-400 p-3'
  return (
    <section className="w-full border border-gray-400 rounded-lg my-5">
      <div className={cn(baseStyle, gridCols, 'text-[12px]')}>
        {headers.map((h, i) => (
          <span className="" key={i}>
            {h}
          </span>
        ))}
      </div>

      {loading && <Loader />}

      {data.map((d, i) => (
        <div
          className={cn(
            baseStyle,
            gridCols,
            'text-[11px] cursor-pointer last:border-b-0 hover:bg-gray-400/20'
          )}
          style={{ overflowWrap: 'anywhere' }}
          key={i}
          onClick={() => onItemClick(d, i)}
        >
          {render(d, i)}
        </div>
      ))}
    </section>
  )
}

export default Table
