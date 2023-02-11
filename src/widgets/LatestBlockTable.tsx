import { FC, Fragment, useCallback, useEffect, useState } from 'react'
import Table from '../components/Table'
import useProvider from '../hooks/useProvider'
import { NUMBER_OF_LATEST_BLOCK } from '../config'
import { getLastNBlockNumbers } from '../utils/array'
import { Block } from '@ethersproject/abstract-provider'
import { useNavigate } from 'react-router-dom'

const headers = [
  'Block',
  'Age',
  'Txn',
  'FR',
  'Gas Used',
  'Gas Limit',
  'Base Fee',
  'Burnt fees'
]

const BlockItem: FC<Block> = ({
  number,
  transactions,
  miner,
  gasUsed,
  gasLimit,
  baseFeePerGas,
  timestamp
}) => {
  return (
    <Fragment>
      <span>{number}</span>
      <span>{timestamp}</span>
      <span>{transactions.length}</span>
      <span>{miner.slice(0, 5)}</span>
      <span>{gasUsed.toString()}</span>
      <span>{gasLimit.toString()}</span>
      <span>{baseFeePerGas?.toString()} Gwei</span>
      <span>0.490771 (-32.89%)</span>
    </Fragment>
  )
}

const LatestBlockTable = () => {
  const provider = useProvider()
  const navigate = useNavigate()
  const [blocks, setBlocks] = useState<Block[]>()
  const [loading, setLoading] = useState(false)

  const fetchBlocks = useCallback(async () => {
    setLoading(true)

    try {
      const latestBlock = await provider.core.getBlockNumber()
      const lastTenBlockNumbers = getLastNBlockNumbers(
        latestBlock,
        NUMBER_OF_LATEST_BLOCK
      )

      const promise = lastTenBlockNumbers.map((blockNumber) =>
        provider.core.getBlock(blockNumber)
      )

      const blocks = await Promise.all(promise)
      setBlocks(blocks)
    } catch (e) {
      console.log('Error Occured: ', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBlocks()
  }, [])

  return (
    <section className="w-[50%]">
      <h3>Latest Blocks</h3>
      <Table
        headers={headers}
        data={blocks ?? []}
        render={(item, i) => <BlockItem {...(item as Block)} key={i} />}
        gridCols="grid-cols-8"
        loading={loading}
        onItemClick={(item) =>
          navigate(`/block?block=${(item as Block).number}`)
        }
      />
    </section>
  )
}
export default LatestBlockTable
