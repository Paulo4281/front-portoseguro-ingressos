import { useQueryHook } from "../useQuery"
import { WalletService } from "@/services/Wallet/WalletService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TWalletHistory } from "@/types/Wallet/TWallet"

export const useWalletHistory = () => {
    const {
        data,
        isLoading,
        isError
    } = useQueryHook<TApiResponse<TWalletHistory[]>>({
        queryKey: ["wallet-history"],
        queryFn: () => WalletService.getWalletHistory()
    })

    return {
        data,
        isLoading,
        isError
    }
}