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
}

export const ImageUtils = new ImageUtilsClass()

