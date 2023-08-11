import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../dynamicRoutes';

const Positions = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stopLossValue, setStopLossValue] = useState({
    [props.Positions.day[0].instrument_token]: '-'
  });
  const stopLossForToken = stopLossValue[props.Positions.day[0].instrument_token]; 

  function exitHandler(symbol){
    console.log(symbol)
      try{fetch(`${API_URL}/exit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: window.localStorage.getItem("token"),
          symbol
        }),
      }).then(data=>{
        console.log(data)
        if(data.status){
            toast.success("position squared off", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          }else{
            toast.error("error in closing the position", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          }
      })
    }
    catch(err){
      console.log(err)
    }
    props.exit
    //   }
    // })
  }

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleModalConfirm = () => {
    if (stopLossValue) {
      setIsModalOpen(false);

      // Display a success message
      toast.success('Stop loss set successfully', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    } else {
      // Display an error message if the input value is empty
      toast.error('Please enter a valid stop loss value', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  };

  return (
    <div>
      <div className='flex justify-around mt-2'>
        <h2 className='font-bold'>Net Qty: 0</h2>
        <h2 className='font-bold'>MTM: 32055.50</h2>
      </div>
      <div className='w-screen border-black'>
        <div className='w-screen'>
          <table className='w-screen'>
            <thead className='bg-blue-100 border-2 border-black w-screen'>
              <tr className=''>
                <th className='text-center border-2 border-black'>Symbol Name</th>
                <th className='text-center border-2 border-black'>Product</th>
                <th className='text-center border-2 border-black'>NET Qty</th>
                <th className='text-center border-2 border-black'>SL</th>
                <th className='text-center border-2 border-black'>SL Button</th>
                <th className='text-center border-2 border-black'>LTP</th>
                <th className='text-center border-2 border-black'>P&L</th>
                <th className='text-center border-2 border-black'>Avg Price</th>
                <th className='text-center border-2 border-black'>Exit</th>
              </tr>
            </thead>
            <tbody>
              {props.Positions &&
                props.Positions['day'].map((item, index) => {
                  if (item.quantity !== 0) {
                    return (
                      <tr key={index}>
                        <td className='text-center'>{item.tradingsymbol}</td>
                        <td className='text-center'>{item.product}</td>
                        <td className='text-center'>{item.quantity}</td>
                        <td className='text-center'>{stopLossValue[props.Positions.day[0].instrument_token]}</td>
                        <td className='text-center'>
                          <button onClick={handleClick} className='bg-blue-500 text-white px-2 py-1 rounded'>
                            SL Button
                          </button>
                        </td>
                        <td className='text-center'>{item.last_price}</td>
                        <td className='text-center'>{item.pnl}</td>
                        <td className='text-center'>{item.average_price}</td>
                        <td className='text-center'>
                          <button onClick={() => exitHandler(item.tradingsymbol)} className='bg-red-500 text-white px-2 py-1 rounded'>
                            Exit
                          </button>
                        </td>
                      </tr>
                    );
                  }
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg'>
            <h2 className='text-lg font-semibold mb-4'>Set Stop Loss</h2>
            <label htmlFor='stopLossInput' className='block mb-2'>
              Stop Loss Value:
            </label>
            <input
              type="text"
              id="stopLossInput"
              value={stopLossValue[props.Positions.day[0].instrument_token]}
              onChange={(e) => setStopLossValue({
                ...stopLossValue,
                [props.Positions.day[0].instrument_token]: e.target.value
              })}
              className="w-full px-2 py-1 border rounded mb-4"
            />
            <div className='flex justify-end'>
              <button
                onClick={handleModalConfirm}
                className='bg-blue-500 text-white px-4 py-2 rounded mr-2'
              >
                Confirm
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className='bg-gray-300 text-gray-700 px-4 py-2 rounded'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Positions;
