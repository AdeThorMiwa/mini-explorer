import { FormEvent, useEffect, useMemo, useState } from 'react'
import Loader from '../components/Loader'
import { useLocation } from 'react-router-dom'
import { BlockWithTransactions } from '@ethersproject/abstract-provider'
import useProvider from '../hooks/useProvider'
import DetailsTable, { DetailsTableRow } from '../components/DetailsTable'
import Pill from '../components/Pill'

const _rows = (block?: BlockWithTransactions): DetailsTableRow => [
  {
    title: 'Block Height',
    value: block?.number
  },
  {
    title: 'Status',
    value: <Pill variant="secondary" text="Unfinalized" />
  },
  {
    title: 'Timestamp',
    value: block?.timestamp ? new Date(block?.timestamp).toDateString() : ''
  },
  {
    title: 'Proposed On',
    value: block?.timestamp ? new Date(block?.timestamp).toDateString() : ''
  },
  {
    title: 'Transactions',
    value: (
      <a href="#" className="mr-2 text-blue-500">
        {block?.transactions.length} transactions
      </a>
    )
  }
]

const BlockPage = () => {
  const provider = useProvider()
  const location = useLocation()
  const [blockNumber, setBlockNumber] = useState('')
  const [block, setBlock] = useState<BlockWithTransactions>()
  const [loading, setLoading] = useState(false)

  const rows = useMemo(() => _rows(block), [block])

  useEffect(() => {
    const blockNumber = new URLSearchParams(location.search).getAll('block')[0]
    if (blockNumber) {
      setBlockNumber(blockNumber)
      fetchBlockData(blockNumber)
    }
  }, [])

  const fetchBlockData = async (blockNumber: string) => {
    setLoading(true)
    try {
      const block = await provider.core.getBlockWithTransactions(
        parseInt(blockNumber)
      )

      if (block) {
        setBlock(block)
      }
    } catch (e) {
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleSumbit = async (e: FormEvent) => {
    e.preventDefault()
    fetchBlockData(blockNumber)
  }

  return (
    <div>
      <form className="flex pb-5" onSubmit={handleSumbit}>
        <input
          onChange={(e) => setBlockNumber(e.target.value)}
          placeholder="Block Number"
          className="grow px-5 py-3 border border-r-0 rounded-l-md border-gray-400 focus:rign-0 focus:outline-none"
          value={blockNumber}
        />
        <button className="px-5 py-3 bg-zinc-600 hover:bg-zinc-500 text-white rounded-r-md">
          Search
        </button>
      </form>
      {loading && <Loader />}
      {block && !loading && (
        <DetailsTable title={`Block #${block.number}`} rows={rows} />
      )}
    </div>
  )
}
export default BlockPage
