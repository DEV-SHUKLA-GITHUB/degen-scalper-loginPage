import React from 'react'

const Tradebook = (props) => {
    return (
        <div className="flex flex-col gap-4 bg-[#101013] text-white w-full h-full">
        {/* header - nifty time  */}
    
        <h2 className="font-bold text-2xl"></h2>
    
        {/* main area displays cards */}
        <div className="overflow-x-auto">
          <table className="table w-full text-white">
            {/* head */}
            <thead className="bg[#0A0A0C]">
              <tr className=" text-[#BABABA] text-lg">
                <th className="font-normal">Symbol</th>
                {/* <th className="font-normal">LTP</th> */}
                <th className="font-normal">Time Stamp</th>
                <th className="font-normal">Qty</th>
                <th className="font-normal">Order Type</th>
                <th className="font-normal">Transaction Type</th>
    
                <th className="font-normal">Status</th>
                {/* <th className="font-normal">Sell</th> */}
              </tr>
            </thead>
            <tbody className="">
              {/* use map here  */}
              {props.tradebook&&props.tradebook.map((item,index)=>{
                return (
                  <tr  className="bg-[#262832]  border-2 border-[#212126] w-screen" >
                  <th className='mr-10 p-10'>{item.tradingsymbol}</th>
                  <td className='mr-10 p-10'>{item.order_timestamp.split('T')[0]}</td>
                  <td className='mr-10 p-10'>{item.quantity}</td>
                  <td className='mr-10 p-10'>{item.order_type}</td>
                  <td className='mr-10 p-10'>{item.transaction_type}</td>
                  <td className='mr-10 p-10'>{item.status}</td>
                </tr>        
                )
              })}
            </tbody>
          </table>
          
        </div>
      </div>
      )
}

export default Tradebook