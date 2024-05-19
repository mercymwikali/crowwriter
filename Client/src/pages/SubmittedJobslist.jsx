import { Skeleton, Typography, message, Tag, Button, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listSubmissions } from '../actions/submitAction';
import { EditFilled, EditTwoTone } from '@ant-design/icons';

const SubmittedJobsList = () => {
    const dispatch = useDispatch();
    const submissionsList = useSelector(state => state.listSubmission);
    const { loading, success, error, submissions } = submissionsList;

    useEffect(() => {
        dispatch(listSubmissions());
    }, [dispatch, success]);

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
                                        <Button type="default" style={{ borderColor: 'green', color: 'green' }} onClick={() => window.open(submission.attachment)}>Download</Button>
                                    </td>
                                    <td className='text-center'>
                                        <Tooltip title='Approve Order'>
                                            <Button type='primary'>
                                                <EditFilled style={{ fontSize: '20px' }} />
                                            </Button>
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No submitted jobs available.</p>
                )
            )}
        </div>
    );
};

export default SubmittedJobsList;
