import React, { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);

  const [sortedJobs, setSortedJobs] = useState([]);

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem('jobs'));
    if (storedJobs) {
      setJobs(storedJobs);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  // Sort jobs by deadline
  useEffect(() => {
    const sortedJobs = [...jobs].sort((a, b) => {
      const deadlineA = new Date(a.deadline);
      const deadlineB = new Date(b.deadline);
      return deadlineA - deadlineB;
    });
    setSortedJobs(sortedJobs);
  }, [jobs]); // Add dependency array to trigger sorting when jobs change

  const addJob = (newJob) => {
    setJobs([...jobs, newJob]);
  };

  const updateJob = (id, updatedJob) => {
    setJobs(jobs.map((job) => (job.id === id ? { ...job, ...updatedJob } : job)));
  };

  const deleteJob = (id) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  return (
    <JobContext.Provider value={{ jobs, addJob, updateJob, deleteJob, sortedJobs }}>
      {children}
    </JobContext.Provider>
  );
};


export const useJobContext = () => {
  return useContext(JobContext);
};
