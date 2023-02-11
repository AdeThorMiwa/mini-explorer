import { useLocation } from 'react-router-dom'
import useProvider from '../hooks/useProvider'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import Loader from '../components/Loader'
import DetailsTable, { DetailsTableRow } from '../components/DetailsTable'
import { TokenBalance, TokenMetadataResponse } from 'alchemy-sdk'

type Token = TokenBalance & { metadata: TokenMetadataResponse }
export interface Address {
  address: string
  isContract: boolean
  balance?: string
  tokens?: Token[]
}

const AddressTransferPage = () => {
  const provider = useProvider()
  const location = useLocation()
  const [address, setAddress] = useState('')
  const [addressData, setAddressData] = useState<Address>()
  const [loading, setLoading] = useState<
    'getType' | 'getBalance' | 'getTokens'
  >()

  const balanceRow = useMemo(
    () =>
      [
        {
          title: 'ETH Balance',
          value: addressData?.balance
        }
      ] as DetailsTableRow,
    [addressData?.balance]
  )

  const tokensRow = useMemo(
    () =>
      addressData?.tokens?.map((token) => ({
        title: `${token.metadata.name} (${token.metadata.symbol})`,
        value: Number(
          token.tokenBalance ?? 0 / Math.pow(10, token.metadata.decimals ?? 1)
        ).toFixed(10)
      })) as DetailsTableRow,
    [addressData?.tokens]
  )

  useEffect(() => {
    const address = new URLSearchParams(location.search).getAll('address')[0]
    if (address) {
      setAddress(address)
      fetchAddressData(address)
    }
  }, [])

  const _isContract = async (address: string) => {
    setLoading('getType')
    const type = await provider.core.getCode(address)
    return type !== '0x'
  }

  const getEthBalance = async (address: string) => {
    setLoading('getBalance')
    const ethBalance = await provider.core.getBalance(address)
    return ethBalance.toString()
  }

  const getTokenBalances = async (address: string) => {
    setLoading('getTokens')

    const balances = await provider.core.getTokenBalances(address)

    const nonZeroBalances = balances.tokenBalances.filter((token) => {
      return token.tokenBalance !== '0'
    })

    const tokensPromise = nonZeroBalances.map(async (t) => ({
      ...t,
      metadata: await provider.core.getTokenMetadata(t.contractAddress)
    }))

    return await Promise.all(tokensPromise)
  }

  const fetchAddressData = async (address: string) => {
    try {
      setAddressData({ address, isContract: await _isContract(address) })

      const balance = await getEthBalance(address)
      setAddressData(
        (data) =>
          ({
            ...data,
            balance
          } as Address)
      )

      const tokens: Token[] = await getTokenBalances(address)
      setAddressData((data) => ({ ...data, tokens } as Address))
    } catch (e) {
      alert('Something went wrong')
    } finally {
      setLoading(undefined)
    }
  }

  const handleSumbit = async (e: FormEvent) => {
    e.preventDefault()
    fetchAddressData(address)
  }

  return (
    <div>
      <form className="flex pb-5" onSubmit={handleSumbit}>
        <input
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          className="grow px-5 py-3 border border-r-0 rounded-l-md border-gray-400 focus:rign-0 focus:outline-none"
          value={address}
        />
        <button className="px-5 py-3 bg-zinc-600 hover:bg-zinc-500 text-white rounded-r-md">
          Search
        </button>
      </form>
      {loading === 'getType' && <Loader />}
      {addressData && loading !== 'getType' && (
        <>
          <h2 className="mb-3">
            {addressData.isContract ? 'Contract' : 'Address'}:{' '}
            {addressData.address}
          </h2>
          {loading === 'getBalance' && <Loader />}
          {addressData.balance && loading !== 'getBalance' && (
            <DetailsTable title="Overview" rows={balanceRow} />
          )}
          {loading === 'getTokens' && <Loader />}
          {addressData.tokens?.length && loading !== 'getTokens' && (
            <DetailsTable
              title="Tokens"
              className="mt-5"
              rows={tokensRow ?? []}
            />
          )}
        </>
      )}
    </div>
  )
}
export default AddressTransferPage
