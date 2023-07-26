import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FaChevronDown } from 'react-icons/fa';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Dropdown(props) {
  const [selectedOption, setSelectedOption] = useState(
    props.itemList && props.itemList.length > 0 ? props.itemList[0].value : null
  );

  const handleOptionSelect = (value) => {
    setSelectedOption(value);
    if (props.onSelect) {
      props.onSelect(value);
    }
  };

  // Ensure itemList is defined and has values before rendering
  const itemList = props.itemList || [];

  return (
    <div className="max-w-sm ">
      <label className="block text-sm font-medium text-gray-700">{props.label}</label>
      <div className="relative inline-block text-right">
        <div>
          <Menu>
            {({ open }) => (
              <>
                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                  {selectedOption === null ? props.heading : selectedOption}
                  <FaChevronDown className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                </Menu.Button>

                <Transition
                  show={open}
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    static
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <div className="py-1">
                      {itemList.map((item) => (
                        <Menu.Item key={item.value}>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                              )}
                              onClick={() => handleOptionSelect(item.value)}
                            >
                              {item.text}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </div>
      </div>
    </div>
  );
}
