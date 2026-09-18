import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import TripPlanner from './pages/TripPlanner';
import Recommendations from './pages/Recommendations';
import DestinationDetails from './pages/DestinationDetails';
import Itinerary from './pages/Itinerary';
import LocalBusinesses from './pages/LocalBusinesses';
import About from './pages/About';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plan" element={<TripPlanner />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/destination/:id" element={<DestinationDetails />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/businesses" element={<LocalBusinesses />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
