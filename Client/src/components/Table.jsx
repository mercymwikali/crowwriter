import { DeleteFilled,  EditFilled } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';

const Table = ({ columns, rows,  deleteRow, editRow}) => {
    return (
        <div className="mt-4">
            <table className="table table-hover table-responsive">
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index} scope="col">{column.title}</th>
                        ))}
                        <th scope="col">Status</th>
                        <th scope="col">Action</th> 
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            {columns.map((column, index) => (
                                <td key={index}>{row[column.dataIndex]}</td>
                            ))}
                            <td>
                                <Button  className={`label-${row.status}`} type="primary">{row.status}</Button>
                            </td>
                            <td>
                                <div className='d-flex justify-content-space-around align-items-center gap-3'>
                                    <EditFilled className='fs-5 text-warning' onClick={() => editRow(row.id)} style={{ marginRight: '8px' }} />
                                    <DeleteFilled className='fs-5 text-danger' onClick={() => deleteRow(row.id)} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
