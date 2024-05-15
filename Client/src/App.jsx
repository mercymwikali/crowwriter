import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Register from './Auth/Register';
import { Login } from './Auth/Login';
import Dashboard from './core/Dashboard.jsx';
import Manager from './core/Manager.jsx';
import NewOrder from './pages/NewOrder.jsx';
import BidsList from './pages/BidsList.jsx';
import JobsPool from './pages/JobsPool.jsx';
import WritersOnProgressJob from './pages/WritersOnProgressJob.jsx';
import CompletedJobs from './pages/CompletedJobs.jsx';
import RejectedJobs from './pages/RejectedJobs.jsx';
import WritersTransactions from './pages/WritersTransanction.jsx';
import RequestPayment from './pages/RequestPayment.jsx';
import CancelledJobs from './pages/CancelledJobs.jsx';
import AllJobs from './pages/AllJobs.jsx';
import WriterList from './pages/WriterList.jsx';
import AddUser from './pages/AddUser.jsx';
import WriterBidList from './pages/WriterBidList.jsx';
import PrivateRoute from './Auth/PrivateRoute.jsx'; // Import PrivateRoute
import { ROLES } from './config/role.js';
import AssignedJobsList from './pages/AssignedJobsList.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Private routes */}
        <Route
          path="/dashboard/*"
          element={<PrivateRoute allowedRoles={[ROLES.WRITER]} element={<Dashboard />} />}
        >
          {/* Index page for Jobs Pool */}
          <Route index element={<JobsPool />} />
          <Route path="jobs-onprogress" element={<WritersOnProgressJob />} />
          <Route path="completed-jobs" element={<CompletedJobs />} />
          <Route path="rejected" element={<RejectedJobs />} />
          <Route path="paid-transactions" element={<WritersTransactions />} />
          <Route path="pending-payments" element={<RequestPayment />} />
          <Route path="writer-bids-list" element={<WriterBidList />} />
        </Route>
        <Route
          path="/manager/*"
          element={<PrivateRoute allowedRoles={[ROLES.MANAGER]} element={<Manager />} />}
        >
          {/* Index page for Order Requirements */}
          <Route index element={<NewOrder />} />
          <Route path="all-jobs" element={<AllJobs />} />
          <Route path="bids-list" element={<BidsList />} />
          <Route path="Assigned-jobs" element={<AssignedJobsList />} />
          <Route path="cancelled-jobs" element={<CancelledJobs />} />
          <Route path="writers-list" element={<WriterList />} />
          <Route path="add-users" element={<AddUser />} />
        </Route>
        {/* Default route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
