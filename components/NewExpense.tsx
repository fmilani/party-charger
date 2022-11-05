'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function NewExpense({ partyId }: any) {
  const searchParams = useSearchParams();
  const isHost = Boolean(searchParams.get('host'));
  const router = useRouter();
  const [newExpense, setNewExpense] = useState<{
    description: string;
    value: string;
  }>({ description: '', value: '' });
  return isHost ? (
    <div className="flex items-end gap-2">
      <label className="block flex-1">
        <span>Descrição</span>
        <input
          id="newExpenseDescription"
          name="newExpenseDescription"
          value={newExpense?.description}
          onChange={(e) =>
            setNewExpense({
              ...newExpense,
              description: e.target.value,
            })
          }
          className="mt-1 block w-full border-inherit rounded-lg"
          type="text"
        />
      </label>
      <label className="block shrink w-20">
        <span>Valor</span>
        <input
          id="newExpenseValue"
          name="newExpenseValue"
          value={newExpense?.value}
          onChange={(e) =>
            setNewExpense({ ...newExpense, value: e.target.value })
          }
          type="number"
          className="mt-1 block w-full border-inherit rounded-lg"
        />
      </label>
      <button
        type="button"
        onClick={async () => {
          await fetch(`/api/party/${partyId}/expense`, {
            method: 'POST',
            body: JSON.stringify(newExpense),
          });
          setNewExpense({ description: '', value: '' });
          router.refresh();
        }}
        disabled={!newExpense.description || !newExpense.value}
        className="disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-gray-200 cursor-pointer hover:bg-indigo-500/10 border border-indigo-500 px-4 py-2 rounded-lg"
      >
        Adicionar
      </button>
    </div>
  ) : null;
}
