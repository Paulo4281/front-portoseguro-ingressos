class ImageUtilsClass {
    getEventImageUrl(imageHash: string): string {
        if (!imageHash) return ""
        
        const bucketUrl = process.env.NEXT_PUBLIC_BUCKET_URL || ""
        return `${bucketUrl}/events/${imageHash}`
    }

    getUserImageUrl(imageHash: string | null | undefined): string {
        if (!imageHash) return ""

        const bucketUrl = process.env.NEXT_PUBLIC_BUCKET_URL || ""
        return `${bucketUrl}/users/${imageHash}`
    }

    getOrganizerLogoUrl(logoHash: string | null | undefined): string {
        if (!logoHash) return ""

        const bucketUrl = process.env.NEXT_PUBLIC_BUCKET_URL || ""
        return `${bucketUrl}/organizers-logos/${logoHash}`
    }

    getOrganizerIdentityDocumentUrl(documentHash: string | null | undefined): string {
        if (!documentHash) return ""

        const bucketUrl = process.env.NEXT_PUBLIC_BUCKET_URL || ""
        return `${bucketUrl}/organizers-documents/${documentHash}`
    }
}

export const ImageUtils = new ImageUtilsClass()

