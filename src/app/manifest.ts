import type { MetadataRoute } from "next"

export default function manisfest(): MetadataRoute.Manifest {
    return {
        "name": "Porto Seguro Ingressos",
        "short_name": "Porto Seguro Ingressos",
        "description": "A forma mais sofisticada de viver os eventos da capital do descobrimento. Conectamos organizadores locais e apaixonados pela cena cultural com uma experiência de compra inteligente, transparente e com taxas justas.",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#000000",
        "theme_color": "#6c4bff",
        "orientation": "portrait-primary",
        "icons": [
            {
                "src": "/images/logos/logo-porto-seguro-ingressos-primary.png",
                "sizes": "192x192",
                "type": "image/png"
            }
        ],
        "categories": ["eventos", "ingressos", "porto-seguro", "bahia"],
        "lang": "pt-BR",
        "dir": "ltr",
        "scope": "/",
        "prefer_related_applications": false
    }
}