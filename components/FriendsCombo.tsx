'use client';

import { useCombobox } from 'downshift';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function FriendsCombo({
  friends,
  attendees,
  partyId,
}: {
  friends: any;
  attendees: any;
  partyId: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isHost = Boolean(searchParams.get('host'));
  const [items, setItems] = useState(friends);
  const [newAttendee, setNewAttendee] = useState({ first_name: '', email: '' });
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    onInputValueChange({ inputValue }) {
      if (!inputValue) setNewAttendee({ first_name: '', email: '' });
      setItems(
        friends
          .filter(
            (f: any) => !attendees.map((a: any) => a.email).includes(f.email)
          )
          .filter(getFriendsFilter(inputValue))
      );
    },
    onSelectedItemChange({ selectedItem }) {
      if (selectedItem) setNewAttendee(selectedItem);
    },
    selectedItem: newAttendee,
    items,
    itemToString(item) {
      return item ? item.email : '';
    },
  });

  return (
    <>
      <label
        id="name-or-email-label"
        className="uppercase text-xs font-bold text-gray-700/[.54]"
      >
        Bora? Coloca seu nome aqui embaixo:
      </label>
      <div className="flex items-center gap-2 mt-2">
        <div className="flex-1">
          <div id="combobox-input-wrapper" className="flex flex-col gap-1 ">
            <div
              className="flex drop-shadow-sm bg-white gap-0.5 rounded-lg"
              {...getComboboxProps()}
              aria-owns="name-or-email-results"
            >
              <input
                placeholder="Nome ou e-mail"
                type="text"
                className="w-full border-none rounded-lg placeholder:text-xs placeholder:text-gray-700/[.54]"
                {...getInputProps()}
                id="name-or-email-search-input"
                aria-controls="name-or-email-results"
                aria-labelledby="name-or-email-label"
              />
            </div>
          </div>
          <ul
            {...getMenuProps()}
            id="name-or-email-results"
            className="absolute bg-white shadow-md max-h-40 overflow-auto rounded-lg divide-y divide-dashed mt-1"
            aria-labelledby="name-or-email-label"
          >
            {isOpen &&
              items.map((item: any, index: any) => (
                <li
                  className={[
                    'flex',
                    'flex-col',
                    highlightedIndex === index &&
                      'bg-cyan-700/10 cursor-pointer',
                    newAttendee === item && 'font-bold',
                    'py-1.5',
                    'px-3',
                    'first:pt-3 last:pb-3',
                  ].join(' ')}
                  key={`${item.email}`}
                  {...getItemProps({ item, index })}
                  id={`${item.email}`}
                >
                  <span>{item.first_name}</span>
                  <span className="text-sm text-gray-700">{item.email}</span>
                </li>
              ))}
          </ul>
        </div>
        <button
          type="button"
          onClick={async () => {
            await fetch(`/api/party/${partyId}/attendee`, {
              method: 'POST',
              body: JSON.stringify(newAttendee),
            });
            setNewAttendee({ first_name: '', email: '' });
            if (isHost) {
              router.refresh();
            } else {
              router.push(`${pathname}/${newAttendee.email}`);
            }
          }}
          disabled={newAttendee.email === ''}
          className="uppercase text-xs disabled:bg-gray-50 disabled:cursor-not-allowed disabled:border disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-gray-200 cursor-pointer hover:bg-cyan-700/90 text-white enabled:bg-gradient-to-r enabled:from-cyan-700 enabled:to-teal-600 px-4 py-3 rounded-lg"
        >
          Bora!
        </button>
      </div>
    </>
  );
}

function getFriendsFilter(inputValue: any) {
  return function friendsFilter(friend: any) {
    return (
      !inputValue ||
      friend.first_name.toLowerCase().includes(inputValue.toLowerCase()) ||
      friend.email.toLowerCase().includes(inputValue.toLowerCase())
    );
  };
}
