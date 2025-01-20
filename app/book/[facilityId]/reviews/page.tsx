'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/components/language-provider'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Star, ChevronLeft } from 'lucide-react'

// Mock reviews data
const MOCK_REVIEWS = [
  { id: 1, user: "Alice Johnson", avatar: "/placeholder.svg", rating: 5, comment: "Excellent facilities and well-maintained fields. Highly recommended!" },
  { id: 2, user: "Bob Smith", avatar: "/placeholder.svg", rating: 4, comment: "Great place to play, but could use more parking spaces." },
  { id: 3, user: "Charlie Brown", avatar: "/placeholder.svg", rating: 5, comment: "Top-notch soccer complex. The artificial turf fields are fantastic." },
  { id: 4, user: "Diana Martinez", avatar: "/placeholder.svg", rating: 3, comment: "Decent fields, but the locker rooms need some improvement." },
  { id: 5, user: "Ethan Wilson", avatar: "/placeholder.svg", rating: 4, comment: "Love the variety of field sizes. Perfect for different team sizes and practice sessions." },
]

export default function FacilityReviews({ params }: { params: { facilityId: string } }) {
  const [reviews, setReviews] = useState(MOCK_REVIEWS)
  const [newReview, setNewReview] = useState('')
  const [newRating, setNewRating] = useState(0)
  const router = useRouter()
  const { t } = useLanguage()

  const handleSubmitReview = () => {
    if (newReview && newRating > 0) {
      const review = {
        id: reviews.length + 1,
        user: "Current User",
        avatar: "/placeholder.svg",
        rating: newRating,
        comment: newReview
      }
      setReviews([review, ...reviews])
      setNewReview('')
      setNewRating(0)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6 space-x-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="p-0 hover:bg-transparent"
        >
          <ChevronLeft className="h-6 w-6 text-primary" />
        </Button>
        <h1 className="text-2xl font-bold text-primary">{t('facility_reviews')}</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('write_review')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  size="sm"
                  className="p-0 h-8 w-8"
                  onClick={() => setNewRating(star)}
                >
                  <Star className={`h-6 w-6 ${star <= newRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                </Button>
              ))}
            </div>
            <Textarea
              placeholder={t('write_your_review')}
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="w-full"
            />
            <Button onClick={handleSubmitReview} disabled={!newReview || newRating === 0}>
              {t('submit_review')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={review.avatar} alt={review.user} />
                  <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{review.user}</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-sm">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

