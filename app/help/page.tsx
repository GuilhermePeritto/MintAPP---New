'use client'

import { useLanguage } from '@/components/language-provider'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Search } from 'lucide-react'
import { useState } from 'react'

export default function HelpSupport() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const faqs = [
    { question: t('faq_question_1'), answer: t('faq_answer_1') },
    { question: t('faq_question_2'), answer: t('faq_answer_2') },
    { question: t('faq_question_3'), answer: t('faq_answer_3') },
    { question: t('faq_question_4'), answer: t('faq_answer_4') },
    { question: t('faq_question_5'), answer: t('faq_answer_5') },
  ]

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmitQuery = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Here you would typically send the query to your backend
    console.log('Query submitted')
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 5000)
  }

  return (
    <div className="mx-auto px-5 sm:px-4 md:px-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('help_and_support')}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t('search_faqs')}</CardTitle>
          <CardDescription>{t('search_faqs_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('frequently_asked_questions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('contact_support')}</CardTitle>
          <CardDescription>{t('contact_support_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitQuery} className="space-y-4">
            <Input placeholder={t('your_name')} required />
            <Input type="email" placeholder={t('your_email')} required />
            <Textarea placeholder={t('your_question')} required />
            <Button type="submit">{t('submit_question')}</Button>
          </form>
        </CardContent>
      </Card>

      {showSuccessMessage && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>{t('query_submitted')}</AlertTitle>
          <AlertDescription>
            {t('query_submitted_description')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

