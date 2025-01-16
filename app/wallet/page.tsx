'use client'

import { useLanguage } from '@/components/language-provider'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Transaction {
  id: number
  type: 'credit' | 'debit'
  amount: number
  date: string
  description: string
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 1, type: 'credit', amount: 50, date: '2023-07-10', description: 'Deposit' },
  { id: 2, type: 'debit', amount: 20, date: '2023-07-08', description: 'Booking: Central Arena' },
  { id: 3, type: 'credit', amount: 30, date: '2023-07-05', description: 'Refund' },
]

export default function Wallet() {
  const [balance, setBalance] = useState(100)
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) {
      router.push('/')
    }
  }, [router])

  const handleAddPaymentMethod = () => {
    router.push('/payment-methods')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 pb-5">
      <h1 className="text-2xl font-bold mb-6 text-primary">{t('wallet')}</h1>
      
      <Card className="bg-gray-900/50 border-primary/20 mb-6">
        <CardHeader>
          <CardTitle>{t('current_balance')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">${balance.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-primary/20 mb-6">
        <CardHeader>
          <CardTitle>{t('payment_methods')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAddPaymentMethod}>{t('add_payment_method')}</Button>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-primary/20">
        <CardHeader>
          <CardTitle>{t('transaction_history')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">{transaction.date}</p>
                </div>
                <p className={`font-semibold ${transaction.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                  {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

