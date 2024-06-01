import React, { useEffect, useState } from 'react';
import { Card, Avatar } from 'antd';
import { CreditCardOutlined, SendOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { RiBookOpenFill, RiTaskFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { listBids } from '../actions/bidActions';
import { assignedOrderList } from '../actions/orderActions';
import { listFines } from '../actions/FinesActions';
import FinesLineChart from '../charts/FinesCharts';
import { listSubmissions } from '../actions/submitAction';
import { Bar, Line } from '@ant-design/charts';

const DashboardMgr = () => {
    const dispatch = useDispatch();
    const bidsList = useSelector(state => state.bidsList);
    const submissionsList = useSelector(state => state.listSubmission);
    const assignedOrders = useSelector(state => state.assignedOrdersList);
    const finesList = useSelector(state => state.fineList);

    const { orders: bidsOrders } = bidsList;
    const { submissions: submissions } = submissionsList;
    const { orders: assignedOrdersList } = assignedOrders;
    const { fines } = finesList;

    const [bidsCount, setBidsCount] = useState(0);
    const [submissionCount, setSubmissionCount] = useState(0);
    const [assignedOrdersCount, setAssignedOrdersCount] = useState(0);
    const [finedOrdersCount, setFinedOrdersCount] = useState(0);
    const [finesChartData, setFinesChartData] = useState([]);
    const [topBiddedDisciplines, setTopBiddedDisciplines] = useState([]);

    useEffect(() => {
        dispatch(listBids());
        dispatch(listSubmissions());
        dispatch(assignedOrderList());
        dispatch(listFines());
    }, [dispatch]);

    useEffect(() => {
        if (bidsOrders) {
            setBidsCount(bidsOrders.length);
            processTopBiddedDisciplines(bidsOrders);
        }
    }, [bidsOrders]);

    useEffect(() => {
        if (submissions) {
            setSubmissionCount(submissions && submissions.documents ? submissions.documents.length : 0);
        }
    }, [submissions]);

    useEffect(() => {
        if (assignedOrdersList) {
            setAssignedOrdersCount(assignedOrdersList.length);
        }
    }, [assignedOrdersList]);

    useEffect(() => {
        if (fines) {
            setFinedOrdersCount(fines.length);
        }
    }, [fines]);

    const processTopBiddedDisciplines = (bids) => {
        const disciplineCounts = bids.reduce((acc, bid) => {
            const discipline = bid.discipline;
            acc[discipline] = (acc[discipline] || 0) + 1;
            return acc;
        }, {});

        const sortedDisciplines = Object.entries(disciplineCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);

        setTopBiddedDisciplines(sortedDisciplines);
    };

    const chartData = topBiddedDisciplines.map(([discipline, count]) => ({
        discipline,
        count
    }));

    const barConfig = {
        data: chartData,
        xField: 'discipline',
        yField: 'count',
        seriesField: 'discipline',
        colorField: 'discipline',
        color: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],
        yAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        meta: {
            count: {
                alias: 'Number of Bids',
            },
        },
        legend: {
            position: 'top-left',
        },
        height: 400,
        
    };

       // Define data for the line chart (just a placeholder for demonstration)
       const lineChartData = [
        { time: '00:00', onlineWriters: 10 },
        { time: '01:00', onlineWriters: 15 },
        { time: '02:00', onlineWriters: 20 },
        // Add more data points as needed...
    ];

    const lineConfig = {
        data: lineChartData,
        xField: 'time',
        yField: 'onlineWriters',
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        yAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        meta: {
            onlineWriters: {
                alias: 'Online Writers',
            },
        },
        legend: {
            position: 'top-left',
        },
        height: 400,
    };

    return (
        <div className="container-fluid px-1">
            <div className="row g-3">
                <div className="col-12 col-sm-6 col-md-4">
                    <Link to={'/manager/all-jobs'} className='text-decoration-none'>
                        <Card className='text-center text-white' style={{ backgroundColor: "#174734", border: "2px solid #2f463d", height: '200px' }}>
                            <Avatar shape="square" size="large" icon={<RiBookOpenFill style={{ color: '#fff' }} />} style={{ backgroundColor: '#d0323a' }} />
                            <p className='h4 pt-3'>{bidsCount}</p>
                            <p className='py-1'>Bids List</p>
                        </Card>
                    </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                    <Link to={'/manager/Submitted-Jobs'} className='text-decoration-none'>
                        <Card className='text-center text-white' style={{ backgroundColor: "#c6a815", border: "2px solid #2f463d", height: '200px' }}>
                            <Avatar shape="square" size="large" icon={<SendOutlined style={{ color: '#fff' }} />} style={{ backgroundColor: '#22A550' }} />
                            <p className='h4 pt-3'>{submissionCount}</p>
                            <p className='py-1'>Submissions List</p>
                        </Card>
                    </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                    <Link to={'/manager/Unpaid-Orders'} className='text-decoration-none'>
                        <Card className='text-center text-white' style={{ backgroundColor: "#7b1113", border: "2px solid #2f463d", height: '200px' }}>
                            <Avatar shape="square" size="large" icon={<CreditCardOutlined style={{ color: '#fff' }} />} style={{ backgroundColor: '#2f463d' }} />
                            <p className='h4 pt-3'>10</p>
                            <p className='py-1'>Payment Requests</p>
                        </Card>
                    </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                    <Link to={'/manager/Assigned-jobs'} className='text-decoration-none'>
                        <Card className='text-center text-white' style={{ backgroundColor: "#22A550", border: "2px solid #2f463d", height: '200px' }}>
                            <Avatar shape="square" size="large" icon={<RiTaskFill style={{ color: '#fff' }} />} style={{ backgroundColor: '#174734' }} />
                            <p className='h4 pt-3'>{assignedOrdersCount}</p>
                            <p className='py-1'>Assigned Orders</p>
                        </Card>
                    </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                    <Link to={'/manager/Fined-Orders'} className='text-decoration-none'>
                        <Card className='text-center text-white' style={{ backgroundColor: "#174734", border: "2px solid #2f463d", height: '200px' }}>
                            <Avatar shape="square" size="large" icon={<RiBookOpenFill style={{ color: '#fff' }} />} style={{ backgroundColor: '#d0323a' }} />
                            <p className='h4 pt-3'>{finedOrdersCount}</p>
                            <p className='py-1'>Fined Orders List</p>
                        </Card>
                    </Link>
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                    <Link to={'/manager/Submitted-Jobs'} className='text-decoration-none'>
                        <Card className='text-center text-white' style={{ backgroundColor: "#c6a815", border: "2px solid #2f463d", height: '200px' }}>
                            <Avatar shape="square" size="large" icon={<SendOutlined style={{ color: '#fff' }} />} style={{ backgroundColor: '#22A550' }} />
                            <p className='h4 pt-3'>25</p>
                            <p className='py-1'>Reassigned Orders List</p>
                        </Card>
                    </Link>
                </div>
            </div>
           
            <div className="row g-3 mt-2">
                <div className="col-12 col-md-6">
                    <h3>Top 5 Bidded Disciplines</h3>
                    <Bar {...barConfig} />
                </div>
                <div className="col-12 col-md-6">
                    <h3>Number of Online Writers (Trend)</h3>
                    <Line {...lineConfig} />
                </div>
            </div>
        </div>
    );
}

export default DashboardMgr;
