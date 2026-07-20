export interface BenefitConfig {
    heading: string;
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