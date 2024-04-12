import React, { useState } from 'react';
import {  DollarCircleFilled, EyeFilled } from '@ant-design/icons';
import { Button } from 'antd';
import ViewJob from './viewJob';


const TableView = ({ columns, rows, bidJob }) => {
  const [selectedRow, setSelectedRow] = useState(null); // State to manage the selected row
  const [viewJobVisible, setViewJobVisible] = useState(false); // State to manage the visibility of the ViewJob modal

  // Function to handle opening the View Job modal
  const openViewJobModal = (id) => {
    const selected = rows.find(row => row.id === id);
    setSelectedRow(selected);
    setViewJobVisible(true);
  };

  // Function to handle closing the View Job modal
  const closeViewJobModal = () => {
    setViewJobVisible(false);
  };

  return (
    <div className="mt-4">
      {viewJobVisible && selectedRow && (
        <ViewJob rowData={selectedRow} closeModal={closeViewJobModal} />
      )}
      <table className="table table-hover table-responsive">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} scope="col" className='align-items-center justify-content-center'>{column.title}</th>
            ))}
            <th scope="col">Status</th>
            <th scope="col" className='text-center'>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((column, index) => (
                <td key={index} className='align-items-center justify-content-center'>{row[column.dataIndex]}</td>
              ))}
              <td>
                <Button className={`label-${row.status}`} type="primary">{row.status}</Button>
              </td>
              <td>
                <div className='d-flex justify-content-space-around align-items-center gap-3'>
                  <Button className='label-primary' type="primary" onClick={() => openViewJobModal(row.id)} style={{ marginRight: '8px' }}>
                    <span>View Job</span>
                    <EyeFilled className='fs-5 text-white' onClick={() => openViewJobModal(row.id)} style={{ padding: '0px' }} />
                  </Button>
                  <Button className='text-white bg-success' type="primary" onClick={() => bidJob(row.id)} style={{ marginRight: '8px' }}>
                    <span>Bid Job</span>
                    <DollarCircleFilled className=' fs-6 text-white' onClick={() => bidJob(row.id)} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
