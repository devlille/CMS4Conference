import * as ejs from "ejs";
import * as markdownToPDf from "markdown-pdf";
import * as os from "os";

import {
  Configuration,
  SponsoringOption,
  SponsorshipConfiguration,
} from "../../model";

function getSponsoringFees(
  sponsoringConfiguration: SponsorshipConfiguration
): [string, number, number] {
  if (!sponsoringConfiguration) {
    return ["", 0, 0];
  }
  return [
    sponsoringConfiguration.priceString,
    sponsoringConfiguration.price,
    sponsoringConfiguration.freeTickets,
  ];
}

function generateFile(
  config: any,
  fileName: string,
  fileModule: any,
  configuration: Configuration,
  invoiceType: any
) {
  const file = fileModule.default;
  const getOfficialName = () => {
    if (config.officialName) {
      return config.officialName;
    }
    return config.name;
  };
  const DATE = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

  const sponsoringConfiguration: SponsorshipConfiguration | undefined =
    configuration.sponsorships.find(
      (s) => s.name.toLowerCase() === config.sponsoring.toLowerCase()
    );

  if (!sponsoringConfiguration) {
    return;
  }

  const [SPONSORING_TEXT, SPONSORING_NUMBER, NUMBER_PLACE] = getSponsoringFees(
    sponsoringConfiguration
  );

  const LINES: { label: string; price: number }[] = [];
  let total = 0;

  if (SPONSORING_NUMBER > 0) {
    total += SPONSORING_NUMBER;
    LINES.push({
      label: `Partenariat ${configuration.gdg.event}`,
      price: SPONSORING_NUMBER,
    });
  }

  (config.sponsoringOptions ?? []).forEach((option: SponsoringOption) => {
    total += option.price;
    LINES.push({ label: option.label, price: option.price });
  });

  return new Promise((resolve, reject) => {
    const considerations =
      config.lang === "fr"
        ? sponsoringConfiguration?.considerations
        : sponsoringConfiguration?.considerationsEn ??
          sponsoringConfiguration?.considerations;

    const data = {
      LINES,
      CONSIDERATIONS: [
        ...considerations,
        ...(config.sponsoringOptions ?? []).map(
          (option: SponsoringOption) => option.label
        ),
      ],
      HAS_BOOTH: sponsoringConfiguration?.hasBooth?.toString(),
      COMPANY: getOfficialName().trim(),
      SIRET: config.siret,
      COMPANY_ADDRESS: config.address?.trim(),
      COMPANY_CP: config.zipCode?.toString()?.trim(),
      COMPANY_CITY: config.city?.trim(),
      COMPANY_PERSON: config.representant,
      CONTACT: config.representant.trim(),
      ROLE: config.role.trim(),
      EVENT_EDITION: configuration.convention.edition,
      EVENT_NAME: configuration.gdg.event,
      NUMBER_PLACE,
      SPONSORING: config.sponsoring,
      PO: config.PO,
      SPONSORING_TEXT,
      SPONSORING_NUMBER: total,
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
      INVOICE_NUMBER: config.invoiceNumber,
      INVOICE_TYPE: invoiceType,
    };

    try {
      console.log("Generator:", "generate " + fileName);
      console.log(data);

      const str = ejs.render(file, data);
      markdownToPDf({
        paperBorder: "3cm",
      })
        .from.string(str)
        .to(os.tmpdir() + "/" + fileName, () => {
          resolve(fileName);
        });
    } catch (e) {
      console.log("Generator:", "error when generating " + fileName, e);

      reject(e);
    }
  });
}

export function generateProformaInvoice(
  config: any,
  configuration: Configuration
) {
  const ProformaInvoiceFr = require(
    `./${configuration.template_folder}/proforma_invoice_fr`
  );

  return generateFile(
    config,
    `proforma_invoice_${config.id}.pdf`,
    ProformaInvoiceFr,
    configuration,
    "FACTURE PRO FORMA"
  );
}
export function generateDevis(config: any, configuration: Configuration) {
  const ProformaInvoiceFr = require(
    `./${configuration.template_folder}/proforma_invoice_fr`
  );

  return generateFile(
    config,
    `devis_${config.id}.pdf`,
    ProformaInvoiceFr,
    configuration,
    "DEVIS"
  );
}
export function generateDepositInvoice(
  config: any,
  configuration: Configuration
) {
  const ProformaInvoiceFr = require(
    `./${configuration.template_folder}/proforma_invoice_fr`
  );

  return generateFile(
    config,
    `deposit_invoice_${config.id}.pdf`,
    ProformaInvoiceFr,
    configuration,
    "FACTURE ACCOMPTE 100%"
  );
}
export function generateInvoice(config: any, configuration: Configuration) {
  const InvoiceFr = require(`./${configuration.template_folder}/invoice_fr`);

  return generateFile(
    config,
    `invoice_${config.id}.pdf`,
    InvoiceFr,
    configuration,
    ""
  );
}
export function generateConvention(config: any, configuration: Configuration) {
  const Convention = require(
    `./${configuration.template_folder}/convention_${config.lang}`
  );

  return generateFile(
    config,
    `convention_${config.id}.pdf`,
    Convention,
    configuration,
    ""
  );
}
