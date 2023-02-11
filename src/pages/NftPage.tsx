import { FormEvent, useState } from 'react'
import { Nft } from 'alchemy-sdk'
import useProvider from '../hooks/useProvider'
import { normalizeImageUrl } from '../utils/image'
import Loader from '../components/Loader'

const NftPage = () => {
  const provider = useProvider()
  const [address, setAddress] = useState('')
  const [tokenId, setTokenId] = useState('')
  const [loading, setLoading] = useState(false)

  const [data, setData] = useState<Nft>()

  const handleSumbit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const nft = await provider.nft.getNftMetadata(address, tokenId)
      setData(nft)
    } catch (e) {
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form className="flex pb-5" onSubmit={handleSumbit}>
        <input
          onChange={(e) => setAddress(e.target.value)}
          value={address}
          placeholder="NFT contract address"
          className="grow px-5 py-3 border border-r-0 rounded-l-md border-gray-400 focus:rign-0 focus:outline-none"
        />
        <input
          onChange={(e) => setTokenId(e.target.value)}
          value={tokenId}
          placeholder="Token ID"
          className=" px-5 py-3 border border-gray-400 focus:rign-0 focus:outline-none"
        />
        <button className="px-5 py-3 bg-zinc-600 hover:bg-zinc-500 text-white rounded-r-md">
          Search
        </button>
      </form>
      {loading && <Loader />}
      {data && !loading && (
        <div className="flex gap-5">
          <div className="overflow-hidden max-w-[370px] max-h-[370px]">
            <img
              src={normalizeImageUrl(data.rawMetadata?.image ?? '')}
              alt={data.rawMetadata?.name}
              className="rounded-lg "
            />
          </div>
          <div className="grow">
            <h2 className="text-[30px]">{data.rawMetadata?.name}</h2>
            <div className="mt-2 w-full">
              <h3 className="my-3 border-b">Description</h3>
              <p>{data.rawMetadata?.description}</p>
            </div>
            <div className="mt-2.5">
              <h3 className="mb-5 border-b">Properties</h3>
              <ul className="w-full flex flex-wrap gap-5">
                {data.rawMetadata?.attributes?.map((attr, i) => (
                  <li
                    key={i}
                    className="border border-gray-400 text-[12px] py-2.5 rounded-md text-center"
                  >
                    <h4 className="border-b px-5 uppercase pb-1 text-blue-400">
                      {attr.trait_type}
                    </h4>
                    <h5 className="px-5 pt-1">{attr.value}</h5>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default NftPage
