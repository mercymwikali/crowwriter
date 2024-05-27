import { Typography } from 'antd'
import React from 'react'

const MypendingTrans = () => {

    //this wo
  return (
    <div>
    <Typography.Title level={2} underline>Pending Payments</Typography.Title>
   <table className="table table-hover table-responsive">
            <thead>
                <tr>
                    <th scope='col'>#</th>
                    <th scope='col'>Invoice No.</th>
                    <th scope='col'>Date Posted</th>
                    <th scope='col'>Amount</th>
                    <th scope='col'>Actions</th>
                </tr>
                </thead>
                {/* since the table is null now render no records found */}
                <tbody>
                    <p className='text-danger py-2'>No records found</p>
                </tbody>

            </table>
</div>
  )
}

export default MypendingTrans