import React from 'react'

const Positions = (props) => {

  function exitHandler(symbol){
    console.log(symbol)
    // props.orderbook&&props.orderbook.map(order=>{
    //   if(order.tradingsymbol===Symbol){
      try{fetch("http://localhost:8000/exit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: window.localStorage.getItem("token"),
          symbol
        }),
      }).then(resp=>{
        if(resp.status){
          console.log("position squared off")
        }
        else{
          console.log("error in closing the position")
        }
      })
    }
    catch(err){
      console.log(err)
    }
    //   }
    // })
  }
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

    {props.Positions&&props.Positions['day'].map((item,index)=>{
            if(item.quantity!=0){return (
            <tr key={index}>
                <td className="text-center">{item.tradingsymbol}</td>
                <td className="text-center">{item.product}</td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-center">{item.last_price}</td>
                <td className="text-center">{item.pnl}</td>
                <td className="text-center">{item.average_price}</td>
                <td className='text-center'><button onClick={()=>{exitHandler(item.tradingsymbol)}}>exit</button></td>
            </tr>  
            )}
          })}

    </tbody>
  </table>
  </div>
  </div>
  </div>
  )
}

export default Positions