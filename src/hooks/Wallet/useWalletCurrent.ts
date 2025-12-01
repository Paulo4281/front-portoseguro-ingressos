import { useQueryHook } from "../useQuery"
import { WalletService } from "@/services/Wallet/WalletService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TWallet } from "@/types/Wallet/TWallet"

export const useWalletCurrent = () => {
    const {
        data,
        isLoading,
        isError
    } = useQueryHook<TApiResponse<TWallet>>({
        queryKey: ["wallet-current"],
        queryFn: () => WalletService.getWallet()
    })

    return {
        data,
        isLoading,
        isError
    }
}