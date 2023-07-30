import React, { useState,useEffect } from 'react';
import Dropdown from './basic components/Dropdown';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CustomCombobox from './basic components/AutoCompleteInput';

const TradeDashboard = () => {

// var instrumentToken;
const [instrumentToken,setInstrumentToken] = useState()

  const option = ['option1', 'option2', 'option3', 'option4'];
  const optionList = option.map((value) => ({ value, text: value }));
  const [selectedOption1, setSelectedOption1] = useState();
  const [selectedOption2, setSelectedOption2] = useState();
  const [expiryList ,setExpiryList] = useState();
  const [strikeList ,setStrikeList] = useState();
  const [selectedOption3, setSelectedOption3] = useState();
  const [selectedOption4, setSelectedOption4] = useState(optionList[0]);
  const [selectedOption5, setSelectedOption5] = useState(optionList[0]);
  const [selectedOption6, setSelectedOption6] = useState(optionList[0]);
  const [selectedOption7, setSelectedOption7] = useState(optionList[0]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [positions,setPositions] = useState(false)
  const [orderBook,setOrderBook] = useState(false)
  const [TradeBook,setTradeBook] = useState(false)
  const [customize,setCustomize] = useState(false)
  const [orderbook,setOrderbook]=useState()
  const [accountName,setAccountName]=useState("")
  const [customBuyCallKey, setCustomBuyCallKey] = useState(
    localStorage.getItem('customBuyCallKey') || ''
  );
  const [customSellCallKey, setCustomSellCallKey] = useState(
    localStorage.getItem('customSellCallKey') || ''
  );
  const [customBuyPutKey, setCustomBuyPutKey] = useState(
    localStorage.getItem('customBuyPutKey') || ''
  );
  const [customSellPutKey, setCustomSellPutKey] = useState(
    localStorage.getItem('customSellPutKey') || ''
  );
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
  const [tokenArray, setTokenArray]=useState([])

  // useEffect(() => {
  // const socket = new WebSocket('ws://localhost:7000/instruments');

    

  //   return () => {
  //     // Clean up the WebSocket connection when the component unmounts
  //     socket.close();
  //   };

    
  // }, []);
  // useEffect(()=>{
    
  // },[tokenArray])



  fetch("http://localhost:8000/instruments/getInstruments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: window.localStorage.getItem("token"),
      selected:"NIFTY"
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      // setTokenArray(data.instruments.map(item=>item.instrument_token))
      let arrayOfToken=data.instruments.map(item=>Number(item.instrument_token))
      arrayOfToken=[...new Set(arrayOfToken)];
      console.log(arrayOfToken)
      
      const initialData = {
        token: window.localStorage.getItem("token"),
        instrumentToken:arrayOfToken
      };
      const socket = new WebSocket('ws://localhost:7000/instruments');
      // console.log(currentConnection)
      // currentConnection&&currentConnection.close()
      // setCurrentConnection(socket)
      socket.onopen = () => {
        console.log('WebSocket connected');
        socket.send(JSON.stringify(initialData));
      };

      socket.onmessage = (event) => {
          const ticks = JSON.parse(event.data);
          console.log("ticks",ticks.filter(tick=>tick.instrument_token==instrumentToken).instrument_token)
          setSelectedOption2(ticks[0].last_price);
      };
      socket.onclose = () => {
        console.log('WebSocket disconnected');
      };
    })



// console.log(window.localStorage.getItem("token"))
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
            // Set the selected instrument token in state
            setSelectedOption2(null); // Clear the state when changing instruments
            setInstrumentToken(instrument.instrument_token);
            const initialData = {
              token: window.localStorage.getItem("token"),
              instrumentToken: instrument.instrument_token,
            };
            console.log(initialData,"initialdata");
            // console.log(instrumentToken,"instrumentToken")
            socket.send(JSON.stringify(initialData));
            break;
          } else {
            console.log("failed");
          }
        }    
        console.log(data,"data 133");
        setOrderbook(data.orderbook)
        setAccountName(data.accountName)
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
  // useEffect(() => {
  //     handleClick("NIFTY");      
  //   }, []);

    const socket = new WebSocket('ws://localhost:7000/instruments');
  
  socket.onopen = () => {
    console.log('WebSocket connected');


  };

