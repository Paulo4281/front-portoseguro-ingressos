"use client"

import { useEffect, useId, useMemo } from "react"
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
    /** Índice do slide que deve ficar por cima dos outros (ex.: card com hover preview aberto). */
    activeSlideIndex?: number
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
        continuous = false,
        activeSlideIndex = -1
    }: TCarouselProps
) => {
    if (!items || items.length === 0) {
        return null
    }

    useEffect(() => {
        // Seleciona todos os elementos que possuem as 3 classes especificadas
        const elems = document.querySelectorAll('.swiper-slide.swiper-slide-next.h-auto\\!')
        elems.forEach(el => {
            el.classList.add("z-[0]")
        })
        console.log(elems)
    }, [])

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
                    <SwiperSlide
                        key={`carousel-item-${index}`}
                        className={cn("h-auto! self-start", activeSlideIndex >= 0 ? (activeSlideIndex === index ? "z-50!" : "z-[-1]!") : undefined)}
                    >
                        <div className={cn("flex justify-center items-start", itemWrapperClassName)}>
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