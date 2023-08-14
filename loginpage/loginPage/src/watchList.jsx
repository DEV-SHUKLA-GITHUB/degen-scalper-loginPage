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
    // Retrieve data from local storage on component mount
    const storedData = JSON.parse(localStorage.getItem('watchlistData'));
    if (storedData) {
      setData(storedData);
    }
  }, []);

  useEffect(() => {
    if (tokendata !== undefined) {
      // Update the data state and local storage
      const updatedData = [...data, { token: tokendata, ltp: 0, name: name }];
      setData(updatedData);
      localStorage.setItem('watchlistData', JSON.stringify(updatedData));
      props.add(updatedData);
      console.log(tokendata, name);
    }
  }, [tokendata]);

  const token = (selected) => {
    console.log(selected.replace(/\s/g, ''));
    instruments.forEach((item) => {
      if (item.tradingsymbol === selected.replace(/\s/g, '')) {
        console.log(item.tradingsymbol, 'tradingsymbol');
        console.log(item.instrument_token, 'tradingsymbol');
        console.log(typeof Number(item.instrument_token));
        setTokendata(item.instrument_token);
        return;
      }
    });
  };

  const handleClick = (selected) => {
    token(selected.name);
    setName(selected.name);
    console.log(selected.name);
    console.log(instruments);
  };

  const filteredCEData = maindata.filter(item => item.instrument_type === 'CE');
  const filteredPEData = maindata.filter(item => item.instrument_type === 'PE');

  return (
    <div className='w-full h-screen border-black border-2'>
      <div className='flex'>
        <CustomCombobox options={tradingsymbols} onChange={handleClick} />
      </div>
      {data.map((value, index) => (
        <div key={index} className='flex justify-between m-4'>
          <div>{value.name}</div>
          <div>{value.ltp}</div>
        </div>
      ))}
    </div>
  );
};

export default WatchList;
