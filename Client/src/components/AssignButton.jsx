// AssignWriter.js
import { Button, Form, Input, Modal, Select, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listWriters } from "../actions/writersActions";
import { assignOrder } from "../actions/orderActions";

const { Option } = Select;

const AssignWriter = ({ selectedorder, onCancel, visible }) => {
  const dispatch = useDispatch();
  const [selectedWriterId, setSelectedWriterId] = useState(null);
  const [writerslist, setWriterslist] = useState([]);
  const [loadingAssign, setLoadingAssign] = useState(false); // State to track loading status
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

  const handleAssignOrder = async () => {
    if (!selectedWriterId) {
      message.error("Please select a writer");
      return;
    }

    setLoadingAssign(true); // Set loading state while assigning

    try {
      // Dispatch action to assign order
      await dispatch(assignOrder(selectedorder.id, selectedWriterId));
      onCancel(); // Close the modal after assigning
    } catch (error) {
      console.error("Error assigning order:", error.message);
      setErrorMessage(error.message); // Set error message state
      message.error(error.message);
    } finally {
      setLoadingAssign(false); // Reset loading state
    }
  };

  return (
    <Modal
      title="Assign Job"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          type="primary"
          onClick={handleAssignOrder}
          loading={loadingAssign} // Use loading state for button
        >
          Assign
        </Button>,
      ]}
    >
      {selectedorder && (
        <>
          <p>Assign this order to a writer:</p>
          <Form.Item label="Order ID">
            <Input value={selectedorder.orderId} readOnly />
          </Form.Item>
          <div className="d-flex align-items-center gap-3">
            <Form.Item label="Select a writer" className="col-10">
              <Select
                showSearch
                placeholder="Select a writer"
                optionFilterProp="children"
                onChange={(value) => setSelectedWriterId(value)}
                
                onSearch={handleSearch}
                filterOption={false} // Disable Antd's built-in filter option as we're handling it in handleSearch
              >
                {writerslist &&
                  writerslist.map((writer) => (
                    <Option key={writer.id} value={writer.id} className="w-100">
                      {writer.username}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </div>
        </>
      )}
    </Modal>
  );
};

export default AssignWriter;
