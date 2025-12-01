import type { TWallet, TWalletHistory } from "@/types/Wallet/TWallet"
import type { TApiResponse } from "@/types/TApiResponse"
import { AxiosResponse } from "axios"

const mockWallet: TApiResponse<TWallet> = {
    success: true,
    data: {
        value: 16300
    }
}

const mockWalletHistory: TApiResponse<TWalletHistory[]> = {
    success: true,
    data: [
        {
            date: "2024-01-10T14:30:00Z",
            value: 5000,
            type: "RECEIVED",
            eventName: "Show do Rodolfo"
        },
        {
            date: "2024-02-15T10:15:00Z",
            value: 3000,
            type: "PAYOUT"
        }
    ]
}

class WalletServiceClass {
    async getWallet(): Promise<AxiosResponse["data"]> {
        return mockWallet
    }

    async getWalletHistory(): Promise<AxiosResponse["data"]> {
        return mockWalletHistory
    }
}

export const WalletService = new WalletServiceClass()