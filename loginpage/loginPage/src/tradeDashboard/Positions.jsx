import React from 'react'

const Positions = (props) => {
  return (
    <div>
  <div className='flex justify-around mt-2'>
            <h2 className='font-bold'>Net Qty: 0</h2>
            <h2 className='font-bold'>MTM: 32055.50</h2>
        </div>
      <div className=' w-screen border-black '>
      <div className='w-screen'>
  <table className="w-screen ">
    <thead className='bg-blue-100 border-2 border-black w-screen'>
      <tr className=''>
        <th className="text-center border-2 border-black">Symbol Name</th>
        <th className="text-center border-2 border-black">Product</th>
        <th className="text-center border-2 border-black">NET Qty</th>
        <th className="text-center border-2 border-black">LTP</th>
        <th className="text-center border-2 border-black">P&L</th>
        <th className="text-center border-2 border-black">Avg Price</th>
        <button>Exit</button>
      </tr>
    </thead>
    <tbody>
{console.log(props.Positions)}

    {props.Positions&&props.Positions.day.map((item,index)=>{
            return (
            <tr>
                <td className="text-center">{item.tradingsymbol}</td>
                <td className="text-center">{item.product}</td>
                <td className="text-center">{item.qty}</td>
                <td className="text-center">{item.last_price}</td>
                <td className="text-center">{item.pnl}</td>
                <td className="text-center">{item.average_price}</td>
            </tr>  
            )
          })}

    </tbody>
  </table>
  </div>
  </div>
  </div>
  )
}

export default Positions