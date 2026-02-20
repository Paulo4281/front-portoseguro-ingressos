import React from "react"
import { AlertCircle, Clock, CreditCard, QrCode, RefreshCw, ShieldCheck, Ticket } from "lucide-react"

export type TAjudaFAQItem = {
    id: string
    question: string
    answer: string
    icon?: React.ReactNode
}

export const ajudaFaqItems: TAjudaFAQItem[] = [
    {
        id: "buy-tickets",
        question: "Como faço para comprar ingressos?",
        answer: "Navegue pelos eventos disponíveis, selecione o evento desejado, escolha a quantidade de ingressos e os tipos (se houver), e finalize a compra. Você pode pagar com cartão de crédito ou PIX.",
        icon: <Ticket className="h-5 w-5" />
    },
    {
        id: "receive-ticket",
        question: "Como recebo meu ingresso após a compra?",
        answer: "Após a confirmação do pagamento, você receberá o QR Code do seu ingresso automaticamente. Você pode acessá-lo na seção 'Meus Ingressos' do seu perfil. O QR Code também será enviado por e-mail.",
        icon: <QrCode className="h-5 w-5" />
    },
    {
        id: "payment-not-confirmed",
        question: "O que fazer se o pagamento não foi confirmado?",
        answer: "Se você pagou via PIX e o pagamento ainda não foi confirmado, verifique se o código foi copiado corretamente e se o pagamento foi realizado dentro do prazo de validade. Pagamentos via cartão de crédito são confirmados automaticamente. Se o problema persistir, entre em contato conosco.",
        icon: <CreditCard className="h-5 w-5" />
    },
    {
        id: "refund",
        question: "Posso cancelar ou solicitar reembolso do meu ingresso?",
        answer: "Sim, você pode solicitar reembolso em casos específicos: se o evento for cancelado ou adiado e você não puder comparecer na nova data. Acesse 'Meus Ingressos', selecione o ingresso e clique em 'Solicitar reembolso'. O processo será analisado e o valor será devolvido conforme nossa política de reembolso.",
        icon: <RefreshCw className="h-5 w-5" />
    },
    {
        id: "qrcode",
        question: "Como funciona o QR Code do ingresso?",
        answer: "O QR Code é seu ingresso digital. Apresente-o na entrada do evento para ser escaneado. Certifique-se de ter o QR Code carregado no seu celular ou impresso. Recomendamos ter uma cópia de backup caso tenha problemas com a bateria do celular.",
        icon: <QrCode className="h-5 w-5" />
    },
    {
        id: "forgot-password",
        question: "Esqueci minha senha. Como recuperar?",
        answer: "Na página de login, clique em 'Esqueci minha senha' e informe seu e-mail cadastrado. Você receberá um código de recuperação por e-mail. Use esse código para criar uma nova senha.",
        icon: <ShieldCheck className="h-5 w-5" />
    },
    {
        id: "cancelled-postponed",
        question: "O evento foi cancelado ou adiado. O que acontece?",
        answer: "Se o evento for cancelado, o reembolso será processado automaticamente. Se for adiado, você pode optar por manter seu ingresso para a nova data ou solicitar reembolso. Você será notificado sobre qualquer alteração no evento.",
        icon: <AlertCircle className="h-5 w-5" />
    },
    {
        id: "payment-status",
        question: "Como posso verificar o status do meu pagamento?",
        answer: "Acesse 'Meus Ingressos' no seu perfil. Lá você verá o status de cada ingresso: pendente, confirmado, utilizado, etc. Se o pagamento estiver pendente, você poderá visualizar o QR Code PIX ou tentar novamente.",
        icon: <Clock className="h-5 w-5" />
    },
    {
        id: "transfer-ticket",
        question: "Posso transferir meu ingresso para outra pessoa?",
        answer: "Atualmente não é possível transferir ingressos diretamente pela plataforma. Se você não puder comparecer, entre em contato conosco para avaliarmos sua situação específica.",
        icon: <Ticket className="h-5 w-5" />
    },
    {
        id: "fees",
        question: "Há taxas adicionais na compra?",
        answer: "Sim, aplicamos uma taxa de serviço única de R$ 1,99 por ingresso. Taxas adicionais podem ser aplicadas pelo organizador. As taxas de cartão de crédito (quando parcelado) são repassadas ao comprador. Todos os valores são informados antes da finalização da compra.",
        icon: <CreditCard className="h-5 w-5" />
    }
]

export const ajudaSupport = {
    email: "contato@portoseguroingressos.com.br",
    whatsappLabel: "(73) 98822-4645",
    whatsappUrl: "https://wa.me/5573988224645",
    businessHours: "Segunda a Sexta, das 9h às 18h"
}

