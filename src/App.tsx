import { Fragment, ReactElement, useMemo } from 'react'
import Header from './components/Header'
import { Link, BrowserRouter } from 'react-router-dom'
import Routes from './routes'

function App(): ReactElement {
  const links = useMemo(
    () => [
      { text: 'Home', url: '/' },
      { text: 'Nft Page', url: '/nft' },
      { text: 'Tx Page', url: '/tx' },
      { text: 'Address Page', url: '/address' }
    ],
    []
  )

  return (
    <BrowserRouter>
      <Fragment>
        <Header />
        <div className="flex max-w-[70%] mx-auto mt-5 gap-5 items-start">
          <aside className="flex flex-col min-w-[200px] text-white overflow-hidden rounded-md">
            {links.map((link, i) => (
              <Link
                key={i}
                to={link.url}
                className="w-full border-b px-5 py-3 bg-zinc-600 hover:bg-zinc-400"
              >
                {link.text}
              </Link>
            ))}
          </aside>
          <main className="grow">
            <Routes />
          </main>
        </div>
      </Fragment>
    </BrowserRouter>
  )
}

export default App
