export interface HeroConfig {
    layout?: 'side' | 'background' | null;
    text: HeroTextConfig;
    image: HeroImageConfig;
    logo: HeroLogoConfig
}

interface HeroTextConfig {
    headline: string;
    headline_highlight?: string | null;
    subheadline: string;
    cta_text: string;
    align: ALIGN_CONFIG
}

interface HeroImageConfig {
    url?: string | null;
    position?: Exclude<ALIGN_CONFIG, 'center'> | null;
    shape?: 'circle' | 'rounded' | null;
    blur?: boolean | null;
    overlay_opacity?: number | null;
}

interface HeroLogoConfig {
    logoText?: string;
    logoIcon?: string;
    logoUrl?: string;
}