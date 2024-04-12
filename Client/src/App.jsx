import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Register from './Auth/Register';
import { Login } from './Auth/Login';
import Dashboard from './core/Dashboard.jsx';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './Auth/PrivateRoute.jsx';
import Manager from './core/Manager.jsx';
import NewOrder from './components/NewOrder.jsx';
import BidsList from './pages/BidsList.jsx';
import JobsPool from './pages/JobsPool.jsx';
import WritersOnProgressJob from './pages/WritersOnProgressJob.jsx';
import CompletedJobs from './pages/CompletedJobs.jsx';
import RejectedJobs from './pages/RejectedJobs.jsx';
import WritersTransactions from './pages/WritersTransanction.jsx';
import RequestPayment from './pages/RequestPayment.jsx';
import AssignedJobs from './pages/AssignedJobs.jsx';
import CancelledJobs from './pages/CancelledJobs.jsx';
import AllJobs from './pages/AllJobs.jsx';

const App = () => {
  // const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="Jobs-Pools" element={<JobsPool />} />
          <Route path='Jobs-Onprogress' element={<WritersOnProgressJob/>}/>
          <Route path='Completed-Jobs' element={<CompletedJobs/>}/>
          <Route path='Rejected' element={<RejectedJobs/>}/>
          <Route path='Paid-Transactions' element={<WritersTransactions/>}/>
          <Route path ='Pending-Payments' element={<RequestPayment/>}/>
        </Route>

        {/* Update child route paths by prepending the parent route path */}
        <Route path="/manager-dashboard" element={<Manager />}>
          <Route path="Order-requirements-details" element={<NewOrder />} />
          <Route path="All-Jobs" element={<AllJobs />} />
          <Route path="Bids-List" element={<BidsList />} />
          <Route path='Pending-Jobs' element={<AssignedJobs/>}/>
          <Route path='Cancelled-Jobs' element={<CancelledJobs/>}/>

        </Route>
        {/* Add a catch-all route for invalid paths */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
