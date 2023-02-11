import LatestBlockTable from '../widgets/LatestBlockTable'
import LatestTransactionTable from '../widgets/LatestTransactionTable'

const HomePage = () => {
  return (
    <div className="flex gap-5">
      <LatestBlockTable />
      <LatestTransactionTable />
    </div>
  )
}
export default HomePage
