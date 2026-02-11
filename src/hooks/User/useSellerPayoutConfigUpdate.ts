import { useMutationHook } from "../useMutation"
import { UserService } from "@/services/User/UserService"
import type { TApiResponse } from "@/types/TApiResponse"

type TSellerPayoutConfigPayload = {
    sellerBankId?: string | null
    sellerBankAccountName?: string | null
    sellerBankAccountOwnerName?: string | null
    sellerBankAccountOwnerBirth?: string | null
    sellerBankAccountOwnerDocumentType?: "CPF" | "CNPJ" | null
    sellerBankAccountOwnerDocument?: string | null
    sellerBankAccountAgency?: string | null
    sellerBankAccountNumber?: string | null
    sellerBankAccountDigit?: string | null
    sellerBankAccountType?: "CONTA_CORRENTE" | "CONTA_POUPANCA" | null
    sellerPixAddressKey?: string | null
    sellerPixAddressType?: "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "EVP" | null
    sellerPayoutMethod?: "PIX" | "BANK_ACCOUNT" | null
}

export const useSellerPayoutConfigUpdate = () => {
    const { mutateAsync, isPending } = useMutationHook<TSellerPayoutConfigPayload, TApiResponse>({
        mutationFn: (data) => UserService.updateSellerPayoutConfig(data)
    })

    return {
        mutateAsync,
        isPending
    }
}
