import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { infuraProvider } from 'wagmi/providers/infura';
import { sepolia } from 'wagmi/chains';

import Header from './layout/Header';
import Footer from './layout/Footer';

import Home from '../pages/Home';
import BookAdd from '../pages/BookAdd';
import BookItem from '../pages/BookItem';
import BookBorrow from '../pages/BookBorrow';
import BookReturn from '../pages/BookReturn';
import Styleguide from '../pages/Styleguide';

function App() {
  const { publicClient, webSocketPublicClient } = configureChains(
    [sepolia],
    [infuraProvider({
      apiKey: process.env.REACT_APP_INFURA_API_KEY
    })],
  );

  const config = createConfig({
    autoConnect: true,
    publicClient,
    webSocketPublicClient,
  });

  return (
    <WagmiConfig config={config}>
      <BrowserRouter>
        <div className="wrapper">
          <Header />
          <div className="main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add" element={<BookAdd />} />
                <Route path="/:bookId" element={<BookItem />} />
                <Route path="/:bookId/borrow" element={<BookBorrow />} />
                <Route path="/:bookId/return" element={<BookReturn />} />
                <Route path="/styleguide" element={<Styleguide />} />
              </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </WagmiConfig>
  );
}

export default App;
