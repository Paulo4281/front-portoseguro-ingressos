"use client"

import { useState, useRef, useEffect } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { Background } from "@/components/Background/Background"
import { Input } from "@/components/Input/Input"
import { TicketService } from "@/services/Ticket/TicketService"
import { QrCode, Scan, Lock } from "lucide-react"
import { Toast } from "@/components/Toast/Toast"

const QrScanLinkPannel = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState("")
    const [isScanning, setIsScanning] = useState(false)
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const scannerContainerRef = useRef<HTMLDivElement>(null)
    const [scannerId] = useState(() => `qr-reader-link-${Date.now()}`)

    const handleAuthenticate = () => {
        if (!password) {
            Toast.error("Por favor, insira a senha")
            return
        }
        setIsAuthenticated(true)
    }

    const handleStartScan = async () => {
        setIsScanning(true)
        
        await new Promise(resolve => setTimeout(resolve, 100))
        
        if (!scannerContainerRef.current) {
            setIsScanning(false)
            Toast.error("Erro ao inicializar o scanner")
            return
        }

        try {
            const scanner = new Html5Qrcode(scannerId)
            scannerRef.current = scanner

            await scanner.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                (decodedText) => {
                    console.log("QR Code lido:", decodedText)
                    handleScanSuccess(decodedText)
                },
                (errorMessage) => {
                    // Ignorar erros de leitura contínua
                }
            )
        } catch (error) {
            console.error("Erro ao iniciar scanner:", error)
            setIsScanning(false)
            Toast.error("Erro ao iniciar a câmera. Verifique as permissões.")
        }
    }

    const handleStopScan = () => {
        if (scannerRef.current) {
            scannerRef.current.stop().then(() => {
                scannerRef.current?.clear()
                scannerRef.current = null
                setIsScanning(false)
            }).catch((error) => {
                console.error("Erro ao parar scanner:", error)
            })
        }
    }

    const handleScanSuccess = async (qrData: string) => {
        handleStopScan()
        console.log("Dados do QR Code antes de enviar:", qrData)
        
        try {
            const response = await TicketService.scanWithData(qrData)
            if (response?.success) {
                Toast.success("Ingresso validado com sucesso!")
            } else {
                Toast.error("Erro ao validar ingresso")
            }
        } catch (error) {
            console.error("Erro ao escanear:", error)
            Toast.error("Erro ao validar ingresso")
        }
    }

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => {})
            }
        }
    }, [])

    if (!isAuthenticated) {
        return (
            <Background variant="light" className="min-h-screen">
                <div className="container py-8 mt-[80px]">
                    <div className="max-w-md mx-auto">
                        <div className="rounded-xl border border-psi-primary/20 bg-white p-8 space-y-6">
                            <div className="text-center space-y-2">
                                <div className="mx-auto w-16 h-16 rounded-full bg-psi-primary/10 flex items-center justify-center">
                                    <Lock className="h-8 w-8 text-psi-primary" />
                                </div>
                                <h1 className="text-2xl font-bold text-psi-dark">Acesso Restrito</h1>
                                <p className="text-sm text-psi-dark/60">
                                    Insira a senha fornecida pelo organizador para acessar o escaneamento
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium text-psi-dark">
                                        Senha
                                    </label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Digite a senha"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleAuthenticate()
                                            }
                                        }}
                                        required
                                    />
                                </div>
                                <Button
                                    variant="primary"
                                    className="w-full"
                                    onClick={handleAuthenticate}
                                >
                                    Acessar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Background>
        )
    }

    return (
        <Background variant="light" className="min-h-screen">
            <div className="container py-8 mt-[80px]">
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="text-center space-y-2">
                        <div className="mx-auto w-16 h-16 rounded-full bg-psi-primary/10 flex items-center justify-center">
                            <QrCode className="h-8 w-8 text-psi-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-psi-dark">Escaneamento de QR Code</h1>
                        <p className="text-sm text-psi-dark/60">Escaneie os ingressos dos participantes</p>
                    </div>

                    <div className="flex justify-center">
                        {isScanning ? (
                            <Button
                                variant="destructive"
                                onClick={handleStopScan}
                                size="lg"
                            >
                                Parar Escaneamento
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                onClick={handleStartScan}
                                size="lg"
                            >
                                <Scan className="h-4 w-4 mr-2" />
                                Escanear
                            </Button>
                        )}
                    </div>

                    {isScanning && (
                        <div className="rounded-xl border border-psi-primary/20 bg-white p-6">
                            <div
                                id={scannerId}
                                ref={scannerContainerRef}
                                className="w-full"
                            />
                        </div>
                    )}
                </div>
            </div>
        </Background>
    )
}

export {
    QrScanLinkPannel
}
