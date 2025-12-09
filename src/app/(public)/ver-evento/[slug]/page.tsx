import { VerEventoInfo } from "@/components/Pages/Public/VerEvento/VerEventoInfo"

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

const VerEventoPage = async ({ params }: PageProps) => {
  const { slug } = await params

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
