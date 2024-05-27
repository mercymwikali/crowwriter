import { Button, Form, Input, InputNumber, Select, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { listWriters } from "../actions/writersActions";
import { listSubmissions } from '../actions/submitAction';

const { Option } = Select;

const NewFine = () => {
    const dispatch = useDispatch();
    const [selectedWriterId, setSelectedWriterId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [fineAmount, setFineAmount] = useState(null);
    const [fineReason, setFineReason] = useState("");
    const [writersList, setWritersList] = useState([]);
    const [filteredSubmissions, setFilteredSubmissions] = useState([]);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    // Fetch writers from Redux store
    const writerList = useSelector((state) => state.writersList);
    const { loading, error, users } = writerList;

    // Fetch submissions from Redux store
    const submissionsList = useSelector((state) => state.listSubmission);
    // Extract documents from submissionsList
    const { documents: Orders } = submissionsList || { documents: [] }; // Default to an empty array if submissionsList is undefined

    // Fetch writers when the component mounts
    useEffect(() => {
        dispatch(listWriters());
    }, [dispatch]);

    // Update writers list when the users data changes
    useEffect(() => {
        setWritersList(users || []);
    }, [users]);

    // Fetch submissions when the component mounts
    useEffect(() => {
        dispatch(listSubmissions());
    }, [dispatch]);

    // Update filtered submissions when the submissions data changes
    useEffect(() => {
        setFilteredSubmissions(Orders || []);
    }, [Orders]);

    const searchOrder = (value) => {
        // Filter submissions based on the search input
        const filteredSubmissions = Orders.filter((submission) =>
            submission.topic.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSubmissions(filteredSubmissions);
    };

    const handleSearch = (value) => {
        // Filter writers list based on the search input
        const filteredWriters = users.filter((writer) =>
            writer.username.toLowerCase().includes(value.toLowerCase())
        );
        setWritersList(filteredWriters);
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            if (!selectedOrder || !selectedWriterId || !fineAmount || !fineReason) {
                message.error("Please fill in all the fields");
                return;
            }

            // Call API to create fine
            const fine = {
                orderId: selectedOrder.id, // Use id instead of orderId
                writerId: selectedWriterId,
                amount: fineAmount,
                reason: fineReason,
            };
            console.log(fine);

            // Reset form fields
            setSelectedWriterId(null);
            setSelectedOrder(null);
            setFineAmount(null);
            setFineReason("");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <Typography.Title level={3}>New Fine</Typography.Title>
            <div className="div">
                <Form onFinish={handleSubmit} layout='vertical'>
                    {/* display the order topics */}
                    <Form.Item label="Select an order" className="col-12">
                        <Select
                            showSearch
                            placeholder="Select an order"
                            optionFilterProp="children"
                            onChange={(value) => setSelectedOrder(value)}
                            onSearch={searchOrder}
                            filterOption={false} // Disable Antd's built-in filter option as we're handling it in handleSearch
                        >
                            {filteredSubmissions && filteredSubmissions.length > 0 && filteredSubmissions.map((submission) => (
                                <Option key={submission.id} value={submission.id}>
                                    {submission.topic}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <div className="d-block align-items-center gap-3">
                        <Form.Item label="Select a writer" className="col-12">
                            <Select
                                showSearch
                                placeholder="Select a writer"
                                optionFilterProp="children"
                                onChange={(value) => setSelectedWriterId(value)}
                                onSearch={handleSearch}
                                filterOption={false} // Disable Antd's built-in filter option as we're handling it in handleSearch
                            >
                                {writersList && writersList.length > 0 && writersList.map((writer) => (
                                    <Option key={writer.id} value={writer.id}>
                                        {writer.username}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Fine Amount:" className="col-12">
                            <InputNumber
                                min={1}
                                className="w-100"
                                value={fineAmount}
                                onChange={(value) => setFineAmount(value)}
                            />
                        </Form.Item>
                    </div>
                    <Form.Item label="Reason for Fine:" className="">
                        <Input
                            value={fineReason}
                            onChange={(e) => setFineReason(e.target.value)}
                        />
                    </Form.Item>
                    <Button type="primary" className='w-100' htmlType="submit" loading={loading}>Submit</Button>

                </Form>
            </div>
        </div>
    );
};

export default NewFine;
