'use client'

import { useLanguage } from '@/components/language-provider'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, CreditCard, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface PaymentMethod {
  id: number
  type: 'credit' | 'debit'
  lastFour: string
  expiryDate: string
  cardHolder: string
}

const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  { id: 1, type: 'credit', lastFour: '1234', expiryDate: '12/24', cardHolder: 'John Doe' },
  { id: 2, type: 'debit', lastFour: '5678', expiryDate: '06/25', cardHolder: 'Jane Smith' },
]

export default function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(MOCK_PAYMENT_METHODS)
  const [newCardNumber, setNewCardNumber] = useState('')
  const [newCardExpiry, setNewCardExpiry] = useState('')
  const [newCardCVV, setNewCardCVV] = useState('')
  const [newCardHolder, setNewCardHolder] = useState('')
  const router = useRouter()
  const { t } = useLanguage()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) {
      router.push('/')
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [router])

  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault()
    const newPaymentMethod: PaymentMethod = {
      id: paymentMethods.length + 1,
      type: 'credit',
      lastFour: newCardNumber.slice(-4),
      expiryDate: newCardExpiry,
      cardHolder: newCardHolder,
    }
    setPaymentMethods([...paymentMethods, newPaymentMethod])
    setNewCardNumber('')
    setNewCardExpiry('')
    setNewCardCVV('')
    setNewCardHolder('')
  }

  const handleRemovePaymentMethod = (id: number) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id))
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 pb-5">
      <div className="flex items-center mb-6">
        {isMobile && (
          <Button
            variant="ghost"
            className="mr-2 p-0"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        <h1 className="text-2xl font-bold text-primary">{t('payment_methods')}</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('add_payment_method')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddPaymentMethod} className="space-y-4">
            <div className="relative w-full max-w-md mx-auto h-56 bg-gradient-to-br from-purple-400 to-purple-600 dark:from-purple-600 dark:to-purple-800 rounded-xl shadow-xl overflow-hidden">
              <div className="absolute top-4 left-4">
                <CreditCard className="w-10 h-10 text-white" />
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <Input
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className="bg-transparent border-none text-white text-xl mb-2 placeholder-white/70"
                  maxLength={19}
                  required
                />
                <div className="flex justify-between">
                  <Input
                    value={newCardExpiry}
                    onChange={(e) => setNewCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="bg-transparent border-none text-white w-20 placeholder-white/70"
                    maxLength={5}
                    required
                  />
                  <Input
                    value={newCardCVV}
                    onChange={(e) => setNewCardCVV(e.target.value)}
                    placeholder="CVV"
                    className="bg-transparent border-none text-white w-16 placeholder-white/70"
                    maxLength={3}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardHolder">{t('card_holder')}</Label>
              <Input
                id="cardHolder"
                value={newCardHolder}
                onChange={(e) => setNewCardHolder(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <Button type="submit" className="w-full">{t('add_card')}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('your_payment_methods')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-muted p-4 rounded-lg">
                <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                  <CreditCard className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-semibold">{method.cardHolder}</p>
                    <p className="text-sm text-muted-foreground">**** **** **** {method.lastFour}</p>
                    <p className="text-sm text-muted-foreground">{t('expires')} {method.expiryDate}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleRemovePaymentMethod(method.id)} className="mt-2 sm:mt-0">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('remove')}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

