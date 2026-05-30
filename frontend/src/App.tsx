
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';
import Home from './pages/client/Home';
import ClientData from './pages/client/ClientData';
import ConsoleSelection from './pages/client/ConsoleSelection';
import StorageCheck from './pages/client/StorageCheck';
import GameSelection from './pages/client/GameSelection';
import OrderSummary from './pages/client/OrderSummary';
import TrackOrder from './pages/client/TrackOrder';
import XboxTools from './pages/client/XboxTools';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import OrderDetails from './pages/admin/OrderDetails';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

const routerBasename =
  import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

function App() {
  return (
    <OrderProvider>
      <Router basename={routerBasename}>
        <div className="app-container">
          <Routes>
            {/* Client Flow */}
            <Route path="/" element={<Home />} />
            <Route path="/client" element={<ClientData />} />
            <Route path="/console" element={<ConsoleSelection />} />
            <Route path="/storage" element={<StorageCheck />} />
            <Route path="/games" element={<GameSelection />} />
            <Route path="/summary" element={<OrderSummary />} />
            <Route path="/track" element={<TrackOrder />} />
            <Route path="/xbox-tools" element={<XboxTools />} />

            {/* Admin Flow */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/orders/:id" element={
              <ProtectedAdminRoute>
                <OrderDetails />
              </ProtectedAdminRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </OrderProvider>
  );
}

export default App;
