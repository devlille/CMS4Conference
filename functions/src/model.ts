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
export type Configuration = SponsoringType & {
  next_value: string;
  enabled: boolean;
  sponsorships: {
    freeTickets: number;
    name: string;
    price: number;
    priceString: string;
  }[];
};
