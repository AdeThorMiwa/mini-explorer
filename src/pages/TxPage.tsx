import { FormEvent, useEffect, useMemo, useState } from 'react'
import Loader from '../components/Loader'
import { Link, useLocation } from 'react-router-dom'
import {
  TransactionResponse,
  TransactionReceipt
} from '@ethersproject/abstract-provider'
import useProvider from '../hooks/useProvider'
import DetailsTable, { DetailsTableRow } from '../components/DetailsTable'
import Pill from '../components/Pill'
import { Utils } from 'alchemy-sdk'

export type Transaction =
  | (TransactionResponse & { receipt: TransactionReceipt | null })
  | null

const _rows = (tx: Transaction): DetailsTableRow => [
  {
    title: 'Transaction Hash',
    value: tx?.hash
  },
  {
    title: 'Status',
    value: <Pill variant="success" text="Success" />
  },
  {
    title: 'Block',
    value: (
      <div>
        <Link to={`/block/${tx?.blockNumber}`} className="mr-2 text-blue-500">
          {tx?.blockNumber}
        </Link>
        <Pill
          variant="secondary"
          text={`${tx?.confirmations ?? 0} Block Confirmation`}
        />
      </div>
    )
  },
  {
    title: 'Timestamp',
    value: tx?.timestamp ? new Date(tx?.timestamp).toDateString() : ''
  },
  {
    title: 'From',
    value: (
      <Link to={`/address?address=${tx?.from}`} className="mr-2 text-blue-500">
        {tx?.from}
      </Link>
    )
  },
  {
    title: 'To',
    value: (
      <Link to={`/address?address=${tx?.to}`} className="mr-2 text-blue-500">
        {tx?.to}
      </Link>
    )
  },
  {
    title: 'Value',
    value: Utils.parseUnits(tx?.value.toString() ?? '0', 'gwei') + ' ETH'
  },
  {
    title: 'Transaction Fee',
    value: `${Utils.parseUnits(
      tx?.receipt?.cumulativeGasUsed.and(tx.gasPrice ?? 1).toString() ?? '0',
      'gwei'
    )} ETH`
  },
  {
    title: 'Gas Price',
    value: `${Utils.parseUnits(tx?.gasPrice?.toString() ?? '0', 'gwei')} Gwei`
  }
]

const TxPage = () => {
  const provider = useProvider()
  const location = useLocation()
  const [txHash, setTxHash] = useState('')
  const [tx, setTx] = useState<Transaction>(null)
  const [loading, setLoading] = useState(false)

  const rows = useMemo(() => _rows(tx), [tx])

  useEffect(() => {
    const hash = new URLSearchParams(location.search).getAll('hash')[0]
    if (hash) {
      setTxHash(hash)
      fetchTxData(hash)
    }
  }, [])

  const fetchTxData = async (hash: string) => {
    setLoading(true)
    try {
      const [tx, receipt] = await Promise.all([
        provider.core.getTransaction(hash),
        provider.core.getTransactionReceipt(hash)
      ])

      if (tx) {
        setTx({ ...tx, receipt })
      }
    } catch (e) {
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleSumbit = async (e: FormEvent) => {
    e.preventDefault()
    fetchTxData(txHash)
  }

  return (
    <div>
      <form className="flex pb-5" onSubmit={handleSumbit}>
        <input
          onChange={(e) => setTxHash(e.target.value)}
          placeholder="Transaction Hash"
          className="grow px-5 py-3 border border-r-0 rounded-l-md border-gray-400 focus:rign-0 focus:outline-none"
          value={txHash}
        />
        <button className="px-5 py-3 bg-zinc-600 hover:bg-zinc-500 text-white rounded-r-md">
          Search
        </button>
      </form>
      {loading && <Loader />}
      {tx && !loading && (
        <DetailsTable title="Transaction Details" rows={rows} />
      )}
    </div>
  )
}
export default TxPage
