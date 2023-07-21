import React, { useState, useEffect } from "react";
import Dropdown from "./basic components/Dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomCombobox from "./basic components/AutoCompleteInput";

const TradeDashboard = () => {
  const socket = new WebSocket("ws://localhost:7000/instruments");

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    const ticks = JSON.parse(event.data);
    console.log('Received ticks:', ticks[0].last_price);
    setSelectedOption2(ticks[0].last_price)

    // Handle the received tick data in the frontend as per your requirements
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected");
  };

  const option = ['option1', 'option2', 'option3', 'option4'];
  const optionList = option.map((value) => ({ value, text: value }));
  const [selectedOption1, setSelectedOption1] = useState();
  const [selectedOption2, setSelectedOption2] = useState();
  const [expiryList ,setExpiryList] = useState();
  const [selectedOption3, setSelectedOption3] = useState();
  const [selectedOption4, setSelectedOption4] = useState(optionList[0]);
  const [selectedOption5, setSelectedOption5] = useState(optionList[0]);
  const [selectedOption6, setSelectedOption6] = useState(optionList[0]);
  const [selectedOption7, setSelectedOption7] = useState(optionList[0]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [positions, setPositions] = useState(false);
  const [orderBook, setOrderBook] = useState(false);
  const [TradeBook, setTradeBook] = useState(false);
  const [positionButtonClicked, setPositionButtonClicked] = useState(false);
  const [orderBookButtonClicked, setOrderBookButtonClicked] = useState(false);
  const [tradeBookButtonClicked, setTradeBookButtonClicked] = useState(false);
  // const [selected, setSelected] = useState(people[0]);
  // const [query, setQuery] = useState("");
  const options = [
    { id: 1, name: "NIFTY" },
    { id: 2, name: "BANKNIFTY" },
    { id: 3, name: "FINNIFTY" },
    // Add more options as needed
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleOptionChange = (selected) => {
    setSelectedOption(selected);
    // You can now access the selected option and perform any necessary actions
    console.log("Selected Option:", selected);
  };

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:7000/instruments");

    return () => {
      // Clean up the WebSocket connection when the component unmounts
      socket.close();
    };

    
  }, []);



  
  const handleClick = (selected) => {
    // setSelectedOption1(selected);
  
    console.log(window.localStorage.getItem("email"));
    fetch("http://localhost:8000/instruments/getInstruments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
        selected,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        for (const instrument of data.instruments) {
          if ((selected.name || selected) === instrument.name) {
            instrumentToken = instrument.instrument_token;
            const initialData = {
              token: window.localStorage.getItem("token"),
              instrumentToken: instrument.instrument_token,
            };
  
            socket.send(JSON.stringify(initialData));
            break;
          } else {
            console.log("failed");
          }
        }
        console.log(data);
        if (data.uniqueExpiryDates && data.uniqueExpiryDates.length > 0) {
          setExpiryList(
            data.uniqueExpiryDates.map((value) => ({ value, text: value }))
          );
          setSelectedOption3(data.uniqueExpiryDates[0]);
        } else {
          setExpiryList([]);
        }
        if (data.uniqueStrikes && data.uniqueStrikes.length > 0) {
          setStrikeList(
            data.uniqueStrikes.map((value) => ({ value, text: value }))
          );
          setSelectedOption4(data.uniqueStrikes[0]);
          setSelectedOption5(data.uniqueStrikes[0]);
        } else {
          setStrikeList([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  useEffect(() => {
      handleClick("NIFTY");      
    }, []);
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
    setTradeBook(false);
    setPositions(false);
  };

  const handleTradeBookClick = () => {
    setTradeBookButtonClicked(true);
    setOrderBookButtonClicked(false);
    setPositionButtonClicked(false);
    setTradeBook(true);
    setOrderBook(false);
    setPositions(false);
  };

  const handleChange = (e) => {
    setSelectedOption1(e.target.value);
    console.log(selectedOption1);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="bg-black text-white h-screen bgPic ">
      <h2>
        Broker: <span className="font-semibold">Zerodha(User: YTNN30)</span>
      </h2>
      <div className="flex p-2 m-2 justify-between ">
        {/* <Dropdown
          label="select a option"
          heading="Select options"
          itemList={optionList}
          value={selectedOption1.value}
          onSelect={setSelectedOption1}
        /> */}
        <div className="flex-col">
          {/* <label htmlFor="input">enter name</label><br /> */}
          {/* <div>
<input onChange={handleChange} className=' w-auto border-2 border-black' type="text" />
<button className="ml-2 bg-blue-500 text-white font-bold py-2 px-4 border-b-4 rounded" onClick={handleClick}>
        add
      </button>
  </div>         */}
          {/* <CustomCombobox
  people={people}
  selected={selected}
  query={query}
  setSelected={setSelected}
  setQuery={setQuery}
/> */}
<div className='flex'>
<CustomCombobox options={options} onChange={handleClick} />
    {/* <button className="ml-2 bg-blue-500 text-white font-bold py-2 px-4 border-b-4 rounded" onClick={handleClick}>
        add
      </button> */}
</div>
        </div>
        <Dropdown
          label="Expiry date"
          heading="select expiry"
          itemList={expiryList}
          value={selectedOption3}
          onSelect={setSelectedOption3}
        />
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
      <div className="mt-8 ml-4 mr-4 flex justify-between">
        <h3>strike: BANKNIFTY2238984984</h3>
        <h3>NIFTY BANK</h3>
        <h3>strike: BANKNIFTY84340929</h3>
      </div>
      <div className="mt-2 ml-4 mr-4 flex justify-between">
        <h3>LTP: 279.3</h3>
        <h3>LTP: {selectedOption2}</h3>
        <h3>279.3 :LTP</h3>
      </div>
      <div className="mt-4 mr-4 flex justify-between">
        <div>
          <button className="ml-4 border hover:bg-gray-800 text-white font-bold py-2 px-4  rounded">
            Sell Call
          </button>
          <button className="ml-4 border hover:bg-gray-800 text-white font-bold py-2 px-4  rounded">
            Buy Call
          </button>
        </div>
        <div>
          <button className="ml-4  hover:bg-blue-400 text-white font-bold py-2 px-4  rounded border-2 ">
            Close all Positions
          </button>
          <button className="ml-4  hover:bg-blue-400 text-white font-bold py-2 px-4  rounded border-2 ">
            Cancel all orders
          </button>
        </div>
        <div>
          <button className="mlhover:bg-blue-400 border hover:bg-gray-800 text-white font-bold py-2 px-4  rounded">
            Buy Put
          </button>
          <button className="ml-4  border hover:bg-gray-800 text-white font-bold py-2 px-4  rounded">
            Sell Put
          </button>
        </div>
      </div>
      <div>
        <div className="flex mt-8 border-b-4 border-cyan-300 ">
          <button
            className={`ml-8 font-medium w-40 h-10 border-0 border-white rounded ${
              positionButtonClicked ? "bg-cyan-200" : ""
            }`}
            onClick={handlePositionClick}
          >
            positions
          </button>
          <button
            className={`ml-8 font-medium w-40 h-10 border-0 rounded ${
              orderBookButtonClicked ? "bg-cyan-200" : ""
            }`}
            onClick={handleOrderBookClick}
          >
            Order Book
          </button>
          <button
            className={`ml-8 font-medium w-40 h-10 border-0 rounded ${
              tradeBookButtonClicked ? "bg-cyan-200" : ""
            }`}
            onClick={handleTradeBookClick}
          >
            Trade Book
          </button>
        </div>
        {orderBook && (
          <div>
            <div className=" w-screen border-black ">
              <div className="w-screen">
                <table className="w-screen ">
                  <thead className=" border-2 border-black w-screen">
                    <tr className="">
                      <th className="text-center border-2 border-black">
                        Symbol Name
                      </th>
                      <th className="text-center border-2 border-black">
                        Product
                      </th>
                      <th className="text-center border-2 border-black">
                        Side
                      </th>
                      <th className="text-center border-2 border-black">
                        NET Qty
                      </th>
                      <th className="text-center border-2 border-black">LTF</th>
                      <th className="text-center border-2 border-black">SL</th>
                      <th className="text-center border-2 border-black">
                        SL Button
                      </th>
                      <th className="text-center border-2 border-black">
                        UR. P&L
                      </th>
                      <th className="text-center border-2 border-black">P&L</th>
                      <th className="text-center border-2 border-black">
                        Action
                      </th>
                      <th className="text-center border-2 border-black">
                        Avg Price
                      </th>
                      <th className="text-center border-2 border-black">
                        Buy Qty
                      </th>
                      <th className="text-center border-2 border-black">
                        Buy Price
                      </th>
                      <th className="text-center border-2 border-black">
                        Sell Price
                      </th>
                      <th className="text-center border-2 border-black">
                        Sell Qty
                      </th>
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
        )}
        {positions && (
          <div>
            <div className="flex justify-around mt-2">
              <h2 className="font-bold">Net Qty: 0</h2>
              <h2 className="font-bold">MTM: 32055.50</h2>
            </div>
            <div className=" w-screen border-black ">
              <div className="w-screen">
                <table className="w-screen ">
                  <thead className=" border-2 border-black w-screen">
                    <tr className="">
                      <th className="text-center border-2 border-black">
                        Symbol Name
                      </th>
                      <th className="text-center border-2 border-black">
                        Product
                      </th>
                      <th className="text-center border-2 border-black">
                        Side
                      </th>
                      <th className="text-center border-2 border-black">
                        NET Qty
                      </th>
                      <th className="text-center border-2 border-black">LTF</th>
                      <th className="text-center border-2 border-black">SL</th>
                      <th className="text-center border-2 border-black">
                        SL Button
                      </th>
                      <th className="text-center border-2 border-black">
                        UR. P&L
                      </th>
                      <th className="text-center border-2 border-black">P&L</th>
                      <th className="text-center border-2 border-black">
                        Action
                      </th>
                      <th className="text-center border-2 border-black">
                        Avg Price
                      </th>
                      <th className="text-center border-2 border-black">
                        Buy Qty
                      </th>
                      <th className="text-center border-2 border-black">
                        Buy Price
                      </th>
                      <th className="text-center border-2 border-black">
                        Sell Price
                      </th>
                      <th className="text-center border-2 border-black">
                        Sell Qty
                      </th>
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
        )}
      </div>
    </div>
  );
};

export default TradeDashboard;
