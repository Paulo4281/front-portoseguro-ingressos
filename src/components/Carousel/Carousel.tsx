"use client"

import { useId, useMemo } from "react"
import type { ReactNode } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation } from "swiper/modules"
import type { SwiperOptions } from "swiper/types"
import "swiper/css"
import "swiper/css/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type TCarouselProps = {
    items: ReactNode[]
    className?: string
    slidesPerView?: SwiperOptions["slidesPerView"] | number
    spaceBetween?: number
    loop?: boolean
    autoplay?: boolean
    autoplayDelay?: number
    pauseOnHover?: boolean
    speed?: number
    showNavigation?: boolean
    breakpoints?: SwiperOptions["breakpoints"]
    centeredSlides?: boolean
    allowTouchMove?: boolean
    itemWrapperClassName?: string
    continuous?: boolean
}

const CarouselComponent = (
    {
        items,
        className,
        slidesPerView = "auto",
        spaceBetween = 24,
        loop = true,
        autoplay = true,
        autoplayDelay = 3000,
        pauseOnHover = true,
        speed = 600,
        showNavigation = false,
        breakpoints,
        centeredSlides = false,
        allowTouchMove = true,
        itemWrapperClassName,
        continuous = false
    }: TCarouselProps
) => {
    if (!items || items.length === 0) {
        return null
    }

    const uniqueId = useId().replace(/:/g, "")

    const modules = useMemo(() => {
        const list = []

        if (autoplay) {
            list.push(Autoplay)
        }

        if (showNavigation) {
            list.push(Navigation)
        }

        return list
    }, [autoplay, showNavigation])

    return (
        <div className={cn("relative w-full", className)}>
            {showNavigation && (
                <>
                    <div className="absolute top-1/2 z-10 -translate-y-1/2 rounded-full left-[10px]">
                        <Button
                            type="button"
                            variant="primary"
                            size="icon"
                            data-carousel-prev={uniqueId}
                            aria-label="Deslizar para o conteúdo anterior"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="absolute top-1/2 z-10 -translate-y-1/2 rounded-full right-[10px]">
                        <Button
                            type="button"
                            variant="primary"
                            size="icon"
                            data-carousel-next={uniqueId}
                            aria-label="Deslizar para o próximo conteúdo"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </>
            )}

            <Swiper
                modules={modules}
                loop={loop}
                slidesPerView={slidesPerView}
                spaceBetween={spaceBetween}
                breakpoints={breakpoints}
                centeredSlides={centeredSlides}
                allowTouchMove={allowTouchMove}
                speed={speed}
                autoplay={
                    autoplay
                        ? {
                            delay: continuous ? 0 : autoplayDelay,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: pauseOnHover && !continuous
                        }
                        : undefined
                }
                navigation={
                    showNavigation
                        ? {
                            prevEl: `[data-carousel-prev='${uniqueId}']`,
                            nextEl: `[data-carousel-next='${uniqueId}']`
                        }
                        : undefined
                }
                className="overflow-visible!"
            >
                {items.map((item, index) => (
                    <SwiperSlide key={`carousel-item-${index}`} className="h-auto!">
                        <div className={cn("flex justify-center", itemWrapperClassName)}>
                            {item}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export {
    CarouselComponent as Carousel
}