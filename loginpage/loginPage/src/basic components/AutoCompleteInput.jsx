import React, { Fragment, useState, useMemo } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/outline";

const CustomCombobox = ({ options, onChange }) => {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [atm,setAtm ] = useState({
    NIFTY : 19300,
    BANKNIFTY : 43900,
    FINNIFTY : 19600
  })

  const filteredOptions = useMemo(() => {
    if (query === "") {
      return options;
    }

    const queryWords = query.toLowerCase().split(/\s+/);

    return options.filter((option) => {
      const nameWords = option.name.toLowerCase().split(/\s+/);
      return queryWords.every((queryWord) =>
        nameWords.some((nameWord) => nameWord.includes(queryWord))
      );
    });
  }, [options, query]);

  const parseOptionName = (name) => {
    const matches = name.match(/([A-Z]+) (\d+)/);
    if (matches) {
      const [key, num] = matches;
      return { key, num: parseInt(num) };
    }
    return null;
  };

  const lowerOptions = filteredOptions.filter((option) => {
    const parsed = parseOptionName(option.name);
    if (parsed && 
      atm[parsed.key] && parsed.num <= atm[parsed.key]) {
      return true;
    }
    return false;
  });

  const higherOptions = filteredOptions.filter((option) => {
    const parsed = parseOptionName(option.name);
    if (parsed && atm[parsed.key] && parsed.num > atm[parsed.key]) {
      return true;
    }
    return false;
  });

  const handleSelect = (selectedOption) => {
    setSelected(selectedOption);
    onChange(selectedOption);
  };

  const visibleOptions = filteredOptions.slice(0, 100);

  return (
    <Combobox value={selected} onChange={handleSelect}>
      <div className="relative">
        <div className="relative w-full">
          <Combobox.Input
            className="w-full"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}        >
          <Combobox.Options className="absolute mt-1 max-h-60 overflow-y-auto w-full bg-white border border-gray-300 rounded-md shadow-lg">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-2 text-gray-600">Nothing found.</div>
            ) : (
              <>
                {lowerOptions.map((option) => (
                  <Combobox.Option
                    key={option.id}
                    className={({ active }) =>
                      `cursor-pointer select-none px-4 py-2 ${
                        active ? "bg-blue-500 text-white" : "text-gray-900"
                      }`
                    }
                    value={option}
                  >
                    {option.name}
                  </Combobox.Option>
                ))}
                {higherOptions.map((option) => (
                  <Combobox.Option
                    key={option.id}
                    className={({ active }) =>
                      `cursor-pointer select-none px-4 py-2 ${
                        active ? "bg-blue-500 text-white" : "text-gray-900"
                      }`
                    }
                    value={option}
                  >
                    {option.name}
                  </Combobox.Option>
                ))}
              </>
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

export default CustomCombobox;