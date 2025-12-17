import dynamic from "next/dynamic"

const VerEventoInfo = dynamic(
  () => import("@/components/Pages/Public/VerEvento/VerEventoInfo").then((mod) => ({ default: mod.VerEventoInfo })),
  { ssr: false }
)

type PageProps = {
  params: Promise<{
    slug: string
  }>
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
