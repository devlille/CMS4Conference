import axios from 'axios';
import * as ejs from 'ejs';
import { writeFileSync } from 'fs';
import * as os from 'os';

import { Company, Configuration, SponsoringOption, SponsorshipConfiguration } from '../../model';

const generatePdf = (content: string) => {
  return axios
    .post('https://hook.eu2.make.com/bng7a8nbgg7093u3oofkwmm2t1hl9omd', content, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'text/plain'
      }
    })
    .then((body) => body.data)
    .catch((err: string) => console.log(err));
};

function getSponsoringFees(sponsoringConfiguration: SponsorshipConfiguration): [string, number, number] {
  if (!sponsoringConfiguration) {
    return ['', 0, 0];
  }
  return [sponsoringConfiguration.priceString, sponsoringConfiguration.price, sponsoringConfiguration.freeTickets];
}

function generateFile(company: Company, fileName: string, fileModule: { default: string }, configuration: Configuration, invoiceType: string): Promise<string> {
  const file = fileModule.default;
  const getOfficialName = () => {
    if (company.officialName) {
      return company.officialName;
    }
    return company.name;
  };
  const DATE = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date());

  const sponsoringConfiguration: SponsorshipConfiguration | undefined = configuration.sponsorships.find((s) => s.name.toLowerCase() === company.sponsoring.toLowerCase());

  if (!sponsoringConfiguration) {
    return Promise.reject();
  }

  // eslint-disable-next-line prefer-const
  let [SPONSORING_TEXT, SPONSORING_NUMBER, NUMBER_PLACE] = getSponsoringFees(sponsoringConfiguration);

  if (company.invoiceAmountNumber) {
    SPONSORING_NUMBER = company.invoiceAmountNumber;
    SPONSORING_TEXT = company.invoiceAmountString;
  }
  const LINES: { label: string; price: number }[] = [];
  let total = 0;

  if (SPONSORING_NUMBER > 0) {
    total += SPONSORING_NUMBER;
    LINES.push({
      label: `Partenariat ${configuration.gdg.event}`,
      price: SPONSORING_NUMBER
    });
  }

  (company.sponsoringOptions ?? []).forEach((option: SponsoringOption) => {
    total += option.price;
    LINES.push({ label: option.label, price: option.price });
  });

  return new Promise((resolve, reject) => {
    const considerations = company.lang === 'fr' ? sponsoringConfiguration?.considerations : (sponsoringConfiguration?.considerationsEn ?? sponsoringConfiguration?.considerations);

    const data = {
      LINES,
      CONSIDERATIONS: [...considerations, ...(company.sponsoringOptions ?? []).map((option: SponsoringOption) => option.label)],
      HAS_BOOTH: sponsoringConfiguration?.hasBooth?.toString(),
      COMPANY: getOfficialName().trim(),
      SIRET: company.siret,
      COMPANY_ADDRESS: company.address?.trim(),
      COMPANY_CP: company.zipCode?.toString()?.trim(),
      COMPANY_CITY: company.city?.trim(),
      COMPANY_PERSON: company.representant,
      CONTACT: company.representant.trim(),
      ROLE: company.role.trim(),
      EVENT_EDITION: configuration.convention.edition,
      EVENT_NAME: configuration.gdg.event,
      NUMBER_PLACE,
      SPONSORING: company.sponsoring,
      PO: company.PO,
      SPONSORING_TEXT,
      SPONSORING_NUMBER: total,
      INSTALLATION_DATE: configuration.convention.installationdate,
      START_DATE: configuration.convention.startdate,
      END_DATE: configuration.convention.enddate,
      DATE,
      GDG_CP: configuration.gdg.zipcode,
      GDG_ADDRESS: configuration.gdg.address,
      GDG_CITY: configuration.gdg.city,
      GDG_EMAIL: configuration.mail.from,
      GDG_TEL: configuration.gdg.tel,
      GDG_ACCOUNTANT_EMAIL: configuration.gdg.accountantemail,
      GDG_WEBSITE: configuration.gdg.website,
      INVOICE_NUMBER: company.invoiceNumber,
      INVOICE_TYPE: invoiceType
    };

    try {
      console.log('Generator:', 'generate ' + fileName);
      console.log(data);

      const str = ejs.render(file, data);
      generatePdf(str)
        .then((pdf) => {
          return writeFileSync(os.tmpdir() + '/' + fileName, pdf);
        })
        .then(() => resolve(fileName));
    } catch (e) {
      console.log('Generator:', 'error when generating ' + fileName, e);

      reject(e);
    }
  });
}

export function generateProformaInvoice(company: Company, configuration: Configuration) {
  const ProformaInvoiceFr = require(`./${configuration.template_folder}/proforma_invoice_fr`);

  return generateFile(company, `proforma_invoice_${company.id}.pdf`, ProformaInvoiceFr, configuration, 'FACTURE PRO FORMA');
}
export function generateDevis(company: Company, configuration: Configuration) {
  const ProformaInvoiceFr = require(`./${configuration.template_folder}/proforma_invoice_fr`);

  return generateFile(company, `devis_${company.id}.pdf`, ProformaInvoiceFr, configuration, 'DEVIS');
}
export function generateDepositInvoice(company: Company, configuration: Configuration) {
  const ProformaInvoiceFr = require(`./${configuration.template_folder}/proforma_invoice_fr`);

  return generateFile(company, `deposit_invoice_${company.id}.pdf`, ProformaInvoiceFr, configuration, 'FACTURE ACCOMPTE 100%');
}
export function generateInvoice(company: Company, configuration: Configuration) {
  const InvoiceFr = require(`./${configuration.template_folder}/invoice_fr`);

  return generateFile(company, `invoice_${company.id}.pdf`, InvoiceFr, configuration, '');
}
export function generateConvention(company: Company, configuration: Configuration) {
  const Convention = require(`./${configuration.template_folder}/convention_${company.lang}`);

  return generateFile(company, `convention_${company.id}.pdf`, Convention, configuration, '');
}
