import * as ejs from "ejs";
import * as markdownToPDf from "markdown-pdf";
import * as os from "os";

import ConventionEn from "../templates/convention_en";
import ConventionFr from "../templates/convention_fr";
import InvoiceFr from "../templates/invoice_fr";
import ProformaInvoiceFr from "../templates/proforma_invoice_fr";
import { Configuration, Settings } from "../../model";

function getSponsoringFees(sponsoring: string, configurationFromFirestore: Configuration): [string, number, number] {
  const sponsoringConfiguration = configurationFromFirestore.sponsorships.find(
    (s) => s.name.toLowerCase() === sponsoring.toLowerCase()
  );

  if (!sponsoringConfiguration) {
    return ["", 0, 0];
  }
  return [sponsoringConfiguration.priceString, sponsoringConfiguration.price, sponsoringConfiguration.freeTickets];
}

function generateFile(
  config: any,
  fileName: string,
  file: any,
  settings: Settings,
  invoiceType: any,
  configurationFromFirestore: Configuration
) {
  const getOfficialName = () => {
    if (!!config.officialName) {
      return config.officialName;
    }
    return config.name;
  };
  const DATE = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

  const [SPONSORING_TEXT, SPONSORING_NUMBER, NUMBER_PLACE] = getSponsoringFees(
    config.sponsoring,
    configurationFromFirestore
  );
  return new Promise((resolve, reject) => {
    const data = {
      COMPANY: getOfficialName(),
      SIRET: config.siret,
      COMPANY_ADDRESS: config.address,
      COMPANY_CP: config.zipCode,
      COMPANY_CITY: config.city,
      COMPANY_PERSON: config.representant,
      CONTACT: config.representant,
      ROLE: config.role,
      EVENT_EDITION: settings.convention.edition,
      EVENT_NAME: settings.gdg.event,
      NUMBER_PLACE,
      SPONSORING: config.sponsoring,
      PO: config.PO,
      SPONSORING_TEXT,
      SPONSORING_NUMBER,
      START_DATE: settings.convention.startdate,
      END_DATE: settings.convention.enddate,
      DATE,
      GDG_CP: settings.gdg.zipcode,
      GDG_ADDRESS: settings.gdg.address,
      GDG_CITY: settings.gdg.city,
      GDG_EMAIL: settings.mail.from,
      GDG_TEL: settings.gdg.tel,
      GDG_ACCOUNTANT_EMAIL: settings.gdg.accountantemail,
      GDG_WEBSITE: settings.gdg.website,
      INVOICE_NUMBER: config.invoiceNumber,
      INVOICE_TYPE: invoiceType,
    };
    try {
      console.log("Generator:", "generate " + fileName);
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

export function generateProformaInvoice(config: any, settings: Settings, configurationFromFirestore: Configuration) {
  return generateFile(
    config,
    `proforma_invoice_${config.id}.pdf`,
    ProformaInvoiceFr,
    settings,
    "FACTURE PRO FORMA",
    configurationFromFirestore
  );
}
export function generateDevis(config: any, settings: Settings, configurationFromFirestore: Configuration) {
  return generateFile(
    config,
    `devis_${config.id}.pdf`,
    ProformaInvoiceFr,
    settings,
    "DEVIS",
    configurationFromFirestore
  );
}
export function generateDepositInvoice(config: any, settings: Settings, configurationFromFirestore: Configuration) {
  return generateFile(
    config,
    `deposit_invoice_${config.id}.pdf`,
    ProformaInvoiceFr,
    settings,
    "FACTURE ACCOMPTE 100%",
    configurationFromFirestore
  );
}
export function generateInvoice(config: any, settings: Settings, configurationFromFirestore: Configuration) {
  return generateFile(config, `invoice_${config.id}.pdf`, InvoiceFr, settings, "", configurationFromFirestore);
}
export function generateConvention(config: any, settings: Settings, configurationFromFirestore: Configuration) {
  return generateFile(
    config,
    `convention_${config.id}.pdf`,
    config.lang === "fr" ? ConventionFr : ConventionEn,
    settings,
    "",
    configurationFromFirestore
  );
}
