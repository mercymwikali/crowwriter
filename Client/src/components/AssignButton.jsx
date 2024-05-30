// AssignWriter.js
import { Button, Form, Input, Modal, Select, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listWriters } from "../actions/writersActions";
import { assignOrder } from "../actions/assigningActions";
import { PlusOutlined } from "@ant-design/icons";
import { FaUserPlus } from "react-icons/fa";

const { Option } = Select;

const AssignWriter = ({ selectedorder, onCancel, visible }) => {
  const dispatch = useDispatch();
  const [selectedWriterId, setSelectedWriterId] = useState(null);
  const [writerslist, setWriterslist] = useState([]);
  const [loadingAssign, setLoadingAssign] = useState(false); // State to track loading status
  const [errorMessage, setErrorMessage] = useState(null); // State to hold error message

  // Fetch writers from Redux store
  const writerList = useSelector((state) => state.writersList);
  const { loading, error, users, success } = writerList;

  // Fetch writers when the component mounts
  useEffect(() => {
    if (success) {
      dispatch(listWriters());
    }

    dispatch(listWriters());
  }, [dispatch, success]);

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
      await dispatch(assignOrder(selectedorder.id, selectedWriterId));
      message.success("Writer assigned successfully"); // Display success message
      onCancel(); // Close the modal after successful assignment
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoadingAssign(false); // Reset loading state after assigning
    }
  };
  

  return (
    <Modal
      title="Hire Writer"
      visible={visible}
      onCancel={onCancel}
      width={500}
      footerStyle={{ justifyContent: "center" }}
      maskClosable
      destroyOnClose
      centered
      footerAlign="center"

      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          type="primary"
          onClick={handleAssignOrder}
          loading={loadingAssign} // Use loading state for button
          style={{backgroundColor: 'green', borderColor: 'green'}}

        >
         <span className="px-2"> Hire Writer</span> <FaUserPlus size={20}/>
        </Button>,
      ]}
    >
      {selectedorder && (
        <>
          <Form.Item label="Order ID">
            <Input value={selectedorder.orderId} readOnly />
          </Form.Item>
          <div className="d-flex align-items-center gap-3">
            <Form.Item label="Hire a writer" className="col-12">
              <Select
                showSearch
                placeholder="Hire a writer"
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
          </div>
        </>
      )}
    </Modal>
  );
};

export default AssignWriter;
