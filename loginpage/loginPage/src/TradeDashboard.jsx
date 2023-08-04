import React, { useState,useEffect,useRef } from 'react';
import Dropdown from './basic components/Dropdown';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CustomCombobox from './basic components/AutoCompleteInput';
import WatchList from './watchList';
import Orderbook from './tradeDashboard/Orderbook'
import Positions from './tradeDashboard/Positions'
import maindata from '../../backend/routes/data/instrument.json';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const TradeDashboard = () => {

// var instrumentToken;
const [instrumentToken,setInstrumentToken] = useState()
const instrumentTokenRef = useRef(instrumentToken);
    useEffect(() => {
      // Whenever instrumentToken changes, update instrumentTokenRef.current
      instrumentTokenRef.current = instrumentToken;
    }, [instrumentToken]);
  const [ticksData,setTicksData]=useState()
  const [tickData, setTickData] =useState()
  const [pnl, setPnl] = useState("0")
  const option = ['option1', 'option2', 'option3', 'option4'];
  const product = ['MIS','normal'];
  const optionList = option.map((value) => ({ value, text: value }));
  const productList = product.map((value) => ({ value, text: value }));
  const [selectedOption1, setSelectedOption1] = useState();
  const [selectedOption2, setSelectedOption2] = useState();
  const [sellltp, setSellltp] = useState();
  const [expiryList ,setExpiryList] = useState();
  const [strikeList ,setStrikeList] = useState();
  const [selectedOption3, setSelectedOption3] = useState();
  const [selectedOption4, setSelectedOption4] = useState(optionList[0]);
  const [selectedOption5, setSelectedOption5] = useState(optionList[0]);
  const [selectedOption6, setSelectedOption6] = useState(0);
  const [selectedOption7, setSelectedOption7] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const [positions,setPositions] = useState(false)
  const [orderBook,setOrderBook] = useState(false)
  const [TradeBook,setTradeBook] = useState(false)
  const [customize,setCustomize] = useState(false)
  // const instrumentTokenRef = useRef(instrumentToken);
  //   useEffect(() => {
  //     // Whenever instrumentToken changes, update instrumentTokenRef.current
  //     instrumentTokenRef.current = instrumentToken;
  //   }, [instrumentToken]);
  const [orderbook,setOrderbook]=useState()
  const [tradebook, setTradebook]=useState()
  const [fetchedPositions, setFetchedPositions]=useState()
  const orderbookRef=useRef(orderbook)
  const tradebookRef=useRef(tradebook)
  const fetchedPositionsRef=useRef(fetchedPositions)
  useEffect(()=>{
    orderbookRef.current=orderBook
    tradebookRef.current=tradebook
    fetchedPositionsRef.current=fetchedPositions
  },[orderBook, tradebook, fetchedPositions])
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
  const products = [
    { id: 1, name: "MIS" },
    { id: 2, name: "NORMAL" },
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [arrayOfTokens,setArrayOfToken]=useState([{token:8963586, ltp:0,name:"BANKNIFTY"},{token:8963842, ltp:0,name:"NIFTY"},{token:10227202, ltp:0,name:"FINNIFTY"}]);
  const changeArrayOfToken=(newArray)=>{
    setArrayOfToken(newArray)
    console.log(arrayOfTokens)
    console.log(newArray)
    // addToken(newarray[-1]);
  }

  const totalPnl=function( orderBook, ){
    return pnl
  }

  // useEffect(() => {
    // const socket = new WebSocket('ws://localhost:7000/instruments');
    
    

  //   return () => {
  //     // Clean up the WebSocket connection when the component unmounts
  //     socket.close();
  //   };

  
  // }, []);
  // console.log(window.localStorage.getItem("token"))


  function closeAllHandler(){
    try{fetch("http://localhost:8000/exitAll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: window.localStorage.getItem("token")
        }),
      }).then(resp=>{
        if(resp.status){
          console.log("all position squared off")
        }
        else{
          console.log("error in closing the position")
        }
      })
    }
    catch(err){
      console.log(err)
    }
  }

  
  const handleClick = (selected) => {
    console.log("selected", selected)
    setSelectedOption1(selected.name || selected);
    console.log(selectedOption1)
  
    // console.log(window.localStorage.getItem("email"));
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
            // setSelectedOption2(null); // Clear the state when changing instruments
            console.log("This is my instrument token : ",instrumentToken)
            setInstrumentToken(instrument.instrument_token);
            // ticksData.map(tick=>{
            //   // setTicksData(ticks)
            //   // console.log(String(tick.instrument_token),String(instrument.instrument_token))
            //   if (String(tick.instrument_token) === String(instrument.instrument_token)){
              
              //     setSelectedOption2(tick.last_price);
            //   }
            // })
           
            break;
          } else {
            console.log("failed");
          }
        }    
        console.log(data,"data 133");
        setOrderbook(data.orderbook)
        setTradebook(data.tradebook)
        setFetchedPositions(data.positions)
        console.log(fetchedPositions)
        console.log(orderbook)
        console.log(data.positions)
        // console.log(data.tradebook,"trade  book")
        // console.log(data.positions, "positions")
        setAccountName(data.accountName)
        if (data.uniqueExpiryDates && data.uniqueExpiryDates.length > 0) {
          setExpiryList(
            data.uniqueExpiryDates.map((value) => {
              const dateObject = new Date(value.split('T')[0]); // Convert the date string to a Date object
              const formattedDate = dateObject.toISOString().split('T')[0]; // Convert the Date object back to a formatted string
              return { value: formattedDate, text: formattedDate };
            }).sort((a, b) => new Date(a.value) - new Date(b.value))
          );
          console.log(expiryList)
          setSelectedOption3(data.uniqueExpiryDates[0]);
        } else {
          setExpiryList([]);
        }
        if (data.uniqueStrikes && data.uniqueStrikes.length > 0) {
          setStrikeList(
            data.uniqueStrikes.map((value) => ({value, text: value }))
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

    const placeOrder = (orderType)=> {
      console.log(selectedOption7,"test")
      console.log("placedorder:",orderType);
      try{fetch("http://localhost:8000/placeOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: window.localStorage.getItem("token"),
          symbol: format,
          qty: selectedOption6,
          transaction_type: orderType,
          product: "MIS",
          variety: "regular"
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if(data.status == true){
            toast.success("Order Placed", {
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
            toast.error("Error", {
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
    })}
    catch(err) {
      console.log("request error: " + err)
    }
  }

  //   const dateList=[
  //     {value:"2023-07-04T00:00:00.000Z", item: "2023-07-27T00:00:00.000Z"},
  //     {value:"2023-07-11T00:00:00.000Z", item: "2023-07-27T00:00:00.000Z"},
  //     {value:"2023-07-15T00:00:00.000Z", item: "2023-07-27T00:00:00.000Z"},
  //     {value:"2023-07-21T00:00:00.000Z", item: "2023-07-27T00:00:00.000Z"},
  //     {value:"2023-07-27T00:00:00.000Z", item: "2023-07-27T00:00:00.000Z"},
  //     {value:"2023-08-27T00:00:00.000Z", item: "2023-07-27T00:00:00.000Z"},
  
  // ]
  const dateList=expiryList||[{}]
  const date=selectedOption3?selectedOption3:""
  const name=selectedOption1||""
  const price=selectedOption4
  const type="CE"
  function formater(name, price, dateList, date, type){
  
      let formatedName;
      //2023-07-27T00:00:00.000Z
      // console.log(
      const trimedDate=date.split('T')[0]
      const trimedDateList=(dateList.map(item=>item.value&&item.value))
      trimedDateList.map((date,index)=>{
          if(date==trimedDate){
              // console.log(trimedDateList[index+1])
              if(trimedDateList[index+1]&&trimedDateList[index+1].substring(5,7)===date.substring(5,7)){
                  formatedName= name+trimedDate.substring(2,4)+(trimedDate.substring(5,6)==='0'?trimedDate.substring(6,7):trimedDate.substring(5,7))+trimedDate.substring(8)+price+type
              }
              else{
                  function getShortMonth(monthNumber) {
                      switch (monthNumber) {
                        case "01":
                          return 'JAN';
                        case "02":
                          return 'FEB';
                        case "03":
                          return 'MAR';
                        case "04":
                          return 'APR';
                        case "05":
                          return 'MAY';
                        case "06":
                          return 'JUN';
                        case "07":
                          return 'JUL';
                        case "08":
                          return 'AUG';
                        case "09":
                          return 'SEP';
                        case "10":
                          return 'OCT';
                        case "11":
                          return 'NOV';
                        case "12":
                          return 'DEC';
                        default:
                          return 'Invalid month';
                      }
                    }
                  formatedName= name+trimedDate.substring(2,4)+getShortMonth(trimedDate.substring(5,7))+price+type
              }
          }
      })
  
  return formatedName
  }
  const format = formater(name,price,dateList,date,type)


  useEffect(() => {
    // Set up the WebSocket connection and event listeners only once
    const socket = new WebSocket('ws://localhost:7000/instruments');

    socket.onopen = () => {
      console.log('WebSocket connected test');
      console.log("array of token", arrayOfTokens);
      const initialData = {
        token: window.localStorage.getItem("token"),
        instrumentToken: arrayOfTokens,
      };
      console.log(initialData, "initialdata");
      socket.send(JSON.stringify(initialData));
    };
   

    socket.onmessage = (event) => {
      
      
      const ticks = JSON.parse(event.data);
    
      setArrayOfToken((prevArrayOfTokens) => {
        const watchList = [...prevArrayOfTokens]; 
        ticks.forEach((tick) => {
          watchList.forEach((item, index) => {
            if (String(tick.instrument_token) === String(item.token)) {
              watchList[index].ltp = tick.last_price;
            }
            if (String(tick.instrument_token) === String(instrumentTokenRef.current)) {
              setSelectedOption2(tick.last_price);
              setTickData(ticks);
            }
          });
        });
      // console.log(tradebookRef)
      // console.log(ticks,'TICKS')
      setTicksData(ticks)
      // console.log(instrumentTokenRef.current, "frontend");
      ticks.map((tick) => {
        let buy=0, sell=0, temp=0

        
        tradebookRef.current&&tradebookRef.current.map(trade=>{
          if(trade.transaction_type==='BUY'){
            buy+=trade.average_price*trade.quantity
          }else{
            sell+=trade.average_price*trade.quantity
          }
        })
        fetchedPositionsRef.current&&fetchedPositionsRef.current['day'].map(p=>{
          if(String(p.instrument_token)===String(tick.instrument_token)){
            // console.log("sell=", sell)
            // console.log("buy=", buy)
            // console.log((tick.last_price*p.quantity*p.multiplier))
            // console.log("temp=",temp)
            temp+=tick.last_price*p.quantity
            // console.log(p.quantity, tick.last_price, temp )
            // console.log(sell-buy+temp)
            setPnl(sell-buy+temp)
          }
        })
      });
      return watchList; 
    });
  }

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      console.log("useEffect has been deprecated")
      socket.close();
    };
  }, []);

// console.log(fetchedPositions)
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

  // console.log(ticksData,"ticksdata")
  return (
    <div className='flex'>
      <div className='h-screen w-1/5'>
        <WatchList tokens={arrayOfTokens} add={changeArrayOfToken} ticks={ticksData}/>
      </div>
      <div className='h-screen w-3/4'>
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
        {/* <Dropdown
          label="Qty"
          heading="Select options"
          itemList={optionList}
          value={selectedOption6.value}
          onSelect={setSelectedOption6}
        /> */}
{/* <div className='qty-container flex'> */}
  {/* <label htmlFor="input" className="text-xs inline">QTY</label> */}
  <input
    type="number"
    placeholder='QTY 1 to 36' 
    className="h-10 border-2 m-4 rounded border-black"
    value={selectedOption6}
    onChange={(e) => {
      setSelectedOption6(e.target.value);
      console.log(selectedOption6);
    }}
  />
{/* </div> */}
        {/* <Dropdown
          label="Product"
          heading="Select options"
          itemList={productList}
          value={selectedOption7}
          onSelect={setSelectedOption7}
        /> */}
        <CustomCombobox options={products} onChange={setSelectedOption7} />
        <div className= "flex">
          <div>PNL: </div>
          {pnl}
        </div>
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
        <h3>strike: {format}</h3>
        <h3>{selectedOption1}</h3>
        <h3>strike: BANKNIFTY84340929</h3>
      </div>
      <div className='mt-2 ml-4 mr-4 flex justify-between'>
        <h3>LTP: {sellltp}</h3>
        <h3>LTP: {selectedOption2}</h3>
        <h3>279.3 :LTP</h3>
      </div>
      <div className='mt-4 mr-4 flex justify-between'>
        <div>
        <button className="ml-4 bg-red-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 rounded" 
         onClick={()=>{placeOrder("SELL")}}>
        Sell Call  
      </button>
      <button className="ml-4 bg-green-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 rounded "
       onClick={()=>{placeOrder("BUY")}}>
        Buy Call
      </button>
        </div>
        <div>
        <button onClick={closeAllHandler} className="ml-4 bg-white hover:bg-blue-400 text-red-500 font-bold py-2 px-4 border-b-4 rounded border-2 border-red-600">
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
{orderBook && 
<Orderbook orderbook={orderbook}  />
            }
{positions &&   
<Positions orderbook Positions={fetchedPositions&&fetchedPositions} />
}
   </div>
</div>
    </div>

  );
};

export default TradeDashboard;