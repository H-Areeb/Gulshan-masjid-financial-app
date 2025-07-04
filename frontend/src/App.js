import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Toaster } from 'react-hot-toast';
import PrivateRoute from "./routes/PrivateRoute";
import RoleRoute from "./routes/RoleRoute";
import TransactionForm from "./pages/transactions/TransactionForm";
import TransactionList from "./pages/transactions/TransactionList";

function App() {
  return (
    
     
    <Router>
      <Routes>
       
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/transactions/add"
          element={
            <RoleRoute allowedRoles={["admin", "accountant"]}>
              <TransactionForm />
            </RoleRoute>
          }
        />
        <Route path="/transactions" element={<TransactionList />} />

        {/* Add others here */}
      </Routes>
    </Router>
  );
}

export default App;
