import React, { useState } from 'react';
import Dropdown from './basic components/dropdown';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
  
  const handleClick = () =>{
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
              body: JSON.stringify({instrumentName:{selectedOption1},
              token: window.localStorage.getItem("token"),
              email: window.localStorage.getItem("email"),
              username: window.localStorage.getItem("username"),
            }),
            })
              .then((res) => res.json())
              .then((data) => {
                // console.log(data[`NSE:${selectedOption1}`].last_price);
                console.log(data);
              });
          }
          else{
            console.log("failed")
          }
        });
    
        return Promise.all(fetchPromises);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    
  }
  const handleChange = (e) =>{
    setSelectedOption1(e.target.value)
    console.log(selectedOption1)
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handlePositions = () =>{
    setPositions(true);
  }
  const handleOrderBook = () =>{
    setOrderBook(true);
  }
  const handleTradeBook = () =>{
    setTradeBook(true);
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
      <div className='mt-8 flex justify-between'>
        <h3>strike: BANKNIFTY2238984984</h3>
        <h3>NIFTY BANK</h3>
        <h3>strike: BANKNIFTY84340929</h3>
      </div>
      <div className='mt-2 flex justify-between'>
        <h3>LTP: 279.3</h3>
        <h3>LTP: 327982.87 <span className='text-red-500'>(-484983/0,49%)</span></h3>
        <h3>279.3 :LTP</h3>
      </div>
      <div className='mt-4 flex justify-between'>
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
      <div className='underline'>
        <div className='flex mt-8 '>
            <button className='ml-8 font-medium ' onClick={handlePositions}>positions</button>
            <button className='ml-8 font-medium' onClick={handleOrderBook}>Order book</button>
            <button className='ml-8 font-medium' onClick={handleTradeBook}>Trade book</button>
            <hr />
        </div>
        <div className='flex justify-around'>
            <h2 className='font-bold'>Net Qty: 0</h2>
            <h2 className='font-bold'>MTM: 32055.50</h2>
        </div>
      </div>
    </div>
  );
};

export default TradeDashboard;
