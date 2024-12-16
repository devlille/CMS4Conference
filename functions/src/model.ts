import { Timestamp } from 'firebase-admin/firestore';

export interface EmailContent {
  subject: string;
  body: string;
}

export interface Convention {
  edition: string;
  startdate: string;
  enddate: string;
  installationdate: string;
}

export interface Hosting {
  baseurl: string;
}

export interface Association {
  address: string;
  zipcode: string;
  city: string;
  event: string;
  tel: string;
  accountantemail: string;
  website: string;
}

export interface Email {
  mailgun: string;
  mailgun_email: 'mailgun@sandbox07d5e9881cce48d691889e3818d67885.mailgun.org';
  enabled: string;
  signature: string;
  to: string;
  from: string;
  fromname: string;
  cc: string;
}

export interface Mailjet {
  api: string;
  private: string;
}

export type SponsoringType = Record<string, number>;
export interface SponsorshipConfiguration {
  freeTickets: number;
  name: string;
  price: number;
  priceString: string;
  considerations: string[];
  considerationsEn: string[];
  hasBooth: boolean;
}

export type Configuration = SponsoringType & {
  next_value: string;
  enabled: boolean;
  openingDate: Timestamp;
  sponsorships: SponsorshipConfiguration[];
  webhooks?: string[];
  convention: Convention;
  hosting: Hosting;
  gdg: Association;
  mail: Email;
  mailjet: Mailjet;
  template_folder: string;
};

export interface SponsoringOption {
  label: string;
  price: number;
}
export type SponsoringOptions = SponsoringOption[];

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

export type State = 'disabled' | 'enabled' | 'pending' | 'done' | 'refused' | 'retry';

export interface Company {
  public: boolean;
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
  invoiceNumber?: string;
  type?: PartnerType;
  twitter?: string;
  twitterAccount?: string;
  linkedin?: string;
  linkedinAccount?: string;
  publicationDate?: Date;
  flyerUrl?: string;
  creationDate?: any;
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
