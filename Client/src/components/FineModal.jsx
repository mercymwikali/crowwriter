// FineModal.js
import { Button, Form, Input, InputNumber, Modal, Select, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listWriters } from "../actions/writersActions";
// import { createFine } from "../actions/finesActions"; // Assume there's an action to handle fine creation

const { Option } = Select;

const FineModal = ({ selectedorder, onCancel, visible }) => {
    const dispatch = useDispatch();
    const [selectedWriterId, setSelectedWriterId] = useState(null);
    const [fineAmount, setFineAmount] = useState(null);
    const [fineReason, setFineReason] = useState("");
    const [writerslist, setWriterslist] = useState([]);
    const [loadingFine, setLoadingFine] = useState(false); // State to track loading status
    const [errorMessage, setErrorMessage] = useState(null); // State to hold error message

    // Fetch writers from Redux store
    const writerList = useSelector((state) => state.writersList);
    const { loading, error, users } = writerList;

    // Fetch writers when the component mounts
    useEffect(() => {
        dispatch(listWriters());
    }, [dispatch]);

    // Update writers list when the users data changes
    useEffect(() => {
        setWriterslist(users);
    }, [users]);

    const handleSearch = (value) => {
        // Filter writers list based on the search input
        const filteredWriters = users.filter((writer) =>
            writer.username.toLowerCase().includes(value.toLowerCase())
        );
        setWriterslist(filteredWriters);
    };

    const handleCreateFine = async () => {
        console.log(selectedWriterId, fineAmount, fineReason);
        // if (!selectedWriterId || !fineAmount || !fineReason) {
        //     message.error("Please fill all the fields");
        //     return;
        // }

        // setLoadingFine(true); // Set loading state while creating fine

        // try {
        //     await dispatch(createFine({
        //         orderId: selectedorder.id,
        //         finedToId: selectedWriterId,
        //         amount: fineAmount,
        //         reason: fineReason,
        //     }));
        //     onCancel();
        // } catch (error) {
        //     setErrorMessage(error.message);
        // } finally {
        //     setLoadingFine(false); // Reset loading state after creating fine
        // }
    };

    return (
        <Modal
            title="Create Fine"
            visible={visible}
            onCancel={onCancel}
            width={700}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button
                    type="primary"
                    onClick={handleCreateFine}
                    loading={loadingFine} // Use loading state for button
                >
                    Create Fine
                </Button>,
            ]}
        >
            {selectedorder && (
                <>
                    <p>Create a fine for this order:</p>
                    <Form.Item label="Order ID">
                        <Input value={selectedorder.orderId} readOnly />
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
                                {writerslist && writerslist.length > 0 && writerslist.map((writer) => (
                                    <Option key={writer.id} value={writer.id}>
                                        {writer.username}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Fine Amount" className="col-12">
                            <InputNumber
                                min={1}
                                className="w-100"
                                value={fineAmount}
                                onChange={(value) => setFineAmount(value)}
                            />
                        </Form.Item>
                    </div>
                    <Form.Item label="Reason for Fine">
                        <Input
                            value={fineReason}
                            onChange={(e) => setFineReason(e.target.value)}
                        />
                    </Form.Item>
                </>
            )}
        </Modal>
    );
};

export default FineModal;
