import { FC, ReactNode } from 'react'

export type DetailsTableCol = { title: string; value: string | ReactNode }
export type DetailsTableRow = DetailsTableCol[]

interface DetailsTableProps {
  title: string
  rows: DetailsTableRow
  className?: string
}

const DetailsTable: FC<DetailsTableProps> = ({
  title,
  rows,
  className = ''
}) => {
  return (
    <section className={className}>
      <h3>{title}</h3>
      <div className="mt-2.5 border border-gray-400 p-5 rounded-lg">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-3 mb-5 last:mb-0">
            <div>{row.title}</div>
            <div className="col-span-2">
              {typeof row.value === 'string' ? (
                <span>{row.value}</span>
              ) : (
                row.value
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default DetailsTable
