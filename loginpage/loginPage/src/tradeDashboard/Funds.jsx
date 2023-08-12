import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../dynamicRoutes';

const Funds = (props) => {
  return (
    // <div>{props.data&&props.data.equity.available.cash}</div>
    // console.log(props.data)
    // hell0
    <div className='w-full border-black'>
    <div >
      <table >
        <thead className='bg-blue-100 border-2 border-black w-screen'>
          <tr className=''>
            <th className='text-center border-2 border-black'>Available Cash</th>
            <th className='text-center border-2 border-black'>Live balance</th>
            <th className='text-center border-2 border-black'>Opening balance</th>
            <th className='text-center border-2 border-black'>debits</th>
            <th className='text-center border-2 border-black'>equity</th>
            <th className='text-center border-2 border-black'>exposure</th>
            <th className='text-center border-2 border-black'>holding sales</th>
            <th className='text-center border-2 border-black'>adhoc margin</th>
            <th className='text-center border-2 border-black'>intraday payin</th>
          </tr>
        </thead>
        <tbody>
          {props.data&&
                  <tr>
                    <td className='text-center'>{props.data.equity.available.cash}</td>
                    <td className='text-center'>{props.data.equity.available.live_balance}</td>
                    <td className='text-center'>{props.data.equity.available.opening_balance}</td>
                    <td className='text-center'>{props.data.equity.utilised.debits}</td>
                    <td className='text-center'>{props.data.equity.utilised.equity}</td>
                    <td className='text-center'>{props.data.equity.utilised.exposure}</td>
                    <td className='text-center'>{props.data.equity.utilised.holding_sales}</td>
                    <td className='text-center'>{props.data.equity.available.adhoc_margin}</td>
                    <td className='text-center'>{props.data.equity.available.intraday_payin}</td>
                  </tr>
                  }
        </tbody>
      </table>
    </div>
  </div>

  )
}

export default Funds