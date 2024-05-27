import React, { useState, useEffect } from 'react';
import { Typography, Table, Button, InputNumber, Input, Popconfirm } from 'antd';
import useAuth from '../hooks/useAuth';

const { Title, Text } = Typography;

const Invoice = () => {
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');

  const user = useAuth();

  useEffect(() => {
    const generatedInvoiceNumber = getNextInvoiceNumber();

    const generateInvoiceDate = () => {
      const currentDate = new Date();
      return currentDate.toISOString().split('T')[0];
    };

    setInvoiceNumber(generatedInvoiceNumber);
    setInvoiceDate(generateInvoiceDate());
  }, []);

  const getNextInvoiceNumber = () => {
    const latestInvoiceNumber = localStorage.getItem('latestInvoiceNumber') || '0000';
    const nextInvoiceNumber = (parseInt(latestInvoiceNumber, 10) + 1).toString().padStart(4, '0');
    localStorage.setItem('latestInvoiceNumber', nextInvoiceNumber);
    return `INV-${nextInvoiceNumber}`;
  };

  const calculateTotalAmount = (items) => {
    return items.reduce((acc, item) => acc + item.total, 0);
  };

  const handleAddRow = () => {
    const newKey = (invoiceItems.length + 1).toString();
    const newItem = { key: newKey, OrderId: '', 'No-of-Pages': 0, 'Cost Per Page': 0, total: 0 };
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
        if (field === 'No-of-Pages' || field === 'Cost Per Page') {
          updatedItem.total = updatedItem['No-of-Pages'] * updatedItem['Cost Per Page'];
        }
        return updatedItem;
      }
      return item;
    });
    setInvoiceItems(newItems);
    setTotalAmount(calculateTotalAmount(newItems));
  };

  const handleRequestPayment = () => {
    // Logic for handling payment request
    console.log('Payment requested!');
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'OrderId',
      key: 'OrderId',
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleInputChange(record.key, 'OrderId', e.target.value)}
        />
      ),
    },
    {
      title: 'Topic',
      dataIndex: 'Topic',
      key: 'Topic',
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleInputChange(record.key, 'Topic', e.target.value)}
        />
      ),
    },
    {
      title: 'No. of Pages',
      dataIndex: 'No-of-Pages',
      key: 'No-of-Pages',
      render: (text, record) => (
        <InputNumber
          min={0}
          value={text}
          onChange={(value) => handleInputChange(record.key, 'No-of-Pages', value)}
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
    <div className="inv-container mt-5">
      <div className="inv-header">
        <div className="invoice-info">
          <Title level={2}>Invoice</Title>
          <Text>Invoice Number:{invoiceNumber}</Text><br />
          <Text>Invoice Date: {invoiceDate}</Text><br />
        </div>
        <div className="user-info">
          <Text strong>{user.UserInfo.username}</Text><br />
          <Text>{user.UserInfo.email}</Text>
        </div>
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

      <div className="actions">
        <Button type="primary" onClick={handleAddRow}>Add Item</Button>
        <Button type="primary" disabled={!invoiceItems.length} onClick={handleRequestPayment}>
          Request Payment
        </Button>
      </div>
    </div>
  );
};

export default Invoice;
