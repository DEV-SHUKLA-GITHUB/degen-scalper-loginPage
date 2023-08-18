import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../dynamicRoutes';

const Positions = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInstrumentToken, setSelectedInstrumentToken] = useState(null);
  const [tsl, setTsl] = useState(true);
  const [stoploss, setStoploss] = useState(false);
  const [trailingstoploss, setTrailingstoploss] = useState(false);

  const [price, setPrice] = useState();
  const [trigger_price, setTrigger_price] = useState();
  function exitHandler(symbol) {
    console.log(symbol);
    try {
      fetch(`${API_URL}/exit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: window.localStorage.getItem('token'),
          symbol,
        }),
      }).then((data) => {
        console.log(data);
        if (data.status) {
          toast.success('Position squared off', {
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
          toast.error('Error in closing the position', {
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
      });
    } catch (err) {
      console.log(err);
    }
    props.exit();
  }

  const handleClick = (instrumentToken) => {
    setSelectedInstrumentToken(instrumentToken);
    setStoploss(true)
    setIsModalOpen(true);
  };

  const handleTSLClick = (instrumentToken) => {
    setSelectedInstrumentToken(instrumentToken);
    setTrailingstoploss(true)
    setIsModalOpen(true);
    // props.setTrailingStopLoss({
    //   ...props.trailingStopLoss,
    //   [instrumentToken]: !tsl,
    // });
    // setTsl(!tsl);

  };
  
  const stopLossOrder = (token, price, trigger_price)=> {

    let symbol,qty,transaction_type,product,exchange;

    props.Positions['day'].map(item=>{
      if(String(item.instrument_token)===String(token)){
        symbol=item.tradingsymbol
        qty=item.quantity
        transaction_type=item.quantity>0?"SELL":"BUY"
        product=item.product
        exchange=item.exchange
      }
    })[0]
    
    
    
    try{fetch(`${API_URL}/stopLossOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
        symbol,
        qty,
        transaction_type,
        product,
        variety: "regular",
        price, 
        trigger_price,
        exchange
        
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if(data.status == true){
          console.log(data.data)
          props.setStopLossValue({
            ...props.stopLossValue,
            [selectedInstrumentToken]: {id:data.data},
          })
          console.log("stop loss order placed")
          toast.success("stop loss order Placed", {
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
          toast.error(data.data.message, {
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
        // handleClick(selectedOption1)
  })}
  catch(err) {
    console.log("request error: " + err)
  }
}

  const handleModalConfirm = (instrumentToken) => {
    const stopLossValue = props.stopLossValue[instrumentToken];
    props.setStopLossValue({
      ...props.stopLossValue,
      [selectedInstrumentToken]: {price:price,trigger_price:trigger_price},//set price and trigger_price
    })
    console.log(props.stopLossValue,"value")
    console.log(price,trigger_price)
    stopLossOrder(selectedInstrumentToken,price,trigger_price)
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
    <div className='w-full'>
      <div className='flex justify-around mt-2'>
        <h2 className='font-bold'>Net Qty: 0</h2>
        <h2 className='font-bold'>MTM: 32055.50</h2>
      </div>
      <div className='w-7/8 border-black'>
        <div>
          <table>
            <thead className='bg-blue-100 border-2 border-black w-screen'>
              <tr>
                <th className='text-center border-2 border-black'>Symbol Name</th>
                <th className='text-center border-2 border-black'>Product</th>
                <th className='text-center border-2 border-black'>NET Qty</th>
                <th className='text-center border-2 border-black'>SL</th>
                <th className='text-center border-2 border-black'>SL</th>
                <th className='text-center border-2 border-black'>SL Button</th>
                <th className='text-center border-2 border-black'>TSL</th>
                <th className='text-center border-2 border-black'>TSL Button</th>
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
                        {/* {console.log(props.Positions,"pos")} */}
                        <td className='text-center'>{item.tradingsymbol}</td>
                        <td className='text-center'>{item.product}</td>
                        <td className='text-center'>{item.quantity}</td>
                        <td className='text-center'>
                          {props.stopLossValue[item.instrument_token.price]}
                        </td>
                        <td className='text-center'>
                          {props.stopLossValue[item.instrument_token.trigger_price]}
                        </td>
                        <td className='text-center'>
                          <button
                            onClick={() => handleClick(item.instrument_token)}
                            className='bg-blue-500 text-white px-2 py-1 rounded'
                          >
                            SL Button
                          </button>
                        </td>
                        <td className='text-center'>
                        {props.trailingStopLoss[item.instrument_token]}
                        </td>
                        <td className='text-center'>
                          <button
                            onClick={() => handleTSLClick(item.instrument_token)}
                            className='bg-blue-500 text-white px-2 py-1 rounded'
                          >
                            TSL Button
                          </button>
                        </td>
                        <td className='text-center'>{item.last_price}</td>
                        <td className='text-center'>{item.pnl}</td>
                        <td className='text-center'>{item.average_price}</td>
                        <td className='text-center'>
                          <button
                            onClick={() => exitHandler(item.tradingsymbol)}
                            className='bg-red-500 text-white px-2 py-1 rounded'
                          >
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
      {isModalOpen && selectedInstrumentToken && (
        
        <div className='fixed inset-0 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg'>
            {console.log(selectedInstrumentToken,"selected instrument token")}
            {stoploss&&<div>
              <h2 className='text-lg font-semibold mb-4'>Set Stop Loss</h2>
            <label htmlFor='stopLossInput' className='block mb-2'>
              Stop Loss Value:
            </label>
            <input
              type='text'
              id='stopLossInput'
              // value={props.stopLossValue[selectedInstrumentToken] || ''}
              onChange={(e) => { setPrice(e.target.value)
              }}
              className='w-full px-2 py-1 border rounded mb-4'
            />
            <label htmlFor='stopLossInput' className='block mb-2'>
              Stop Loss Trigger Value:
            </label>
            <input
              type='text'
              id='stopLossTriggerInput'
              // value={}
              onChange={(e) => {setTrigger_price(e.target.value)
              }}
              className='w-full px-2 py-1 border rounded mb-4'
            />
            <div className='flex justify-end'>
              <button
                onClick={() => handleModalConfirm(selectedInstrumentToken)}
                className='bg-blue-500 text-white px-4 py-2 rounded mr-2'
              >
                Confirm
              </button>
              <button
                onClick={() => {

                  setIsModalOpen(false);
                  setStoploss(false)
                  setSelectedInstrumentToken(null);
                }}
                className='bg-gray-300 text-gray-700 px-4 py-2 rounded'
              >
                Cancel
              </button>
            </div></div>}
            {trailingstoploss&&<div>
              <h2 className='text-lg font-semibold mb-4'>Set Trailing Stop Loss</h2>
            <label htmlFor='stopLossInput' className='block mb-2'>
              Trailing Stop Loss Value:
            </label>
            <input
              type='text'
              id='trailingstopLossInput'
              value={props.trailingStopLoss[selectedInstrumentToken] || ''}
              onChange={(e) => props.setTrailingStopLoss({
                ...props.trailingStopLoss,
                [selectedInstrumentToken]: e.target.value,
              })}
              className='w-full px-2 py-1 border rounded mb-4'
            />
            {/* {console.log(props.trailingStopLoss,"tsl")} */}
            <div className='flex justify-end'>
              <button
                onClick={() => setIsModalOpen(false)}
                  //  handleModalConfirm(selectedInstrumentToken)
                  
                className='bg-blue-500 text-white px-4 py-2 rounded mr-2'
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setTrailingstoploss(false)
                  setSelectedInstrumentToken(null);
                }}
                className='bg-gray-300 text-gray-700 px-4 py-2 rounded'
              >
                Cancel
              </button>
            </div></div>}
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Positions;
