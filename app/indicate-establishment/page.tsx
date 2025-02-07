"use client"

import { useLanguage } from "@/components/language-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GlowingCard } from "@/components/ui/glowing-card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Pencil, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface Establishment {
  id: number
  name: string
  address: string
  phone: string
  email: string
  socialMedia: string
  website: string
  openingHours: string
  responsiblePerson: string
  status: "Enviado" | "Em negociação" | "Aprovado" | "Rejeitado"
}

export default function IndicateEstablishment() {
  const { t } = useLanguage()
  const router = useRouter()
  const [establishments, setEstablishments] = useState<Establishment[]>([])
  const [showForm, setShowForm] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [formData, setFormData] = useState<Omit<Establishment, "id" | "status">>({
    name: "",
    address: "",
    phone: "",
    email: "",
    socialMedia: "",
    website: "",
    openingHours: "",
    responsiblePerson: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newEstablishment: Establishment = {
      ...formData,
      id: establishments.length + 1,
      status: "Enviado",
    }
    setEstablishments((prev) => [newEstablishment, ...prev])
    setShowForm(false)
    setFormData({
      name: "",
      address: "",
      phone: "",
      email: "",
      socialMedia: "",
      website: "",
      openingHours: "",
      responsiblePerson: "",
    })
    alert(t("indication_success"))
  }

  const getStatusBadge = (status: Establishment["status"]) => {
    switch (status) {
      case "Enviado":
        return <Badge variant="secondary">{status}</Badge>
      case "Em negociação":
        return <Badge variant="warning">{status}</Badge>
      case "Aprovado":
        return <Badge variant="success">{status}</Badge>
      case "Rejeitado":
        return <Badge variant="destructive">{status}</Badge>
    }
  }

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

  return (
    <div className="mx-auto px-5 sm:px-4 md:px-6 space-y-6 pt-4">
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
        <h1 className="text-2xl font-bold text-primary">{t('indicate_establishment')}</h1>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          {t("new_indication")}
        </Button>
      </div>

      {showForm && (
        <GlowingCard>
          <CardHeader>
            <CardTitle>{t("new_indication")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="name"
                placeholder={t("establishment_name")}
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <Input
                name="address"
                placeholder={t("address")}
                value={formData.address}
                onChange={handleInputChange}
                required
              />
              <Input
                name="phone"
                placeholder={t("phone")}
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <Input
                name="email"
                placeholder={t("email")}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <Input
                name="socialMedia"
                placeholder={t("social_media")}
                value={formData.socialMedia}
                onChange={handleInputChange}
              />
              <Input name="website" placeholder={t("website")} value={formData.website} onChange={handleInputChange} />
              <Input
                name="openingHours"
                placeholder={t("opening_hours")}
                value={formData.openingHours}
                onChange={handleInputChange}
                required
              />
              <Input
                name="responsiblePerson"
                placeholder={t("responsible_person")}
                value={formData.responsiblePerson}
                onChange={handleInputChange}
                required
              />
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  {t("cancel")}
                </Button>
                <Button type="submit">{t("send_indication")}</Button>
              </div>
            </form>
          </CardContent>
        </GlowingCard>
      )}

      <GlowingCard>
        <CardHeader>
          <CardTitle>{t("indications_list")}</CardTitle>
        </CardHeader>
        <CardContent>
          {establishments.length === 0 ? (
            <p className="text-center text-muted-foreground">{t("no_indications")}</p>
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("establishment_name")}</TableHead>
                      <TableHead>{t("address")}</TableHead>
                      <TableHead>{t("responsible_person")}</TableHead>
                      <TableHead>{t("status")}</TableHead>
                      <TableHead>{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {establishments.map((establishment) => (
                      <TableRow key={establishment.id}>
                        <TableCell className="font-medium">{establishment.name}</TableCell>
                        <TableCell>{establishment.address}</TableCell>
                        <TableCell>{establishment.responsiblePerson}</TableCell>
                        <TableCell>{getStatusBadge(establishment.status)}</TableCell>
                        <TableCell>
                          {establishment.status === "Enviado" && (
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4 mr-2" />
                              {t("edit")}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="md:hidden">
                <ScrollArea className="h-[400px]">
                  {establishments.map((establishment) => (
                    <div key={establishment.id} className="mb-4 p-4 border border-border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{establishment.name}</h3>
                          <p className="text-sm text-muted-foreground">{establishment.address}</p>
                        </div>
                        {getStatusBadge(establishment.status)}
                      </div>
                      <p className="text-sm mb-2">{establishment.responsiblePerson}</p>
                      <Button variant="ghost" size="sm" className="w-full justify-between">
                        {t("view_details")}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </>
          )}
        </CardContent>
      </GlowingCard>
    </div>
  )
}