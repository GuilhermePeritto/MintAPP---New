'use client'

import { useLanguage } from '@/components/language-provider'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const categories = [
  "Soccer Fields",
  "Basketball Courts",
  "Tennis Courts",
  "Swimming Pools",
  "Gyms",
  "Volleyball Courts",
  "Baseball Fields",
]

// This should be the same data as used in the dashboard
const MOCK_FACILITIES = [
  { id: 1, name: "Central Soccer Field", rating: 4.8, image: "/placeholder.svg", category: "Soccer Fields" },
  { id: 2, name: "Riverside Soccer Complex", rating: 4.6, image: "/placeholder.svg", category: "Soccer Fields" },
  { id: 3, name: "Downtown Soccer Arena", rating: 4.7, image: "/placeholder.svg", category: "Soccer Fields" },
  { id: 4, name: "Community Soccer Ground", rating: 4.5, image: "/placeholder.svg", category: "Soccer Fields" },
  { id: 5, name: "Main Basketball Court", rating: 4.7, image: "/placeholder.svg", category: "Basketball Courts" },
  { id: 6, name: "Lakeside Basketball Arena", rating: 4.5, image: "/placeholder.svg", category: "Basketball Courts" },
  { id: 7, name: "Indoor Basketball Center", rating: 4.9, image: "/placeholder.svg", category: "Basketball Courts" },
  { id: 8, name: "Park Basketball Court", rating: 4.6, image: "/placeholder.svg", category: "Basketball Courts" },
  { id: 9, name: "City Tennis Club", rating: 4.8, image: "/placeholder.svg", category: "Tennis Courts" },
  { id: 10, name: "Sunshine Tennis Center", rating: 4.7, image: "/placeholder.svg", category: "Tennis Courts" },
  { id: 11, name: "Grand Slam Tennis Courts", rating: 4.9, image: "/placeholder.svg", category: "Tennis Courts" },
  { id: 12, name: "Community Tennis Park", rating: 4.5, image: "/placeholder.svg", category: "Tennis Courts" },
]

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const router = useRouter()
  const { t } = useLanguage()

  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredFacilities = MOCK_FACILITIES.filter(facility =>
    selectedCategory ? facility.category === selectedCategory : true
  )

  return (
    <div className="mx-auto px-5 sm:px-4 md:px-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">{t('search_facilities')}</h1>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="search"
          placeholder={t('search_categories')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {!selectedCategory ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredCategories.map((category, index) => (
            <Card 
              key={index} 
              className="hover:bg-accent cursor-pointer transition-colors"
              onClick={() => setSelectedCategory(category)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <span>{category}</span>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <button 
            onClick={() => setSelectedCategory(null)}
            className="mb-4 text-primary hover:underline"
          >
            ← {t('back_to_categories')}
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredFacilities.map((facility) => (
              <Card 
                key={facility.id} 
                className="hover:bg-accent cursor-pointer transition-colors"
                onClick={() => router.push(`/book/${facility.id}`)}
              >
                <CardContent className="p-0">
                  <div className="relative h-48">
                    <Image
                      src={facility.image || "/placeholder.svg"}
                      alt={facility.name}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{facility.name}</h3>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{facility.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

