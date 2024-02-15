import { Timestamp } from '@angular/fire/firestore';

export type SponsoringType = Record<string, number>;
export type Configuration = SponsoringType & {
  next_value: string;
  enabled: boolean;
  openingDate: string;
  sponsorships: {
    freeTickets: number;
    name: string;
    price: number;
    priceString: number;
  }[];
};
export interface Workflow {
  id: number;
  steps: WorkflowStep[];
}

export type State =
  | 'disabled'
  | 'enabled'
  | 'pending'
  | 'done'
  | 'refused'
  | 'retry';

export interface WorkflowStep {
  key: keyof WorkflowStatus;
  order: number;
  title: string;
  state: State;
  icon: string;
  description: string;
  class: 'is-primary' | 'is-danger' | 'is-secondary' | '';
}

export interface WorkflowStatus {
  filled?: State;
  validated?: State;
  sign?: State;
  paid?: State;
  received?: State;
  communicated?: State;
  generated?: State;
  code?: State;
}

export interface Company {
  archived?: boolean;
  billetWebDone?: boolean;
  billetWebUrl?: string;
  id?: string;
  tel: string;
  name: string;
  officialName?: string;
  address: string;
  zipCode: string;
  city: string;
  siret: string;
  representant: string;
  email: string | string[];
  role: string;
  PO?: number;
  sponsoring: string;
  secondSponsoring?: string;
  status?: WorkflowStatus;
  devisUrl: string;
  conventionUrl: string;
  invoiceUrl: string;
  type?: PartnerType;
  twitter?: string;
  twitterAccount?: string;
  linkedin?: string;
  linkedinAccount?: string;
  publicationDate?: Date;
  flyerUrl?: string;
  creationDate?: Timestamp;
  logoUrl?: string;
  conventionSignedUrl?: string;
  edition?: number;
  siteUrl?: string;
  keepDevFestTeam?: boolean;
  socialInformationComplete?: boolean;
  description?: string;
  activities?: string;
  lang?: 'fr' | 'en';
  pending?: string;
  invoiceType: 'devis' | 'facture' | 'proforma';
  wldId?: string;
}

export type PartnerType = 'esn' | 'other';
