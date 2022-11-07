'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as Toast from '@radix-ui/react-toast';

export default function ExpenseButtons({ expense, id, attendee }: any) {
  const router = useRouter();
  const [expenseShared, setExpenseShared] = useState(expense.share);
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        key={expense.description}
        className={`flex gap-1 text-xl border ${
          expenseShared
            ? 'bg-gradient-to-r from-cyan-700 to-teal-600 text-white'
            : 'border-cyan-700'
        } p-6 rounded-lg`}
        onClick={async () => {
          setExpenseShared(!expenseShared);
          await fetch(`/api/party/${id}/${attendee}`, {
            method: 'POST',
            body: JSON.stringify({ expense: expense.description }),
          });
          setOpen(true);
          router.refresh();
        }}
      >
        <span>{expenseShared ? '✅' : '❌'}</span>
        <span className="whitespace-nowrap truncate">
          {expense.description}
        </span>
      </button>
      <Toast.Provider swipeDirection={'right'} duration={2000}>
        <Toast.Root
          open={open}
          onOpenChange={setOpen}
          className="rounded-lg bg-slate-900/75 text-white py-4 px-8 grid align-center w-full"
        >
          <Toast.Title>Tá salvo!</Toast.Title>
          <Toast.Description>
            {expenseShared ? (
              <span>
                Você vai dividir <strong>{expense.description}</strong>
              </span>
            ) : (
              <span>
                Você não vai dividir <strong>{expense.description}</strong>
              </span>
            )}
          </Toast.Description>
          <Toast.Close />
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-1/2 translate-x-1/2 flex flex-col p-4 max-w-xl w-full m-0 " />
      </Toast.Provider>
    </>
  );
}
