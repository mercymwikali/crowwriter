import React, { useEffect, useState } from 'react';
import { listWriters, deleteUser,UpdateWriter } from '../actions/writersActions';

import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Pagination, Skeleton, Tooltip, message, Modal, Button, Input, Switch } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';

const WriterList = () => {
    const dispatch = useDispatch();
    const writerList = useSelector((state) => state.writersList);
    const { loading, error, users } = writerList;
    const [pageNumber, setPageNumber] = useState(1);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user for edit/delete

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userDelete = useSelector((state) => state.deleteUser);
    const { success: successDelete } = userDelete;

    const writerUpdate = useSelector((state) => state.writersUpdate);
    const { success: successUpdate } = writerUpdate;

    useEffect(() => {
        dispatch(listWriters());
    }, [dispatch, successDelete, successUpdate]);

    useEffect(() => {
        console.log("Writer list:", writerList);
    }, [writerList]);

    const handlePageChange = (pageNumber) => {
        setPageNumber(pageNumber);
    }

    const handleEditModalOpen = (user) => {
        setSelectedUser(user);
        setEditModalVisible(true);
    }

    const handleEditModalClose = () => {
        setSelectedUser(null);
        setEditModalVisible(false);
    }

    const handleDeleteModalOpen = (user) => {
        setSelectedUser(user);
        setDeleteModalVisible(true);
    }

    const handleDeleteModalClose = () => {
        setDeleteModalVisible(false);
    }

    const handleEdit = () => {
        console.log("Selected user:", selectedUser);
        if (selectedUser && selectedUser.id) {
            dispatch(UpdateWriter(selectedUser.id, selectedUser)); // Pass id and updated user object
        } else {
            console.error("Selected user or user ID is null.");
        }
        handleEditModalClose();
    }
    
    const handleDelete = () => {
        console.log("Selected user:", selectedUser); // Debugging statement
        if (selectedUser && selectedUser.id) {
            // Implement delete logic here
            dispatch(deleteUser(selectedUser.id));
        } else {
            // Handle case where selectedUser or selectedUser._id is null
            console.error("Selected user or user ID is null.");
        }
        handleDeleteModalClose();
    }

    return (
        <>
            <h2 className='table-title text-success'>Writers List</h2>
            <div className="d-block d-flex justify-content-end align-items-center my-1">
                <h4><Link className='btn btn-success' to="/add-users" type='button'>Add User</Link></h4>
            </div>
            {loading ? (
                <Skeleton active />
            ) : error ? (
                null
            ) : users ? (
                <table className="table table-hover table-responsive">
                    <thead>
                        <tr>
                            <th scope='col'>#</th>
                            <th scope='col'>Username</th>
                            <th scope='col'>Email</th>
                            <th scope='col'>Role</th>
                            <th scope='col'>Status</th>
                            <th scope='col'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.length > 0 && users.slice((pageNumber - 1) * 25, pageNumber * 25).map((user, index) => (
                            <tr key={user.id}>
                                <td>{(pageNumber - 1) * 25 + index + 1}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <Switch
                                        checked={user.active} // Representing boolean active as a string
                                        onChange={(checked) => setSelectedUser({ ...selectedUser, active: checked })}
                                        style={{ backgroundColor: 'green' }}
                                    />
                                </td>

                                <td>
                                    <div className="d-flex gap-3 align-items-center justify-content-center">
                                        <Tooltip placement='bottom' title='Edit User' className=' cursor-pointer'>
                                            <div className='bg-warning rounded p-2' onClick={() => handleEditModalOpen(user)}>
                                                <EditFilled style={{ color: 'white', fontSize: '18px' }} />
                                            </div>
                                        </Tooltip>
                                        <Tooltip placement='bottom' title='Delete User'>
                                            <div className='bg-danger rounded p-2' onClick={() => handleDeleteModalOpen(user)}>
                                                <DeleteFilled style={{ color: 'white', fontSize: '18px' }} />
                                            </div>
                                        </Tooltip>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : null}
            <Pagination
                activePage={pageNumber}
                itemsCountPerPage={25}
                totalItemsCount={users ? users.length : 0}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
                itemClass="page-item"
                linkClass="page-link"
            />

            {/* // Edit Modal */}
            <Modal
                title="Edit User"
                visible={editModalVisible}
                onCancel={handleEditModalClose}
                footer={[
                    <Button key="cancel" onClick={handleEditModalClose}>
                        Cancel
                    </Button>,
                    <Button key="edit" type="primary" onClick={handleEdit}>
                        Edit
                    </Button>,
                ]}
            >
                {/* Form for editing user */}
                <div className='mb-2'>
                    <label htmlFor="username" className='py-2'>Username:</label>
                    <Input
                        type="text"
                        id="username"
                        value={selectedUser ? selectedUser.username : ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor="email" className='py-2'>Email:</label>
                    <Input
                        type="email"
                        id="email"
                        value={selectedUser ? selectedUser.email : ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor="role" className='py-2'>Role:</label>
                    <Input
                        type="text"
                        id="role"
                        value={selectedUser ? selectedUser.role : ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                    />
                </div>
            </Modal>


            {/* Delete Modal */}
            <Modal
                title="Delete User"
                visible={deleteModalVisible}
                onCancel={handleDeleteModalClose}
                footer={[
                    <Button key="cancel" onClick={handleDeleteModalClose}>
                        Cancel
                    </Button>,
                    <Button key="delete" type="primary" danger onClick={handleDelete}>
                        Delete
                    </Button>,
                ]}
            >
                <p>Are you sure you want to delete this user?</p>
                {/* Display user details */}
            </Modal>
        </>
    );
};

export default WriterList;
