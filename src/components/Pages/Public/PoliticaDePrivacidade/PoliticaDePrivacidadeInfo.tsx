"use client"

import { Shield, Lock, Eye, Database, UserCheck, FileText } from "lucide-react"
import { Background } from "@/components/Background/Background"

const PoliticaDePrivacidadeInfo = () => {
    return (
        <Background variant="light" className="min-h-screen">
            <div className="pt-32 pb-24 px-4
            sm:px-6
            lg:px-8">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-psi-primary/10 text-psi-primary text-sm font-medium uppercase tracking-wide">
                            <Shield className="h-4 w-4" />
                            Privacidade e Segurança
                        </div>
                        <h1 className="text-4xl
                        sm:text-5xl
                        lg:text-6xl font-semibold text-psi-dark leading-tight">
                            Política de <span className="text-psi-primary">Privacidade</span>
                        </h1>
                        <p className="text-lg
                        sm:text-xl text-psi-dark/70 max-w-2xl mx-auto">
                            Sua privacidade é nossa prioridade. Conheça como coletamos, utilizamos e protegemos seus dados pessoais.
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
                                    <Database className="h-6 w-6 text-psi-primary" />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <h2 className="text-2xl font-semibold text-psi-dark">Dados Coletados</h2>
                                    <p className="text-psi-dark/70 leading-relaxed">
                                        Coletamos apenas os dados necessários para proporcionar uma experiência completa e segura em nossa plataforma. 
                                        Os dados coletados incluem:
                                    </p>
                                    <ul className="space-y-2 text-psi-dark/70">
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span><strong className="text-psi-dark">Dados pessoais:</strong> nome completo, CPF/CNPJ, data de nascimento, e-mail, telefone e endereço entre outros</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span><strong className="text-psi-dark">Dados de pagamento:</strong> informações necessárias para processar transações de forma segura</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span><strong className="text-psi-dark">Dados de navegação:</strong> informações sobre como você utiliza nossa plataforma para melhorar nossos serviços</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span><strong className="text-psi-dark">Dados de eventos:</strong> informações sobre eventos que você cria ou participa</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-xl border border-psi-primary/20 p-6
                        sm:p-8 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-psi-primary/10 shrink-0">
                                    <Eye className="h-6 w-6 text-psi-primary" />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <h2 className="text-2xl font-semibold text-psi-dark">Como Utilizamos Seus Dados</h2>
                                    <p className="text-psi-dark/70 leading-relaxed">
                                        Utilizamos seus dados exclusivamente para:
                                    </p>
                                    <ul className="space-y-2 text-psi-dark/70">
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Processar e gerenciar suas compras de ingressos</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Facilitar a criação e gestão de eventos para organizadores</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Melhorar continuamente a experiência do usuário em nossa plataforma</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Enviar comunicações importantes sobre seus ingressos e eventos</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Disparar campanhas de marketing por e-mail, incluindo promoções, ofertas especiais, novos eventos e comunicações relevantes tanto da plataforma quanto dos organizadores dos eventos que você demonstrou interesse</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Aprimorar nossos serviços através de análises e feedbacks</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Cumprir obrigações legais e regulatórias</span>
                                        </li>
                                    </ul>
                                    <p className="text-psi-dark/70 leading-relaxed pt-2">
                                        <strong className="text-psi-dark">Importante:</strong> Nunca vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins comerciais. 
                                        As campanhas de marketing são enviadas exclusivamente pela plataforma e pelos organizadores dos eventos que você demonstrou interesse, sempre com a opção de descadastramento.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-xl border border-psi-primary/20 p-6
                        sm:p-8 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-psi-primary/10 shrink-0">
                                    <Lock className="h-6 w-6 text-psi-primary" />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <h2 className="text-2xl font-semibold text-psi-dark">Segurança dos Dados</h2>
                                    <p className="text-psi-dark/70 leading-relaxed">
                                        Implementamos medidas técnicas e organizacionais rigorosas para proteger seus dados pessoais:
                                    </p>
                                    <ul className="space-y-2 text-psi-dark/70">
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span><strong className="text-psi-dark">Criptografia SSL:</strong> Todas as transações são protegidas por criptografia de ponta a ponta</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span><strong className="text-psi-dark">Armazenamento seguro:</strong> Seus dados são armazenados em servidores seguros e protegidos</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span><strong className="text-psi-dark">Acesso restrito:</strong> Apenas pessoal autorizado tem acesso aos dados, e sempre com propósito específico</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span><strong className="text-psi-dark">Monitoramento contínuo:</strong> Monitoramos constantemente nossa infraestrutura para detectar e prevenir ameaças</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-xl border border-psi-primary/20 p-6
                        sm:p-8 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-psi-primary/10 shrink-0">
                                    <UserCheck className="h-6 w-6 text-psi-primary" />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <h2 className="text-2xl font-semibold text-psi-dark">Seus Direitos</h2>
                                    <p className="text-psi-dark/70 leading-relaxed">
                                        De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
                                    </p>
                                    <ul className="space-y-2 text-psi-dark/70">
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Acessar seus dados pessoais a qualquer momento</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Corrigir dados incompletos, inexatos ou desatualizados</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Solicitar a exclusão de dados desnecessários ou excessivos</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Revogar seu consentimento a qualquer momento</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-psi-primary mt-1">•</span>
                                            <span>Solicitar informações sobre o compartilhamento de seus dados</span>
                                        </li>
                                    </ul>
                                    <p className="text-psi-dark/70 leading-relaxed pt-2">
                                        Para exercer seus direitos, entre em contato conosco através dos canais de suporte disponíveis na plataforma.
                                    </p>
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
                                    <h2 className="text-2xl font-semibold text-psi-dark">Alterações nesta Política</h2>
                                    <p className="text-psi-dark/70 leading-relaxed">
                                        Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas práticas ou por outros motivos operacionais, legais ou regulatórios. 
                                        Quando houver alterações significativas, notificaremos você através dos canais de comunicação da plataforma.
                                    </p>
                                    <p className="text-psi-dark/70 leading-relaxed">
                                        Recomendamos que você revise esta política periodicamente para se manter informado sobre como protegemos seus dados.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-psi-primary/5 rounded-xl border border-psi-primary/20 p-6
                        sm:p-8 text-center space-y-4">
                            <h2 className="text-xl font-semibold text-psi-dark">Dúvidas sobre Privacidade?</h2>
                            <p className="text-psi-dark/70">
                                Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos seus dados pessoais, 
                                entre em contato conosco através dos canais de suporte disponíveis na plataforma.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </Background>
    )
}

export {
    PoliticaDePrivacidadeInfo
}