socket.onmessage = (event) => {
  const ticks = JSON.parse(event.data);
  console.log(instrumentToken, "frontend");
  
  // Make sure instrumentToken is a string for proper comparison
  if (String(ticks[0].instrument_token) === String(instrumentToken)) {
    setSelectedOption2(ticks[0].last_price);
    console.log("ticks received");
  } else {
    console.log("ticks not received");
  }
};

    // console.log('Received ticks:', ticks.last_price);
    // setSelectedOption2(ticks.last_price)

    // Handle the received tick data in the frontend as per your requirements

  socket.onclose = () => {
    console.log('WebSocket disconnected');
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
  const handleKeyDown = (event) => {
    // ... (existing code)

    // Step 4: Check against customized keys for each button
    if (event.key === (customSellCallKey || 'ArrowLeft')) {
      console.log('sell call');
    }
    if (event.key === (customBuyCallKey || 'ArrowUp')) {
      console.log('Buy call');
    }
    if (event.key === (customBuyPutKey || 'ArrowDown')) {
      console.log('buy put');
    }
    if (event.key === (customSellPutKey || 'ArrowRight')) {
      console.log('sell put');
    }
  };

  const handleCustomizeClick = () => {
    setCustomize(true);
  };

  const handleCustomizeClickSave = () => {
    // Step 1: Save the customized keys in local storage
    localStorage.setItem('customBuyCallKey', customBuyCallKey);
    localStorage.setItem('customSellCallKey', customSellCallKey);
    localStorage.setItem('customBuyPutKey', customBuyPutKey);
    localStorage.setItem('customSellPutKey', customSellPutKey);
    setCustomize(false);
  };

  useEffect(() => {
    const customBuyCallKeyFromStorage = localStorage.getItem('customBuyCallKey');
    const customSellCallKeyFromStorage = localStorage.getItem('customSellCallKey');
    const customBuyPutKeyFromStorage = localStorage.getItem('customBuyPutKey');
    const customSellPutKeyFromStorage = localStorage.getItem('customSellPutKey');

    if (customBuyCallKeyFromStorage) {
      setCustomBuyCallKey(customBuyCallKeyFromStorage);
    }
    if (customSellCallKeyFromStorage) {
      setCustomSellCallKey(customSellCallKeyFromStorage);
    }
    if (customBuyPutKeyFromStorage) {
      setCustomBuyPutKey(customBuyPutKeyFromStorage);
    }
    if (customSellPutKeyFromStorage) {
      setCustomSellPutKey(customSellPutKeyFromStorage);
    }
  }, []);

  
  return (
    <div>
      <h2>
        Broker: <span className="font-semibold">Zerodha(User: YTNN30)</span>
      </h2>
      <div className="flex p-2 m-2 justify-between">
        <div className='flex-col'>
        <div className='flex'>
        <CustomCombobox options={options} onChange={handleClick} />
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
          itemList={strikeList}
          value={selectedOption4}
          onSelect={setSelectedOption4}
        />
        <Dropdown
          label="put strike price"
          heading="Select options"
          itemList={strikeList}
          value={selectedOption5}
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
      <button
        className="ml-4 bg-red-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 rounded"
        onKeyDown={handleKeyDown}
      >
        Enable click
      </button>
      <button
        className="ml-4 bg-red-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 rounded"
        onClick={handleCustomizeClick}
      >
        Customize click
      </button>
      {/* <button className="ml-4 bg-red-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 rounded" onKeyDown={handleKeyDown}> Enable click</button>
      <button className="ml-4 bg-red-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 rounded" onClick={handleCustomizeClick}> Customize click</button> */}
      {/* {customize && 
        <div>
        <input type="text" onKeyDown={handleInput1} className='m-2 p-2 border-2 rounded border-black' placeholder='customize key for Buy call' />
        <input type="text" onKeyDown={handleInput2} className='m-2 p-2 border-2 rounded border-black' placeholder='customize key for sell call' />
        <input type="text" onKeyDown={handleInput3} className='m-2 p-2 border-2 rounded border-black' placeholder='customize key for Buy put' />
        <input type="text" onKeyDown={handleInput4} className='m-2 p-2 border-2 rounded border-black' placeholder='customize key for sell put' />
        <button className="ml-4 bg-red-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 rounded" onClick={handleCustomizeClickSave}> save</button>
        </div>
      } */}
            {customize && (
        <div>
          {/* Step 2: Show input fields for customized keys */}
          <input
            type="text"
            value={customBuyCallKey}
            onChange={(e) => setCustomBuyCallKey(e.target.value)}
            className="m-2 p-2 border-2 rounded border-black"
            placeholder="customize key for Buy call"
          />
          <input
            type="text"
            value={customSellCallKey}
            onChange={(e) => setCustomSellCallKey(e.target.value)}
            className="m-2 p-2 border-2 rounded border-black"
            placeholder="customize key for sell call"
          />
          <input
            type="text"
            value={customBuyPutKey}
            onChange={(e) => setCustomBuyPutKey(e.target.value)}
            className="m-2 p-2 border-2 rounded border-black"
            placeholder="customize key for Buy put"
          />
          <input
            type="text"
            value={customSellPutKey}
            onChange={(e) => setCustomSellPutKey(e.target.value)}
            className="m-2 p-2 border-2 rounded border-black"
            placeholder="customize key for sell put"
          />
          {/* Step 3: Save button to save the customized keys */}
          <button
            className="ml-4 bg-red-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 rounded"
            onClick={handleCustomizeClickSave}
          >
            Save
          </button>
        </div>
      )}
      <div className='mt-8 ml-4 mr-4 flex justify-between'>
        <h3>strike: BANKNIFTY2238984984</h3>
        <h3>NIFTY BANK</h3>
        <h3>strike: BANKNIFTY84340929</h3>
      </div>
      <div className='mt-2 ml-4 mr-4 flex justify-between'>
        <h3>LTP: 279.3</h3>
        <h3>LTP: {selectedOption2}</h3>
        <h3>279.3 :LTP</h3>
      </div>
      <div className='mt-4 mr-4 flex justify-between'>
        <div>
        <button className="ml-4 bg-red-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 rounded" >
        Sell Call  
      </button>
      <button className="ml-4 bg-green-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 rounded ">
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
        <button className="ml-4 bg-green-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 rounded " >
        Buy Put
      </button>
      <button className="ml-4 bg-red-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 rounded" > 
        Sell Put
      </button>
        </div>
      </div>
   <div>
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
{orderBook && orderbook.map((item,index)=>{
              // return <MarketPlaceItem key={index} 
              // symbol={item.tradingsymbol} 
              // timeStamp={item.order_timestamp} 
              // qty={item.tradingsymbol}
              //  orderType={item.tradingsymbol}
              //   transactionType={item.transaction_type}
              //    status={item.status}   />
              return (
                <tr className="">
                <th>{item.tradingsymbol}</th>
                <td>{item.order_timestamp}</td>
                <td>{item.tradingsymbol}</td>
                <td>{item.tradingsymbol}</td>
                <td>{item.transaction_type}</td>
                <td>{item.status}</td>
              </tr>
              )
            })}
{positions &&   <div>
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
  </div>}
   </div>
</div>

  );
};

export default TradeDashboard;