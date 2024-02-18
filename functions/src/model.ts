export type Convention = {
  edition: string;
  startdate: string;
  enddate: string;
};

export type Hosting = {
  baseurl: string;
};

export type Association = {
  address: string;
  zipcode: string;
  city: string;
  event: string;
  tel: string;
  accountantemail: string;
  website: string;
};

export type Email = {
  enabled: string;
  signature: string;
  to: string;
  from: string;
  fromname: string;
  cc: string;
};

export type Mailjet = {
  api: string;
  private: string;
};
export type Settings = {
  convention: Convention;
  hosting: Hosting;
  gdg: Association;
  mail: Email;
  mailjet: Mailjet;
};

export type SponsoringType = Record<string, number>;
export type SponsorshipConfiguration = {
  freeTickets: number;
  name: string;
  price: number;
  priceString: string;
  considerations: string[];
  considerationsEn: string[];
  hasBooth: boolean;
};
export type Configuration = SponsoringType & {
  next_value: string;
  enabled: boolean;
  sponsorships: SponsorshipConfiguration[];
  webhooks?: string[];
};

export type SponsoringOption = { label: string; price: number };
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

export type State = "disabled" | "enabled" | "pending" | "done" | "refused" | "retry";

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
  lang?: "fr" | "en";
  pending?: string;
  invoiceType: "devis" | "facture" | "proforma";
  wldId?: string;
  sponsoringOptions?: SponsoringOption[];
}

export type PartnerType = "esn" | "other";
