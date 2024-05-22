import React, { useState } from 'react';
import { Typography, Table, Button, InputNumber, Input, Popconfirm } from 'antd';

const { Title, Text } = Typography;

const Invoice = () => {
  const [invoiceItems, setInvoiceItems] = useState([
    { key: '1', description: 'Web Development Services', quantity: 1, price: 1000, total: 1000 },
    { key: '2', description: 'Graphic Design Services', quantity: 1, price: 500, total: 500 },
  ]);

  const calculateTotalAmount = (items) => {
    return items.reduce((acc, item) => acc + item.total, 0);
  };

  const [totalAmount, setTotalAmount] = useState(calculateTotalAmount(invoiceItems));

  const handleAddRow = () => {
    const newKey = (invoiceItems.length + 1).toString();
    const newItem = { key: newKey, description: '', quantity: 0, price: 0, total: 0 };
    setInvoiceItems([...invoiceItems, newItem]);
  };

  const handleDeleteRow = (key) => {
    const newItems = invoiceItems.filter(item => item.key !== key);
    setInvoiceItems(newItems);
    setTotalAmount(calculateTotalAmount(newItems));
  };

  const handleInputChange = (key, field, value) => {
    const newItems = invoiceItems.map(item => {
      if (item.key === key) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'No Of Pages' || field === 'Cost Per Page') {
          updatedItem.total = updatedItem['No Of Pages'] * updatedItem['Cost Per Page'];
        }
        return updatedItem;
      }
      return item;
    });
    setInvoiceItems(newItems);
    setTotalAmount(calculateTotalAmount(newItems));
  };
  
  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'Order ID',
      key: 'Order ID',
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleInputChange(record.key, 'Order ID', e.target.value)}
        />
      ),
    },
    {
      title: 'No Of Pages',
      dataIndex: 'No Of Pages',
      key: 'No Of Pages',
      render: (text, record) => (
        <InputNumber
          min={0}
          value={text}
          onChange={(value) => handleInputChange(record.key, 'No Of Pages', value)}
        />
      ),
    },
    {
      title: 'Cost Per Page',
      dataIndex: 'Cost Per Page',
      key: 'Cost Per Page',
      render: (text, record) => (
        <InputNumber
          min={0}
          value={text}
          onChange={(value) => handleInputChange(record.key, 'Cost Per Page', value)}
        />
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (text) => `ksh ${text.toFixed(2)}`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteRow(record.key)}>
          <Button type="link" danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-4">
        <div>
          <Title level={2}>Invoice</Title>
          <Text>Invoice Number: INV-001</Text><br />
          <Text>Date: 2024-05-22</Text><br />
          <Text>Due Date: 2024-06-22</Text>
        </div>
        <div className="text-right">
          <Text strong>ABC Company</Text><br />
          <Text>123 Main St, Anytown, USA</Text>
        </div>
      </div>

      <div className="mb-4">
        <Text strong>Bill To:</Text><br />
        <Text>John Doe</Text><br />
        <Text>456 Elm St, Othertown, USA</Text>
      </div>

      <Table
        dataSource={invoiceItems}
        columns={columns}
        pagination={false}
        bordered
        footer={() => (
          <div className="text-right">
            <Text strong>Total: ksh {totalAmount.toFixed(2)}</Text>
          </div>
        )}
      />

      <div className="mt-4 text-right">
        <Button type="primary" onClick={handleAddRow}>Add Item</Button>
      </div>

      <div className="mt-4 text-right">
        <Button type="primary">Request Payment</Button>
      </div>
    </div>
  );
};

export default Invoice;
