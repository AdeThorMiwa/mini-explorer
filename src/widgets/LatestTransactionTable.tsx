import { FC, Fragment, useCallback, useEffect, useState } from 'react'
import Table from '../components/Table'
import useProvider from '../hooks/useProvider'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { NUMBER_OF_LATEST_TRANSACTION } from '../config'
import { useNavigate } from 'react-router-dom'

const headers = [
  'Hash',
  'Method',
  'Block',
  'Time',
  'From',
  'To',
  'Value',
  'Fee'
]

const TransactionItem: FC<TransactionReceipt> = ({
  transactionHash,
  blockNumber,
  from,
  to,
  cumulativeGasUsed
}) => {
  return (
    <Fragment>
      <span>{transactionHash.slice(0, 12)}</span>
      <span>Transfer</span>
      <span>{blockNumber}</span>
      <span>18 secs ago</span>
      <span>{from.slice(0, 5)}</span>
      <span>{to.slice(0, 5)}</span>
      <span>58.85 Gwei</span>
      <span>{cumulativeGasUsed.toString()}</span>
    </Fragment>
  )
}

const LatestTransactionTable = () => {
  const provider = useProvider()
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState<TransactionReceipt[]>()
  const [loading, setLoading] = useState(false)

  const fetchTransactions = useCallback(async () => {
    setLoading(true)

    try {
      let latestBlock = await provider.core.getBlockNumber()
      let txHashes: string[] = []

      while (txHashes.length < NUMBER_OF_LATEST_TRANSACTION) {
        const block = await provider.core.getBlock(latestBlock)
        txHashes = [...txHashes, ...block.transactions]
        latestBlock--
      }

      const promise = txHashes
        .filter((t, i) => i < NUMBER_OF_LATEST_TRANSACTION)
        .map(
          (hash) =>
            provider.core.getTransactionReceipt(
              hash
            ) as Promise<TransactionReceipt>
        )

      setTransactions(await Promise.all(promise))
    } catch (e) {
      console.log('Error Occured: ', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [])

  return (
    <section className="w-[50%]">
      <h3>Latest Transactions</h3>
      <Table
        headers={headers}
        gridCols="grid-cols-8"
        data={transactions ?? []}
        render={(item, i) => (
          <TransactionItem {...(item as TransactionReceipt)} key={i} />
        )}
        loading={loading}
        onItemClick={(item) =>
          navigate(`/tx?hash=${(item as TransactionReceipt).transactionHash}`)
        }
      />
    </section>
  )
}
export default LatestTransactionTable
