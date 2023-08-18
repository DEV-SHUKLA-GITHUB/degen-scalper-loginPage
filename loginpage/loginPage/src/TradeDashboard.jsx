import React, { useState,useEffect,useRef } from 'react';
import Dropdown from './basic components/Dropdown';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CustomCombobox from './basic components/AutoCompleteInput';
import WatchList from './watchList';
import Orderbook from './tradeDashboard/Orderbook'
import Tradebook from './tradeDashboard/Tradebook'
import Positions from './tradeDashboard/Positions'
import Funds from './tradeDashboard/Funds'
import maindata from '../../backend/routes/data/instrument.json';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL,SOCKET_API_URL } from './dynamicRoutes';
import {AiOutlineArrowLeft} from 'react-icons/ai';
import {AiOutlineArrowRight} from 'react-icons/ai';
import {AiOutlineArrowUp} from 'react-icons/ai';
import {AiOutlineArrowDown} from 'react-icons/ai';
const TradeDashboard = () => {

// var instrumentToken;
const [errorMessage, setErrorMessage]=useState()
const [instrumentToken,setInstrumentToken] = useState()
const instrumentTokenRef = useRef(instrumentToken);
    useEffect(() => {
      // Whenever instrumentToken changes, update instrumentTokenRef.current
      instrumentTokenRef.current = instrumentToken;
    }, [instrumentToken]);
  const [ticksData,setTicksData]=useState()
  const [tickData, setTickData] =useState()
  const [pnl, setPnl] = useState("0")
  const [margin,setMargin]=useState()
  const option = ['option1', 'option2', 'option3', 'option4'];
  const product = ['MIS','normal'];
  const optionList = option.map((value) => ({ value, text: value }));
  const productList = product.map((value) => ({ value, text: value }));
  const [selectedOption1, setSelectedOption1] = useState();
  const [selectedOption2, setSelectedOption2] = useState();
  const [sellltp, setSellltp] = useState();
  const [expiryList ,setExpiryList] = useState();
  const [strikeList ,setStrikeList] = useState();
  const [callType ,setCallType] = useState("CE");
  const [selectedOption3, setSelectedOption3] = useState();
  const [selectedOption4, setSelectedOption4] = useState(optionList[0]);
  const [selectedOption5, setSelectedOption5] = useState(optionList[0]);
  const [selectedOption6, setSelectedOption6] = useState(0);
  const [selectedOption7, setSelectedOption7] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const [positions,setPositions] = useState(false)
  const [funds,setFunds] = useState(false)
  const [orderBook,setOrderBook] = useState(false)
  const [TradeBook,setTradeBook] = useState(false)
  const [customize,setCustomize] = useState(false)
  const [orderbook,setOrderbook]=useState()
  const [tradebook, setTradebook]=useState()
  const [fetchedPositions, setFetchedPositions]=useState()
  const [qty,setQty]=useState(false)
  const [enableClick, setEnableClick] = useState(false);
  const [callSymbol, setCallSymbol]=useState()
    const callSymbolRef=useRef(callSymbol)
  const [callLTP, setCallLTP]=useState()
  const [putSymbol, setPutSymbol]=useState()
  const putSymbolRef=useRef(putSymbol)
  const [putLTP, setPutLTP]=useState()
  const [putToken, setPutToken]=useState()
  const [callToken, setCallToken]=useState()
  const putTokenRef=useRef(putToken)
  const callTokenRef=useRef(callToken)
  useEffect(()=>{
    callSymbolRef.current=callSymbol
    putSymbolRef.current=putSymbol
    maindata.map(item=>{
      if(String(item.tradingsymbol)===String(callSymbol)){
        setCallToken(item.instrument_token)
      }
      if(String(item.tradingsymbol)===String(putSymbol)){
        setPutToken(item.instrument_token)
      }
      
    })
  },[callSymbol, putSymbol])
  useEffect(()=>{
    callTokenRef.current=callToken
    putTokenRef.current=putToken
  },[callToken,putToken])
  

  const orderbookRef=useRef(orderbook)
  const tradebookRef=useRef(tradebook)
  const fetchedPositionsRef=useRef(fetchedPositions)
  useEffect(()=>{
    // console.log(fetchedPositionsRef.current)
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
  const [FundsButtonClicked, setFundsButtonClicked] = useState(false);
  const options = [
    { id: 1, name: "NIFTY" },
    { id: 2, name: "BANKNIFTY" },
    { id: 3, name: "FINNIFTY" },
  ];
  const products = [
    { id: 1, name: "MIS" },
    { id: 2, name: "NORMAL" },
  ];
  const [lotSize, setLotSize]=useState(50)
  const [stopLoss, setStopLoss]=useState({
    "": ''
  })
  const [trailingStopLoss, setTrailingStopLoss]=useState({
    "": ''
  })
  const trailingStopLossRef=useRef(trailingStopLoss)
  useEffect(()=>{
    trailingStopLossRef.current=trailingStopLoss
  },[trailingStopLoss])
  const stopLossRef=useRef(stopLoss)
  useEffect(()=>{
    stopLossRef.current=stopLoss
  },[stopLoss])

  useEffect(()=>{
    for (let i = 0; i < maindata.length; i++) {
      const instrument = maindata[i];
      if (String(instrument.name) === String(selectedOption1)) {
        setLotSize(instrument.lot_size)
        console.log(selectedOption1,"hello")
        break
      }
    }
  }, [selectedOption1])
  // console.log(lotSize,"lotsize")

  const [arrayOfTokens,setArrayOfToken]=useState([{token:8963586, ltp:0,name:"BANKNIFTY"},{token:8963842, ltp:0,name:"NIFTY"},{token:10227202, ltp:0,name:"FINNIFTY"}]);
  const changeArrayOfToken=(newArray)=>{
    setArrayOfToken(newArray)
    console.log(arrayOfTokens)
    console.log(newArray)
  }


  // either change the fetchedPositions state itself or store the stoplosses of instruments into saperate state stopLoss

  const stopLossHandler=(token,stoploss)=>{
    setFetchedPositions(prev=>{
      return {...prev,"day":fetchedPositions["day"].map(p=>{
        if(String(token)===String(p.instrument_token)){
          return 
        }
      })}
    })
  }

  function exit(symbol){
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
        // if()
        // console.log(data)
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
              updatePositions()
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
  }

  const handleInputChange = (e) => {
    setSelectedOption6(e.target.value);

    const inputValue = e.target.value.trim(); 

    if (qty==true && inputValue !== '') {
      const intValue = parseInt(inputValue);
      const isMultiple = intValue % lotSize === 0;
      const isInRange = intValue >= lotSize && intValue <= lotSize * 36;
console.log("qty")
      if (!(isMultiple && isInRange)) {
        setErrorMessage('Please provide a valid quantity.');
      } else {
        setErrorMessage('');
      }
    }
    else if ( inputValue !== '') {
      const intValue = parseInt(inputValue);
      const isInRange = intValue >= 0 && intValue <= 36;
      console.log("lot")

      if (!(isInRange)) {
        setErrorMessage('Please provide a valid quantity.');
      } else {
        setErrorMessage('');
      }
    } else {
      setErrorMessage('');
    }
  };

  const updatePositions=()=>{
    fetch(`${API_URL}/updatePositions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) =>{
        console.log(data.tradebook)
        setOrderbook(data.orderbook)
        setTradebook(data.tradebook)
        setFetchedPositions(data.positions)

      })
  }

  const exitAllHandler=()=>{
    fetch(`${API_URL}/exitAll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) =>{
        console.log("closed all positions")
        // handleClick(selectedOption1)
        updatePositions()


      })
  }
  // const totalPnl=function( orderBook, ){
  //   return pnl
  // }
  
  const handleClick = (selected) => {
    console.log("selected", selected)
    setSelectedOption1(selected.name || selected);
    console.log(selectedOption1)
  
    fetch(`${API_URL}/instruments/getInstruments`, {
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
            console.log("This is my instrument token : ",instrumentToken)
            setInstrumentToken(instrument.instrument_token);
            break;
          } else {
            console.log("failed");
          }
        }    
        console.log(data.margins,"data 133");
        setMargin(data.margins)
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
      setSelectedOption7(products[0])   
    }, []);

    const placeOrder = (orderType , callType)=> {

      // console.log(selectedOption7,"test")
      // console.log("placedorder:",orderType);
      // console.log(selectedOption7.name)
      // console.log(lotSize)
      try{fetch(`${API_URL}/placeOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lotSize,
          token: window.localStorage.getItem("token"),
          symbol: callType=="CE"&&callSymbol||callType=="PE"&&putSymbol,
          qty: selectedOption6,
          transaction_type: orderType,
          product: selectedOption7.name,
          variety: "regular",
          switchQty: qty
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          if(data.status == true){
            console.log("order placed")
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
          updatePositions()
    })}
    catch(err) {
      console.log("request error: " + err)
    }
  }


  const dateList=expiryList||[{}]
  const date=selectedOption3?selectedOption3:""
  const name=selectedOption1||""
  const price=selectedOption4
  const type=callType
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
useEffect(()=>{
  setCallSymbol(formater(name,price,dateList,date,type))
  setPutSymbol(formater(name,selectedOption5,dateList,date,"PE"))
},[selectedOption1,selectedOption4,selectedOption5,selectedOption3])

  useEffect(() => {
    const socket = new WebSocket(`${SOCKET_API_URL}/instruments`);

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

    // console.log(ticks,"ticks")
      setArrayOfToken((prevArrayOfTokens) => {

        const watchList = [...prevArrayOfTokens]; 
        ticks.forEach((tick) => {
          // if(tick.instrument_token=="13408770"){
          //   console.log(tick)
          // }
          //stop loss 
          
          // fetchedPositionsRef.current&&fetchedPositionsRef.current.day.map(p=>{
          //   const currentToken=p.instrument_token
            // console.log(stopLossRef.current, p)
            
            //trailing stop loss
            // if(Object.prototype.hasOwnProperty.call(trailingStopLossRef.current, Number(p.instrument_token))&&trailingStopLossRef.current[currentToken]==true){
            //   if(String(p.instrument_token)===String(tick.instrument_token)){
            //     console.log("test",stopLossRef.current[currentToken], trailingStopLossRef.current[currentToken])
            //   if(Number(stopLossRef.current[currentToken])+1<String(tick.last_price)){
            //     setStopLoss(prev=>{return {...prev,[currentToken]:String(Number(tick.last_price)-1)}})
            //   }
            //   }
            // }

            // if(Object.prototype.hasOwnProperty.call(stopLossRef.current, Number(p.instrument_token))&&stopLossRef.current[currentToken]!="0"){if(String(p.instrument_token)===String(tick.instrument_token)){
            //   if(p.quantity>0){
            //     if(Number(tick.last_price)==Number(stopLossRef.current[Number(p.instrument_token)])){
            //       exit(p.tradingsymbol)
            //       setTrailingStopLoss(prev=>{
            //         return  {...prev, [currentToken]:false}
            //       })
            //       setStopLoss(prev=>{
            //         return  {...prev, [currentToken]:"0"}
            //       })

            //     }
            //   }
            // else if(p.quantity<0){
            //   console.log("sell")

            //   if(Number(tick.last_price)>=Number(stopLossRef.current[Number(p.instrument_token)])){
            //     exit(p.tradingsymbol)
            //     setStopLoss(prev=>{
            //       return  {...prev, [currentToken]:"0"}
            //     })
            //   }
            // }
            // }}
          // })

          //ltp and pnl of positions
        //   if(fetchedPositionsRef.current!=undefined){
        //     const obj={...fetchedPositionsRef.current, day:fetchedPositionsRef.current.day.map(p=>{
        //       // console.log(p.instrument_token)
        //       if(String(p.instrument_token)===String(tick.instrument_token)){
        //         console.log(fetchedPositionsRef.current.day[0].last_price, tick.last_price)
        //         return {...p,last_price:tick.last_price,pnl:(tick.last_price-p.average_price)*p.quantity}
        //       }
        //       return p;
        //     })}
        //     // console.log(obj)
        //   setFetchedPositions(obj)
        // }
        if(fetchedPositionsRef.current!=undefined){
          // console.log(fetchedPositionsRef)
          setFetchedPositions(prev=>{
          return {...prev, day:prev.day.map(p=>{
            if(String(p.instrument_token)===String(tick.instrument_token)){
              return {...p,last_price:tick.last_price,pnl:(tick.last_price-p.average_price)*p.quantity}
            }
            return p;
          })}
        })
      }

          if(String(tick.instrument_token)===String(callTokenRef.current)){
            setCallLTP(tick.last_price)
          }
          if(String(tick.instrument_token)===String(putTokenRef.current)){
            setPutLTP(tick.last_price)
          }
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
      // console.log(ticks,'TICKS')
      // console.log(arrayOfTokens,"array")
      setTicksData(ticks)
      ticks.map((tick) => {
        let buy=0, sell=0, temp=0

        // console.log(tradebookRef )
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
    setFundsButtonClicked(false);
    setPositions(true);
    setOrderBook(false);
    setTradeBook(false);
    setFunds(false)
  };
  
  const handleOrderBookClick = () => {
    setOrderBookButtonClicked(true);
    setTradeBookButtonClicked(false);
    setPositionButtonClicked(false);
    setFundsButtonClicked(false);
    setOrderBook(true);
    setTradeBook(false);
    setPositions(false);
    setFunds(false)
  };
  
  const handleTradeBookClick = () => {
    setTradeBookButtonClicked(true);
    setOrderBookButtonClicked(false);
    setPositionButtonClicked(false);
    setFundsButtonClicked(false);
    setTradeBook(true);
    setOrderBook(false);
    setPositions(false);
    setFunds(false)
  };
  const handleFundsClick = () => {
    setTradeBookButtonClicked(false);
    setOrderBookButtonClicked(false);
    setPositionButtonClicked(false);
    setFundsButtonClicked(true);
    setTradeBook(false);
    setOrderBook(false);
    setPositions(false);
    setFunds(true)
  };



  useEffect(() => {
    const handleKeyDown = (event) => {
      if (enableClick) {
        if (event.key === (customSellCallKey || 'ArrowLeft')) {
          placeOrder("SELL","CE"),setCallType("CE")
        }
        if (event.key === (customBuyCallKey || 'ArrowUp')) {
          console.log('Buy call');
          placeOrder("BUY","CE"),setCallType("CE")
        }
        if (event.key === (customBuyPutKey || 'ArrowDown')) {
          console.log('buy put');
          placeOrder("BUY","PE"),setCallType("PE")
        }
        if (event.key === (customSellPutKey || 'ArrowRight')) {
          console.log('sell put');
          placeOrder("SELL","PE"),setCallType("PE")
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enableClick]);

  const handleCustomizeClick = () => {
    setCustomize(true);
  };

  const handleCustomizeClickSave = () => {
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
  const handleQtyClick =()=>{
    setQty(true)
    console.log(qty)
  }
  const handleLotClick =()=>{
    setQty(false)
    console.log(qty)
  }

  useEffect(() => {
    window.addEventListener("beforeunload", refresh);
    return () => {
      window.removeEventListener("beforeunload", refresh);
    };
  }, []);
  const refresh=(e)=>{ 
    fetch(`${API_URL}/test`,{
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })}
  
  return (
    <div className='flex trade'>
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
<div className='flex'>
  <div className="flex flex-col">
    <input
      type="number"
      placeholder={`QTY (Multiple of ${lotSize}, Range ${lotSize} - ${lotSize * 36})`}
      className="h-10 border-2 m-4 mr-0 rounded border-black px-2 focus:outline-none focus:border-blue-500"
      value={selectedOption6}
      onChange={handleInputChange}
    />
    {errorMessage && <div className="text-red-500 mt-1">{errorMessage}</div>}
  </div>
  <div className="mt-4 border-2 border-gray-500 rounded flex">
    <button
      className={`flex-1 py-2 px-4 focus:outline-none ${
        qty==true ? 'bg-green-500 text-white' : 'hover:bg-gray-100'
      }`}
      onClick={handleQtyClick}
    >
      qty
    </button>
    <button
      className={`flex-1 py-2 px-4 focus:outline-none ${
        qty==false ? 'bg-green-500 text-white' : 'hover:bg-gray-100'
      }`}
      onClick={handleLotClick}
    >
      lot
    </button>
  </div>
</div>


        <CustomCombobox options={products} onChange={setSelectedOption7} />
        <div className= "flex">
          <div>PNL: </div>
          {pnl}
        </div>
      </div>
     <div className="flex items-center mt-4">
        <label className="mr-2">Enable Click:</label>
        <input
          type="checkbox"
          checked={enableClick}
          onChange={(e) => setEnableClick(e.target.checked)}
          // onKeyDown={handleKeyDown}
        />
      </div>
      {/* <button
        className="ml-4 bg-red-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 rounded"
        onKeyDown={handleKeyDown}
      >
        Enable click
      </button> */}
      <button
        className="ml-4 bg-red-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 rounded"
        onClick={handleCustomizeClick}
      >
        Customize click
      </button>
            {customize && (
        <div>
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
          <button
            className="ml-4 bg-red-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 rounded"
            onClick={handleCustomizeClickSave}
          >
            Save
          </button>
        </div>
      )}
      <div className='mt-8 ml-4 mr-4 flex justify-between'>
        <h3>strike: {callSymbol}</h3>
        <h3>{selectedOption1}</h3>
        <h3>strike: {putSymbol}</h3>
      </div>
      <div className='mt-2 ml-4 mr-4 flex justify-between'>
        <h3>LTP: {callLTP}</h3>
        <h3>LTP: {selectedOption2}</h3>
        <h3>{putLTP} :LTP</h3>
      </div>
      <div className='mt-4 mr-4 flex justify-between'>
        <div>
        <button className="ml-4 bg-red-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 rounded" 
         onClick={()=>{placeOrder("SELL","CE"),setCallType("CE")}}>
       <div className='flex'> <AiOutlineArrowLeft className='mt-1.5 mr-2'/> SELL call</div> 
      </button>
      <button className="ml-4 bg-green-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 rounded "
       onClick={()=>{placeOrder("BUY","CE"),setCallType("CE")}}>
        <div className='flex'> <AiOutlineArrowUp className='mt-1.5 mr-2'/> Buy call</div>
      </button>
        </div>
        <div>
        <button onClick={exitAllHandler} className="ml-4 bg-white hover:bg-blue-400 text-red-500 font-bold py-2 px-4 border-b-4 rounded border-2 border-red-600">
        Close all Positions
      </button>
      <button className="ml-4 bg-white hover:bg-blue-400 text-red-500 font-bold py-2 px-4 border-b-4 rounded border-2 border-red-600">
        Cancel all orders
      </button>
        </div>
        <div>
        <button className="ml-4 bg-green-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 rounded "
        onClick={()=>{placeOrder("BUY","PE"),setCallType("PE")}} >
        <div className='flex'>BUY Put  <AiOutlineArrowDown className='mt-1.5 ml-2'/></div>
      </button>
      <button className="ml-4 bg-red-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 rounded"
      onClick={()=>{placeOrder("SELL","PE"),setCallType("PE")}} > 
        <div className='flex'>Sell Put  <AiOutlineArrowRight className='mt-1.5 ml-2'/></div>
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
      <button
        className={`ml-8 font-medium w-40 h-10 border-0 rounded ${FundsButtonClicked ? 'bg-pink-200' : ''}`}
        onClick={handleFundsClick}
      >
        Funds
      </button>
    </div>
{orderBook && 
<Orderbook orderbook={orderbook}  />
            }
{TradeBook && 
<Tradebook tradebook={tradebook}  />
            }
{positions &&   
<Positions maindata exit={handleClick} Positions={fetchedPositions&&fetchedPositions} stopLossValue={stopLoss} setStopLossValue={setStopLoss} trailingStopLoss={trailingStopLoss} setTrailingStopLoss={setTrailingStopLoss} />
}
{funds &&   
<Funds data={margin} />
}
   </div>
</div>
    </div>

  );
};

export default TradeDashboard;