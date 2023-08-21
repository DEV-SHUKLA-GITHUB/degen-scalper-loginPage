import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../dynamicRoutes';

const Funds = (props) => {
  return (
    // <div>{props.data&&props.data.equity.available.cash}</div>
    // console.log(props.data)
    // hell0
    <div className='w-full text-[#BABABA] text-lg'>
    <div  >
      <table >
        <thead className=' w-screen'>
          <tr className=''>
            <th className='w-1/12 text-center'>Available Cash</th>
            <th className='w-1/12 text-center'>Live balance</th>
            <th className='w-1/12 text-center'>Opening balance</th>
            <th className='w-1/12 text-center'>debits</th>
            <th className='w-1/12 text-center'>equity</th>
            <th className='w-1/12 text-center'>exposure</th>
            <th className='w-1/12 text-center'>holding sales</th>
            <th className='w-1/12 text-center'>adhoc margin</th>
            <th className='w-1/12 text-center'>intraday payin</th>
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