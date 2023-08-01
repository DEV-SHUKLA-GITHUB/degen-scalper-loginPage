import React, { useState } from 'react';
import maindata from '../../backend/routes/data/instrument.json';
import tradingsymbols from '../../backend/routes/data/instrumentTradingSymbol.json';
import CustomCombobox from './basic components/AutoCompleteInput';

const WatchList = (props) => {
  const product = ['MIS','normal'];
  const productList = product.map((value) => ({ value, text: value }));
  const products = [
    { id: 1, name: "MIS" },
    { id: 2, name: "NORMAL" },
  ];

  const [data, setData] = useState(props.tokens);
  const [inputVal, setInputVal] = useState('');

  const handleClick = () => {
    // function nameToToken(inputVal){
    //   let token;
    //   //...
    //   return token
    // }

    setData([...data, {token: Number(inputVal), ltp:0}]);
    props.add([...data, {token: Number(inputVal), ltp:0}])
    setInputVal('');
  };
// console.log(props.ticks,"ticks")

  const filteredCEData = maindata.filter(item => item.instrument_type === 'CE');
  const filteredPEData = maindata.filter(item => item.instrument_type === 'PE');

  return (
    // <div className='w-full h-screen border-black border-2'>
    //   <div className='h-1/2 border-b-2 border-black overflow-y-auto'>
    //     {filteredCEData.map((item) => (<div>
    //       <div >{item.tradingsymbol}</div>
    //       <div></div>
    //       </div>
    //     ))}
    //   </div>
    //   <div className='h-1/2 overflow-y-auto'>
    //     {filteredPEData.map((item) => (<div>
    //       <div >{item.tradingsymbol}</div>
    //       <div >{item.tradingsymbol}</div>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    
    <div className='w-full h-screen border-black border-2'>
    <div className='flex'>
    {/* <input type="text" className='w-3/4 h-12 border-black border-2' value={inputVal&&inputVal} onChange={(e) => setInputVal(e.target.value)} /> */}
    {/* <button className='w-1/5 h-12' onClick={handleClick}>add</button> */}
    <CustomCombobox options={tradingsymbols} onChange={handleClick}/>
    </div>
    {props.tokens.map((value, index) => {
        return (<div >
                    <div className='flex justify-between m-4'>
                        <div>Value</div>
                        <div>LTP</div>
                    </div>
                    <div className='flex justify-between m-4'>
                        <div key={index}>{value.token}</div>
                        <div>{value.ltp}</div>
                    </div>
                </div>)
    })}
    {/* <CustomCombobox option={} onChange={handleChange}/> */}
</div>
  );
};

export default WatchList;
