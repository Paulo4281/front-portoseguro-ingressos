"use client"

import { FileText, RefreshCw, CreditCard, QrCode, Wallet, AlertCircle, Shield, Users, CheckCircle2 } from "lucide-react"
import { Background } from "@/components/Background/Background"

const TermosECondicoesInfo = () => {
    return (
        <Background variant="light" className="min-h-screen">
            <div className="pt-32 pb-24 px-4
            sm:px-6
            lg:px-8">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-psi-primary/10 text-psi-primary text-sm font-medium uppercase tracking-wide">
                            <FileText className="h-4 w-4" />
                            Termos e Condições
                        </div>
                        <h1 className="text-4xl
                        sm:text-5xl
                        lg:text-6xl font-semibold text-psi-dark leading-tight">
                            Termos e Condições de <span className="text-psi-primary">Uso</span>
                        </h1>
                        <p className="text-lg
                        sm:text-xl text-psi-dark/70 max-w-2xl mx-auto">
                            Conheça as regras e condições que regem o uso da nossa plataforma. 
                            Ao utilizar nossos serviços, você concorda com estes termos.
                        </p>
                        <p className="text-sm text-psi-dark/60">
                            Última atualização: {new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                    </div>

                    <div className="space-y-8">
                        <section className="bg-white rounded-xl border border-psi-primary/20 p-6
                        sm:p-8 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-psi-primary/10 shrink-0">
                                    <FileText className="h-6 w-6 text-psi-primary" />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <h2 className="text-2xl font-semibold text-psi-dark">1. Aceitação dos Termos</h2>
                                    <p className="text-psi-dark/70 leading-relaxed">
                                        Ao acessar e utilizar a plataforma Porto Seguro Ingressos, você concorda em cumprir e estar vinculado a estes Termos e Condições de Uso. 
                                        Se você não concorda com qualquer parte destes termos, não deve utilizar nossos serviços.
                                    </p>
                                    <p className="text-psi-dark/70 leading-relaxed">
                                        Estes termos se aplicam a todos os usuários da plataforma, incluindo compradores de ingressos e organizadores de eventos.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-xl border border-psi-primary/20 p-6
                        sm:p-8 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-psi-primary/10 shrink-0">
                                    <RefreshCw className="h-6 w-6 text-psi-primary" />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <h2 className="text-2xl font-semibold text-psi-dark">2. Política de Reembolso</h2>
                                    <p className="text-psi-dark/70 leading-relaxed">
                                        O reembolso de ingressos pode ocorrer nas seguintes situações:
                                    </p>
                                    <div className="space-y-4 pt-2">
                                        <div className="bg-psi-primary/5 rounded-lg p-4 border border-psi-primary/10">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-psi-primary shrink-0 mt-0.5" />
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-psi-dark mb-2">2.1. Direito de Arrependimento (7 dias)</h3>
                                                    <p className="text-psi-dark/70 text-sm leading-relaxed">
                                                        De acordo com o Código de Defesa do Consumidor (CDC), Art. 49, você tem direito ao arrependimento da compra em até 7 dias corridos, 
                                                        contados a partir da data da compra. <strong className="text-psi-dark">Importante:</strong> Este direito não se aplica se o evento ocorrer em menos de 7 dias 
                                                        a partir da data da compra. Neste caso, a taxa de serviço não será reembolsada.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-psi-primary/5 rounded-lg p-4 border border-psi-primary/10">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-psi-primary shrink-0 mt-0.5" />
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-psi-dark mb-2">2.2. Adiamento de Evento</h3>
                                                    <p className="text-psi-dark/70 text-sm leading-relaxed">
                                                        Em caso de adiamento do evento, o reembolso é <strong className="text-psi-dark">facultativo</strong> por parte do consumidor. 
                                                        Você pode optar por manter seu ingresso para a nova data ou solicitar o reembolso integral, incluindo a taxa de serviço.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-psi-primary/5 rounded-lg p-4 border border-psi-primary/10">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-psi-primary shrink-0 mt-0.5" />
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-psi-dark mb-2">2.3. Cancelamento de Evento</h3>
                                                    <p className="text-psi-dark/70 text-sm leading-relaxed">
                                                        Se um evento for cancelado pelo organizador, o reembolso será <strong className="text-psi-dark">integral e automático</strong>, 
                                                        incluindo o valor do ingresso e a taxa de serviço. O valor será devolvido automaticamente na forma de pagamento original.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-psi-primary/5 rounded-lg p-4 border border-psi-primary/10">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-psi-primary shrink-0 mt-0.5" />
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-psi-dark mb-2">2.4. Cancelamento de Ingresso pelo Organizador</h3>
                                                    <p className="text-psi-dark/70 text-sm leading-relaxed">
                                                        O organizador do evento pode optar pelo cancelamento de um ingresso específico a qualquer momento. 
                                                        Nessa situação, o valor do ingresso e a taxa de serviço são <strong className="text-psi-dark">devolvidos integralmente</strong> ao comprador, por meio do mesmo método de pagamento utilizado na compra.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-xl border border-psi-primary/20 p-6
                        sm:p-8 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-psi-primary/10 shrink-0">
                                    <CreditCard className="h-6 w-6 text-psi-primary" />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <h2 className="text-2xl font-semibold text-psi-dark">3. Taxas e Valores</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-medium text-psi-dark mb-2">3.1. Taxa de Serviço</h3>
                                            <p className="text-psi-dark/70 leading-relaxed">
                                                A taxa de serviço cobrada ao cliente é de <strong className="text-psi-primary">R$ 1,90 por ingresso</strong>. 
                                                Este valor pode aumentar caso o organizador opte por repassar parte de sua taxa para o comprador.
                                            </p>
                                        </div>
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-amber-900 mb-1">Reembolso de Taxas</h4>
                                                    <p className="text-amber-800 text-sm leading-relaxed">
                                                        A taxa de serviço <strong>somente será reembolsada</strong> em casos de <strong>cancelamento</strong> ou <strong>adiamento</strong> do evento. 
                                                        Para pedidos de reembolso por direito de arrependimento (7 dias), a taxa não será devolvida.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-xl border border-psi-primary/20 p-6
                        sm:p-8 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-psi-primary/10 shrink-0">
                                    <QrCode className="h-6 w-6 text-psi-primary" />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <h2 className="text-2xl font-semibold text-psi-dark">4. Responsabilidade pelo QR Code</h2>
                                    <div className="bg-transparent rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-purple-900 mb-2">Atenção: Uso do QR Code</h4>
                                                <p className="text-psi-dark text-sm leading-relaxed mb-2">
                                                    O uso do QR Code para validação do ingresso é de <strong>total responsabilidade do cliente</strong>.
                                                </p>
                                                <p className="text-psi-dark text-sm leading-relaxed mb-2">
                                                    O QR Code do seu ingresso será disponibilizado no site ou no app para acesso fácil e seguro. Caso tenha adquirido apenas um ingresso, você também poderá recebê-lo por e-mail automaticamente após a confirmação de pagamento. 
                                                    <strong className="block mt-1">Para compras de múltiplos ingressos em uma única transação, os QR Codes de todos os ingressos estarão disponíveis exclusivamente em sua área "Meus Ingressos" no site ou app. Não serão enviados por e-mail neste caso.</strong>
                                                </p>
                                                <ul className="space-y-1 text-psi-dark text-sm">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-purple-600 mt-1">•</span>
                                                        <span>O QR Code <strong>não deve ser compartilhado</strong> com absolutamente ninguém</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-purple-600 mt-1">•</span>
                                                        <span>Não nos responsabilizamos pelo mau uso da plataforma e do QR Code</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-purple-600 mt-1">•</span>
                                                        <span>Em caso de compartilhamento indevido, o ingresso pode ser invalidado</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-purple-600 mt-1">•</span>
                                                        <span>Mantenha seu QR Code seguro e acessível apenas para você</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-xl border border-psi-primary/20 p-6
                        sm:p-8 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-psi-primary/10 shrink-0">
                                    <Wallet className="h-6 w-6 text-psi-primary" />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <h2 className="text-2xl font-semibold text-psi-dark">5. Repasse aos Organizadores</h2>
                                    <p className="text-psi-dark/70 leading-relaxed">
                                        O repasse do valor das vendas de ingressos aos organizadores segue as seguintes regras:
                                    </p>
                                    <div className="space-y-3 pt-2">
                                        <div className="bg-psi-primary/5 rounded-lg p-4 border border-psi-primary/10">
                                            <h3 className="font-medium text-psi-dark mb-2">5.1. Prazo de Repasse</h3>
                                            <p className="text-psi-dark/70 text-sm leading-relaxed">
                                                O repasse é realizado <strong className="text-psi-dark">após a conclusão do evento</strong>, em até <strong className="text-psi-primary">72 horas</strong>.
                                            </p>
                                        </div>
                                        <div className="bg-psi-primary/5 rounded-lg p-4 border border-psi-primary/10">
                                            <h3 className="font-medium text-psi-dark mb-2">5.2. Pagamentos via PIX</h3>
                                            <p className="text-psi-dark/70 text-sm leading-relaxed">
                                                Para pagamentos realizados via PIX, que são recebidos integralmente, o repasse será feito em até <strong className="text-psi-primary">72 horas</strong> após o término do evento.
                                            </p>
                                        </div>
                                        <div className="bg-psi-primary/5 rounded-lg p-4 border border-psi-primary/10">
                                            <h3 className="font-medium text-psi-dark mb-2">5.3. Pagamentos via Cartão de Crédito</h3>
                                            <p className="text-psi-dark/70 text-sm leading-relaxed">
                                                Para compras parceladas no cartão de crédito, o repasse será feito <strong className="text-psi-dark">conforme as parcelas forem sendo pagas</strong>. 
                                                Por exemplo: se um ingresso foi dividido em 6x e já se passaram 4 meses quando o evento se encerrou, será repassado ao organizador o valor das 4 parcelas já pagas. 
                                                As 2 parcelas restantes serão repassadas assim que recebermos a cobrança de cada uma delas.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-xl border border-psi-primary/20 p-6
                        sm:p-8 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-psi-primary/10 shrink-0">
                                    <Users className="h-6 w-6 text-psi-primary" />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <h2 className="text-2xl font-semibold text-psi-dark">6. Responsabilidades dos Organizadores</h2>
                                    <p className="text-psi-dark/70 leading-relaxed">
                                        Os organizadores são responsáveis por:
                                    </p>
                                    <ul className="space-y-2 text-psi-dark/70">
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Fornecer informações precisas e atualizadas sobre seus eventos</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Cumprir com todas as obrigações legais e regulatórias relacionadas à realização do evento</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Comunicar adequadamente qualquer alteração, adiamento ou cancelamento do evento</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Garantir que os dados bancários cadastrados estejam corretos para recebimento dos repasses</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Manter a verificação de identidade e documentos atualizados</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-xl border border-psi-primary/20 p-6
                        sm:p-8 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-psi-primary/10 shrink-0">
                                    <Shield className="h-6 w-6 text-psi-primary" />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <h2 className="text-2xl font-semibold text-psi-dark">7. Segurança e Proteção</h2>
                                    <p className="text-psi-dark/70 leading-relaxed">
                                        Nossa plataforma utiliza tecnologia de ponta para garantir a segurança de todas as transações:
                                    </p>
                                    <ul className="space-y-2 text-psi-dark/70">
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Criptografia SSL em todas as transações</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Processamento seguro de pagamentos através de gateway certificado</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Armazenamento seguro de dados pessoais em conformidade com a LGPD</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Verificação manual de organizadores antes da publicação de eventos</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-xl border border-psi-primary/20 p-6
                        sm:p-8 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-psi-primary/10 shrink-0">
                                    <AlertCircle className="h-6 w-6 text-psi-primary" />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <h2 className="text-2xl font-semibold text-psi-dark">8. Limitação de Responsabilidade</h2>
                                    <p className="text-psi-dark/70 leading-relaxed">
                                        A plataforma Porto Seguro Ingressos atua como intermediária entre compradores e organizadores. 
                                        Não nos responsabilizamos por:
                                    </p>
                                    <ul className="space-y-2 text-psi-dark/70">
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Qualidade, segurança ou realização dos eventos criados pelos organizadores</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Danos decorrentes do mau uso do QR Code ou compartilhamento indevido</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Problemas técnicos ou de conectividade que possam afetar a validação de ingressos no local do evento</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Disputas entre compradores e organizadores que não estejam relacionadas diretamente ao funcionamento da plataforma</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-xl border border-psi-primary/20 p-6
                        sm:p-8 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-psi-primary/10 shrink-0">
                                    <FileText className="h-6 w-6 text-psi-primary" />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <h2 className="text-2xl font-semibold text-psi-dark">9. Alterações nos Termos</h2>
                                    <p className="text-psi-dark/70 leading-relaxed">
                                        Reservamo-nos o direito de modificar estes Termos e Condições a qualquer momento. 
                                        Alterações significativas serão comunicadas através da plataforma. 
                                        O uso continuado de nossos serviços após as alterações constitui aceitação dos novos termos.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-psi-primary/5 rounded-xl border border-psi-primary/20 p-6
                        sm:p-8 text-center space-y-4">
                            <h2 className="text-xl font-semibold text-psi-dark">Dúvidas sobre os Termos?</h2>
                            <p className="text-psi-dark/70">
                                Se você tiver dúvidas sobre estes Termos e Condições, entre em contato conosco através dos canais de suporte disponíveis na plataforma. 
                                Estamos sempre disponíveis para esclarecer qualquer questão.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </Background>
    )
}

export {
    TermosECondicoesInfo
}
