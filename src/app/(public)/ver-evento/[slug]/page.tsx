import { Metadata } from "next"
import { VerEventoInfo } from "@/components/Pages/Public/VerEvento/VerEventoInfo"
import { EventService } from "@/services/Event/EventService"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import type { TEvent } from "@/types/Event/TEvent"
import type { TApiResponse } from "@/types/TApiResponse"
import TextLengthLimiter from "@/utils/Helpers/TextLengthLimiter/TextLengthLimiter"

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = (await params)?.slug

  if (!slug) {
    return {
      title: "Evento não encontrado | Porto Seguro Ingressos",
      description: "O evento solicitado não foi encontrado.",
    }
  }

  try {
    const response = await EventService.findBySlug(slug) as TApiResponse<TEvent>
    const event = response?.data

    if (!event) {
      return {
        title: "Evento não encontrado | Porto Seguro Ingressos",
        description: "O evento solicitado não foi encontrado.",
      }
    }

    const title = `${event.name} | Porto Seguro Ingressos`
    const description = TextLengthLimiter(event.description ?? "", 120) || `Confira os detalhes do evento ${event.name} em Porto Seguro.`
    const imageUrl = event.image ? ImageUtils.getEventImageUrl(event.image) : ""

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: imageUrl ? [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: event.name,
          }
        ] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
    }
  } catch (error) {
    return {
      title: "Evento | Porto Seguro Ingressos",
      description: "Confira os melhores eventos de Porto Seguro.",
    }
  }
}

const VerEventoPage = async ({ params }: PageProps) => {
  const slug = (await params)?.slug

  if (!slug) {
    return (
      <div className="flex items-center justify-center min-h-screen mt-[80px]">
        <p className="text-psi-dark/60">Evento não encontrado</p>
      </div>
    )
  }

  return <VerEventoInfo slug={slug} />
}

export default VerEventoPage
