export interface BenefitConfig {
    heading: string;
    headingHighlight?: string | null;
    headingAlign: ALIGN_CONFIG;
    cardAlign: ALIGN_CONFIG;
    iconPosition: ALIGN_CONFIG;
    items: BenefitItem[];
}

interface BenefitItem {
    title: string;
    description: string;
    icon?: string;
  }