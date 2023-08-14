import React, { useState, useEffect } from 'react';
import maindata from '../../backend/routes/data/instrument.json';
import tradingsymbols from '../../backend/routes/data/instrumentTradingSymbol.json';
import instruments from '../../backend/routes/data/instrument.json';
import CustomCombobox from './basic components/AutoCompleteInput';

const WatchList = (props) => {
  const [data, setData] = useState([]);
  const [tokendata, setTokendata] = useState();
  const [name, setName] = useState();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('watchlistData'));
    if (storedData) {
      setData(storedData);
    }
  }, []);

  useEffect(() => {
    if (tokendata !== undefined && name !== undefined) {
      const updatedData = [...data, { token: tokendata, ltp: 0, name: name }];
      setData(updatedData);
      localStorage.setItem('watchlistData', JSON.stringify(updatedData));
      props.add(updatedData);
    }
  }, [tokendata, name]);

  const token = (selected) => {
    instruments.forEach((item) => {
      if (item.tradingsymbol === selected.replace(/\s/g, '')) {
        setTokendata(item.instrument_token);
        return;
      }
    });
  };

  const handleClick = (selected) => {
    if (!data.some(item => item.name === selected.name)) {
      if (selected.name.includes("CE") || selected.name.includes("PE") || selected.name.includes("FUT")) {
        setName(selected.name);
        token(selected.name);
      }
    }
  };

  const resetData = () => {
    setData([]);
    localStorage.removeItem('watchlistData');
  };

  const ceData = data.filter(value => !value.name.includes("PE"));
  const peData = data.filter(value => value.name.includes("PE"));

  return (
    <div className='w-full h-screen border-black border-2 p-4'>
      <div className='mb-4'>
        <CustomCombobox options={tradingsymbols} onChange={handleClick} />
        <button className='ml-4 bg-blue-500 text-white py-2 px-4 rounded' onClick={resetData}>
          Reset
        </button>
      </div>
      <div className='h-1/2 border-b-2 border-black overflow-y-auto'>
        <h2 className='mb-2'>CE Section</h2>
        {ceData.map((value, index) => (
          <div key={index} className='flex justify-between mb-2'>
            <div>{value.name}</div>
            <div>{value.ltp}</div>
          </div>
        ))}
      </div>
      <div className='h-1/2 overflow-y-auto'>
        <h2 className='mb-2'>PE Section</h2>
        {peData.map((value, index) => (
          <div key={index} className='flex justify-between mb-2'>
            <div>{value.name}</div>
            <div>{value.ltp}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchList;
