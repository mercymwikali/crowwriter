import { Button, Form, Input, InputNumber, Modal, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createFine } from "../actions/FinesActions";
import { useNavigate } from "react-router-dom";

const FineModal = ({ selectedorder, onCancel, visible }) => {
    const dispatch = useDispatch();
    const [fineAmount, setFineAmount] = useState(null);
    const [description, setDescription] = useState("");
    const [loadingFine, setLoadingFine] = useState(false);
    const navigate = useNavigate(); // Add useNavigate hook

    const handleCreateFine = async () => {
        if (!fineAmount || !description) {
            message.error("Please fill all the fields");
            return;
        }

        setLoadingFine(true);

        try {
            const payload = {
                orderId: selectedorder.Orderid,
                writerId: selectedorder.submittedById,
                amount: fineAmount,
                description: description,
            };

            await dispatch(createFine(payload));
            onCancel();
            navigate("/manager/Fined-Orders"); // Navigate to the fine-list route after successful creation
        } catch (error) {
            message.error(error.message || "Error creating fine");
        } finally {
            setLoadingFine(false);
        }
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
                    loading={loadingFine}
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
                        <Form.Item label="Writer" className="col-12">
                            <Input value={selectedorder.submittedBy} readOnly />
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
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Item>
                </>
            )}
        </Modal>
    );
};

export default FineModal;
