import { Route, Routes } from 'react-router-dom'
import NftPage from './pages/NftPage'
import TxPage from './pages/TxPage'
import AddressTransferPage from './pages/AddressTransferPage'
import HomePage from './pages/HomePage'
import BlockPage from './pages/BlockDetailsPage'

const Router = () => {
  return (
    <Routes>
      <Route path="address" element={<AddressTransferPage />} />
      <Route path="tx" element={<TxPage />} />
      <Route path="nft" element={<NftPage />} />
      <Route path="block" element={<BlockPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  )
}

export default Router
