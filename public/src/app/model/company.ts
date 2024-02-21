import { Timestamp } from '@angular/fire/firestore';
import { z } from 'zod';

export type SponsoringType = Record<string, number>;

export const ZodConfiguration = z.object({
  next_value: z.string(),
  enabled: z.boolean(),
  openingDate: z.string(),
  sponsorships: z.array(
    z.object({
      freeTickets: z.number(),
      name: z.string(),
      price: z.number(),
      priceString: z.string(),
    }),
  ),
});
export type Configuration = SponsoringType & {
  sponsoringOptions?: SponsoringOption[];
} & z.infer<typeof ZodConfiguration>;

export type SponsoringOption = { key: string; label: string; price: number };
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
  sponsoringOptions?: SponsoringOption[];
}

export type PartnerType = 'esn' | 'other';
