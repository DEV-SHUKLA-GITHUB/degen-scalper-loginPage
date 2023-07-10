import React, { useState } from 'react';
import Dropdown from './basic components/dropdown';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import Input from './basic components/AutoCompleteInput';

const TradeDashboard = () => {
  const option = ['option1', 'option2', 'option3', 'option4'];
  const optionList = option.map((value) => ({ value, text: value }));

  const [selectedOption1, setSelectedOption1] = useState();
  const [selectedOption2, setSelectedOption2] = useState(optionList[0]);
  const [selectedOption3, setSelectedOption3] = useState(optionList[0]);
  const [selectedOption4, setSelectedOption4] = useState(optionList[0]);
  const [selectedOption5, setSelectedOption5] = useState(optionList[0]);
  const [selectedOption6, setSelectedOption6] = useState(optionList[0]);
  const [selectedOption7, setSelectedOption7] = useState(optionList[0]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [positions,setPositions] = useState(false)
  const [orderBook,setOrderBook] = useState(false)
  const [TradeBook,setTradeBook] = useState(false)
  const [positionButtonClicked, setPositionButtonClicked] = useState(false);
  const [orderBookButtonClicked, setOrderBookButtonClicked] = useState(false);
  const [tradeBookButtonClicked, setTradeBookButtonClicked] = useState(false);
  
  const handleClick = () => {
    fetch("http://localhost:8000/instruments/getInstruments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
        email: window.localStorage.getItem("email"),
        username: window.localStorage.getItem("username"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        data.forEach((instrument) => {
          if (selectedOption1 === instrument.name) {
            fetch("http://localhost:8000/instruments/getData", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                instrumentName: { selectedOption1 },
                token: window.localStorage.getItem("token"),
                email: window.localStorage.getItem("email"),
                username: window.localStorage.getItem("username"),
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                console.log(data);
                console.log(window.localStorage.getItem("email"))
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          } else {
            console.log("failed");
          }
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const handlePositionClick = () => {
    setPositionButtonClicked(true);
    setOrderBookButtonClicked(false);
    setTradeBookButtonClicked(false);
    setPositions(true);
    setOrderBook(false);
    setTradeBook(false);
  };
  
  const handleOrderBookClick = () => {
    setOrderBookButtonClicked(true);
    setTradeBookButtonClicked(false);
    setPositionButtonClicked(false);
    setOrderBook(true);
    setTradeBook(true);
    setPositions(true);
  };
  
  const handleTradeBookClick = () => {
    setTradeBookButtonClicked(true);
    setOrderBookButtonClicked(false);
    setPositionButtonClicked(false);
    setTradeBook(true);
    setOrderBook(false);
    setPositions(false);
  };
  
  const handleChange = (e) =>{
    setSelectedOption1(e.target.value)
    console.log(selectedOption1)
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handlePositions = () =>{
    setPositions(true);
    setOrderBook(false);
    setTradeBook(false);
  }
  const handleOrderBook = () =>{
    setOrderBook(true);
    setTradeBook(true);
    setPositions(true);
  }
  const handleTradeBook = () =>{
    setTradeBook(true);
    setOrderBook(false);
    setPositions(false);
  }
  
  return (
    <div>
      <h2>
        Broker: <span className="font-semibold">Zerodha(User: YTNN30)</span>
      </h2>
      <div className="flex p-2 m-2 justify-between">
        {/* <Dropdown
          label="select a option"
          heading="Select options"
          itemList={optionList}
          value={selectedOption1.value}
          onSelect={setSelectedOption1}
        /> */}
        <div className='flex-col'>
        <label htmlFor="input">enter name</label><br />
<div>
<input onChange={handleChange} className=' w-auto border-2 border-black' type="text" />
{/* <Input/> */}
<button className="ml-2 bg-blue-500 text-white font-bold py-2 px-4 border-b-4 rounded" onClick={handleClick}>
        add
      </button>
  </div>        
        </div>
        <div className="relative inline-block text-right">
          <label className="block text-sm text-start font-medium text-gray-700">
            start Date
          </label>
          <div>
            <div className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                className="text-gray-900 text-sm font-semibold bg-white focus:outline-none"
                placeholderText="Select date"
              />
            </div>
          </div>
        </div>
        <div className="relative inline-block text-right">
          <label className="block text-sm text-start font-medium text-gray-700">
            Expiry Date
          </label>
          <div>
            <div className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                className="text-gray-900 text-sm font-semibold bg-white focus:outline-none"
                placeholderText="Select date"
              />
            </div>
          </div>
        </div>
        <Dropdown
          label="call strike price"
          heading="Select options"
          itemList={optionList}
          value={selectedOption4.value}
          onSelect={setSelectedOption4}
        />
        <Dropdown
          label="put strike price"
          heading="Select options"
          itemList={optionList}
          value={selectedOption5.value}
          onSelect={setSelectedOption5}
        />
        <Dropdown
          label="Qty"
          heading="Select options"
          itemList={optionList}
          value={selectedOption6.value}
          onSelect={setSelectedOption6}
        />
        <Dropdown
          label="Product"
          heading="Select options"
          itemList={optionList}
          value={selectedOption7.value}
          onSelect={setSelectedOption7}
        />
      </div>
      <div className='mt-8 ml-4 mr-4 flex justify-between'>
        <h3>strike: BANKNIFTY2238984984</h3>
        <h3>NIFTY BANK</h3>
        <h3>strike: BANKNIFTY84340929</h3>
      </div>
      <div className='mt-2 ml-4 mr-4 flex justify-between'>
        <h3>LTP: 279.3</h3>
        <h3>LTP: 327982.87 <span className='text-red-500'>(-484983/0,49%)</span></h3>
        <h3>279.3 :LTP</h3>
      </div>
      <div className='mt-4 mr-4 flex justify-between'>
        <div>
        <button className="ml-4 bg-red-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 rounded">
        Sell Call
      </button>
      <button className="ml-4 bg-green-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 rounded">
        Buy Call
      </button>
        </div>
        <div>
        <button className="ml-4 bg-white hover:bg-blue-400 text-red-500 font-bold py-2 px-4 border-b-4 rounded border-2 border-red-600">
        Close all Positions
      </button>
      <button className="ml-4 bg-white hover:bg-blue-400 text-red-500 font-bold py-2 px-4 border-b-4 rounded border-2 border-red-600">
        Cancel all orders
      </button>
        </div>
        <div>
        <button className="ml-4 bg-green-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 rounded">
        Buy Put
      </button>
      <button className="ml-4 bg-red-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 rounded">
        Sell Put
      </button>
        </div>
      </div>
   <div>
   <div className=''>
   <div className="flex mt-8 border-b-4 border-pink-300 ">
      <button
        className={`ml-8 font-medium w-40 h-10 border-0 border-white rounded ${positionButtonClicked ? 'bg-pink-200' : ''}`}
        onClick={handlePositionClick}
      >
        positions
      </button>
      <button
        className={`ml-8 font-medium w-40 h-10 border-0 rounded ${orderBookButtonClicked ? 'bg-pink-200' : ''}`}
        onClick={handleOrderBookClick}
      >
        Order Book
      </button>
      <button
        className={`ml-8 font-medium w-40 h-10 border-0 rounded ${tradeBookButtonClicked ? 'bg-pink-200' : ''}`}
        onClick={handleTradeBookClick}
      >
        Trade Book
      </button>
    </div>
        <div className='flex justify-around mt-2'>
            <h2 className='font-bold'>Net Qty: 0</h2>
            <h2 className='font-bold'>MTM: 32055.50</h2>
        </div>
      </div>
      <div className=' w-screen border-black '>
      <div className='w-screen'>
  <table className="w-screen ">
    <thead className='bg-blue-100 border-2 border-black w-screen'>
      <tr className=''>
        <th className="text-center border-2 border-black">Symbol Name</th>
        <th className="text-center border-2 border-black">Product</th>
        <th className="text-center border-2 border-black">Side</th>
        <th className="text-center border-2 border-black">NET Qty</th>
        <th className="text-center border-2 border-black">LTF</th>
        <th className="text-center border-2 border-black">SL</th>
        <th className="text-center border-2 border-black">SL Button</th>
        <th className="text-center border-2 border-black">UR. P&L</th>
        <th className="text-center border-2 border-black">P&L</th>
        <th className="text-center border-2 border-black">Action</th>
        <th className="text-center border-2 border-black">Avg Price</th>
        <th className="text-center border-2 border-black">Buy Qty</th>
        <th className="text-center border-2 border-black">Buy Price</th>
        <th className="text-center border-2 border-black">Sell Price</th>
        <th className="text-center border-2 border-black">Sell Qty</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="text-center">BANKNIFTY0495030</td>
        <td className="text-center">MARGIN</td>
        <td className="text-center">BUY</td>
        <td className="text-center">100</td>
        <td className="text-center">100307.5</td>
        <td className="text-center">-</td>
        <td className="text-center">-</td>
        <td className="text-center">0.00</td>
        <td className="text-center">76.00</td>
        <td className="text-center">76</td>
        <td className="text-center">-</td>
        <td className="text-center">307...</td>
        <td className="text-center">100</td>
        <td className="text-center">307...</td>
        <td className="text-center">0.00</td>
      </tr>
      <tr>
        <td className="text-center">BANKNIFTY0495030</td>
        <td className="text-center">MARGIN</td>
        <td className="text-center">BUY</td>
        <td className="text-center">100</td>
        <td className="text-center">100307.5</td>
        <td className="text-center">-</td>
        <td className="text-center">-</td>
        <td className="text-center">0.00</td>
        <td className="text-center">76.00</td>
        <td className="text-center">76</td>
        <td className="text-center">-</td>
        <td className="text-center">307...</td>
        <td className="text-center">100</td>
        <td className="text-center">307...</td>
        <td className="text-center">0.00</td>
      </tr>
      <tr>
        <td className="text-center">BANKNIFTY0495030</td>
        <td className="text-center">MARGIN</td>
        <td className="text-center">BUY</td>
        <td className="text-center">100</td>
        <td className="text-center">100307.5</td>
        <td className="text-center">-</td>
        <td className="text-center">-</td>
        <td className="text-center">0.00</td>
        <td className="text-center">76.00</td>
        <td className="text-center">76</td>
        <td className="text-center">-</td>
        <td className="text-center">307...</td>
        <td className="text-center">100</td>
        <td className="text-center">307...</td>
        <td className="text-center">0.00</td>
      </tr>
      <tr>
        <td className="text-center">BANKNIFTY0495030</td>
        <td className="text-center">MARGIN</td>
        <td className="text-center">BUY</td>
        <td className="text-center">100</td>
        <td className="text-center">100307.5</td>
        <td className="text-center">-</td>
        <td className="text-center">-</td>
        <td className="text-center">0.00</td>
        <td className="text-center">76.00</td>
        <td className="text-center">76</td>
        <td className="text-center">-</td>
        <td className="text-center">307...</td>
        <td className="text-center">100</td>
        <td className="text-center">307...</td>
        <td className="text-center">0.00</td>
      </tr>
      <tr>
        <td className="text-center">BANKNIFTY0495030</td>
        <td className="text-center">MARGIN</td>
        <td className="text-center">BUY</td>
        <td className="text-center">100</td>
        <td className="text-center">100307.5</td>
        <td className="text-center">-</td>
        <td className="text-center">-</td>
        <td className="text-center">0.00</td>
        <td className="text-center">76.00</td>
        <td className="text-center">76</td>
        <td className="text-center">-</td>
        <td className="text-center">307...</td>
        <td className="text-center">100</td>
        <td className="text-center">307...</td>
        <td className="text-center">0.00</td>
      </tr>
      <tr>
        <td className="text-center">BANKNIFTY0495030</td>
        <td className="text-center">MARGIN</td>
        <td className="text-center">BUY</td>
        <td className="text-center">100</td>
        <td className="text-center">100307.5</td>
        <td className="text-center">-</td>
        <td className="text-center">-</td>
        <td className="text-center">0.00</td>
        <td className="text-center">76.00</td>
        <td className="text-center">76</td>
        <td className="text-center">-</td>
        <td className="text-center">307...</td>
        <td className="text-center">100</td>
        <td className="text-center">307...</td>
        <td className="text-center">0.00</td>
      </tr>
      <tr>
        <td className="text-center">BANKNIFTY0495030</td>
        <td className="text-center">MARGIN</td>
        <td className="text-center">BUY</td>
        <td className="text-center">100</td>
        <td className="text-center">100307.5</td>
        <td className="text-center">-</td>
        <td className="text-center">-</td>
        <td className="text-center">0.00</td>
        <td className="text-center">76.00</td>
        <td className="text-center">76</td>
        <td className="text-center">-</td>
        <td className="text-center">307...</td>
        <td className="text-center">100</td>
        <td className="text-center">307...</td>
        <td className="text-center">0.00</td>
      </tr>
      <tr>
        <td className="text-center">BANKNIFTY0495030</td>
        <td className="text-center">MARGIN</td>
        <td className="text-center">BUY</td>
        <td className="text-center">100</td>
        <td className="text-center">100307.5</td>
        <td className="text-center">-</td>
        <td className="text-center">-</td>
        <td className="text-center">0.00</td>
        <td className="text-center">76.00</td>
        <td className="text-center">76</td>
        <td className="text-center">-</td>
        <td className="text-center">307...</td>
        <td className="text-center">100</td>
        <td className="text-center">307...</td>
        <td className="text-center">0.00</td>
      </tr>
      <tr>
        <td className="text-center">BANKNIFTY0495030</td>
        <td className="text-center">MARGIN</td>
        <td className="text-center">BUY</td>
        <td className="text-center">100</td>
        <td className="text-center">100307.5</td>
        <td className="text-center">-</td>
        <td className="text-center">-</td>
        <td className="text-center">0.00</td>
        <td className="text-center">76.00</td>
        <td className="text-center">76</td>
        <td className="text-center">-</td>
        <td className="text-center">307...</td>
        <td className="text-center">100</td>
        <td className="text-center">307...</td>
        <td className="text-center">0.00</td>
      </tr>
      <tr>
        <td className="text-center">BANKNIFTY0495030</td>
        <td className="text-center">MARGIN</td>
        <td className="text-center">BUY</td>
        <td className="text-center">100</td>
        <td className="text-center">100307.5</td>
        <td className="text-center">-</td>
        <td className="text-center">-</td>
        <td className="text-center">0.00</td>
        <td className="text-center">76.00</td>
        <td className="text-center">76</td>
        <td className="text-center">-</td>
        <td className="text-center">307...</td>
        <td className="text-center">100</td>
        <td className="text-center">307...</td>
        <td className="text-center">0.00</td>
      </tr>
      <tr>
        <td className="text-center">BANKNIFTY0495030</td>
        <td className="text-center">MARGIN</td>
        <td className="text-center">BUY</td>
        <td className="text-center">100</td>
        <td className="text-center">100307.5</td>
        <td className="text-center">-</td>
        <td className="text-center">-</td>
        <td className="text-center">0.00</td>
        <td className="text-center">76.00</td>
        <td className="text-center">76</td>
        <td className="text-center">-</td>
        <td className="text-center">307...</td>
        <td className="text-center">100</td>
        <td className="text-center">307...</td>
        <td className="text-center">0.00</td>
      </tr>
      <tr>
        <td className="text-center">BANKNIFTY0495030</td>
        <td className="text-center">MARGIN</td>
        <td className="text-center">BUY</td>
        <td className="text-center">100</td>
        <td className="text-center">100307.5</td>
        <td className="text-center">-</td>
        <td className="text-center">-</td>
        <td className="text-center">0.00</td>
        <td className="text-center">76.00</td>
        <td className="text-center">76</td>
        <td className="text-center">-</td>
        <td className="text-center">307...</td>
        <td className="text-center">100</td>
        <td className="text-center">307...</td>
        <td className="text-center">0.00</td>
      </tr>
    </tbody>
  </table>
</div>
</div>
   </div>
</div>

  );
};

export default TradeDashboard;
