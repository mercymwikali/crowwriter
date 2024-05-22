import { Skeleton, Typography, message, Tag, Button, Tooltip, Flex } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { downloadSubmission, listSubmissions } from '../actions/submitAction';
import { CloudDownloadOutlined, DollarCircleOutlined, EditFilled } from '@ant-design/icons';
import ReassignBtn from '../components/ReassignBtn';
import FineModal from '../components/FineModal'; // Import FineModal

const SubmittedJobsList = () => {
    const dispatch = useDispatch();
    const submissionsList = useSelector(state => state.listSubmission);
    const { loading, success, error, submissions } = submissionsList;
    const [ReassignModal, setReassignModal] = useState(false);
    const [selectedorder, setSelectedorder] = useState(null);
    const [FineModalVisible, setFineModalVisible] = useState(false); // Add state for FineModal

    useEffect(() => {
        dispatch(listSubmissions());
    }, [dispatch, success, error]);

    const handleDownload = async (documentId) => {
        try {
            await dispatch(downloadSubmission(documentId));
        } catch (error) {
            message.error('Failed to download attachment');
        }
    };

    const reassignOrder = (order) => {
        setSelectedorder(order);
        setReassignModal(true);
    };

    const fineOrder = (order) => { // Add function to handle fine button click
        setSelectedorder(order);
        setFineModalVisible(true);
    };

    return (
        <div>
            <Typography.Title level={2}>Submitted Jobs</Typography.Title>
            {loading ? (
                <Skeleton active />
            ) : error ? (
                message.error(error)
            ) : (
                submissions && submissions.documents && submissions.documents.length > 0 ? (
                    <table className="table table-hover table-responsive">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">OrderId</th>
                                <th scope="col">Topic</th>
                                <th scope="col">No of Pages</th>
                                <th scope="col">Amount (ksh)</th>
                                <th scope='col'>Deadline</th>
                                <th scope="col">Status</th>
                                <th scope='col'>Submitted By</th>
                                <th scope='col'>Date Submitted</th>
                                <th scope='col' className='text-center'>Attachment</th>
                                <th scope="col" className='text-center'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.documents.map((submission, index) => (
                                <tr key={submission.documentId}>
                                    <td>{index + 1}</td>
                                    <td>{submission.orderId}</td>
                                    <td>{submission.topic}</td>
                                    <td>{submission.noOfPages}</td>
                                    <td>{submission.amount}</td>
                                    <td>{new Date(submission.deadline).toLocaleDateString()}</td>
                                    <td>
                                        <Tag color={submission.status === 'APPROVED' ? 'green' : 'blue'} bordered={false}><span color='red' className='fw-bold'>{submission.status}</span></Tag>
                                    </td>
                                    <td>{submission.submittedBy}</td>
                                    <td>{new Date(submission.submissionDate).toLocaleDateString()}</td>
                                    <td className='text-center'>
                                        <Tooltip title="Download Attachment File">
                                            <Button
                                                type="primary"
                                                onClick={() => handleDownload(submission.documentId)}
                                            >
                                                <CloudDownloadOutlined style={{ marginRight: '5px', fontSize: '20px' }} />
                                            </Button>
                                        </Tooltip>
                                    </td>
                                    <td className='text-center'>
                                        <Flex gap={4}>
                                            <Tooltip title='Reassign Order'>
                                                <Button type='primary' className='bg-warning' onClick={() => reassignOrder(submission)}>
                                                    <EditFilled style={{ fontSize: '16px' }} />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title='Fine Order'>
                                                <Button className='bg-success' onClick={() => fineOrder(submission)}> {/* Add onClick for fine button */}
                                                    <DollarCircleOutlined style={{ fontSize: '16px', color: 'white' }} />
                                                </Button>
                                            </Tooltip>
                                        </Flex>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No submitted jobs available.</p>
                )
            )}

            <ReassignBtn
                selectedorder={selectedorder}
                visible={ReassignModal}
                onCancel={() => setReassignModal(false)}
            />
            <FineModal // Render FineModal
                selectedorder={selectedorder}
                visible={FineModalVisible}
                onCancel={() => setFineModalVisible(false)}
            />
        </div>
    );
};

export default SubmittedJobsList;
