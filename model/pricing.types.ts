export interface PricingPlanConfig {
  name: string;
  price: string;
  period?: string | null;
  features: string[];
  cta_text: string;
  featured?: boolean | null;
  badge_text?: string | null;
}

export interface PricingConfig {
  heading: string;
  headingHighlight?: string | null;
  headingAlign: ALIGN_CONFIG;
  plans: PricingPlanConfig[];
}
