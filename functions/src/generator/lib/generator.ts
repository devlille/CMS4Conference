import * as ejs from "ejs";
import * as markdownToPDf from "markdown-pdf";
import * as os from "os";

import { Configuration, Settings, SponsoringOption, SponsorshipConfiguration } from "../../model";

function getSponsoringFees(sponsoringConfiguration: SponsorshipConfiguration): [string, number, number] {
  if (!sponsoringConfiguration) {
    return ["", 0, 0];
  }
  return [sponsoringConfiguration.priceString, sponsoringConfiguration.price, sponsoringConfiguration.freeTickets];
}

function generateFile(
  config: any,
  fileName: string,
  fileModule: any,
  settings: Settings,
  invoiceType: any,
  configurationFromFirestore: Configuration
) {
  const file = fileModule.default;
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

  const sponsoringConfiguration: SponsorshipConfiguration | undefined = configurationFromFirestore.sponsorships.find(
    (s) => s.name.toLowerCase() === config.sponsoring.toLowerCase()
  );

  if (!sponsoringConfiguration) {
    return;
  }

  const [SPONSORING_TEXT, SPONSORING_NUMBER, NUMBER_PLACE] = getSponsoringFees(sponsoringConfiguration);

  const LINES: { label: string; price: number }[] = [];
  let total = SPONSORING_NUMBER;
  LINES.push({ label: `Partenariat ${settings.gdg.event}`, price: SPONSORING_NUMBER });

  (config.sponsoringOptions ?? []).forEach((option: SponsoringOption) => {
    total += option.price;
    LINES.push({ label: option.label, price: option.price });
  });

  return new Promise((resolve, reject) => {
    const considerations =
      config.lang === "fr"
        ? sponsoringConfiguration?.considerations
        : sponsoringConfiguration?.considerationsEn ?? sponsoringConfiguration?.considerations;

    const data = {
      LINES,
      CONSIDERATIONS: [
        ...considerations,
        ...(config.sponsoringOptions ?? []).map((option: SponsoringOption) => option.label),
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
      EVENT_EDITION: settings.convention.edition,
      EVENT_NAME: settings.gdg.event,
      NUMBER_PLACE,
      SPONSORING: config.sponsoring,
      PO: config.PO,
      SPONSORING_TEXT,
      SPONSORING_NUMBER: total,
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

export function generateProformaInvoice(config: any, settings: Settings, configurationFromFirestore: Configuration) {
  const ProformaInvoiceFr =
    settings.gdg.event === "Devfest Lille"
      ? require("./template_devfest/proforma_invoice_fr")
      : require("./template_cloudnord/proforma_invoice_fr");

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
  const ProformaInvoiceFr =
    settings.gdg.event === "Devfest Lille"
      ? require("./template_devfest/proforma_invoice_fr")
      : require("./template_cloudnord/proforma_invoice_fr");

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
  const ProformaInvoiceFr =
    settings.gdg.event === "Devfest Lille"
      ? require("./template_devfest/proforma_invoice_fr")
      : require("./template_cloudnord/proforma_invoice_fr");

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
  const InvoiceFr =
    settings.gdg.event === "Devfest Lille"
      ? require("./template_devfest/invoice_fr")
      : require("./template_cloudnord/invoice_fr");
  return generateFile(config, `invoice_${config.id}.pdf`, InvoiceFr, settings, "", configurationFromFirestore);
}
export function generateConvention(config: any, settings: Settings, configurationFromFirestore: Configuration) {
  const ConventionFr =
    settings.gdg.event === "Devfest Lille"
      ? require("./template_devfest/convention_fr")
      : require("./template_cloudnord/convention_fr");
  const ConventionEn =
    settings.gdg.event === "Devfest Lille"
      ? require("./template_devfest/convention_en")
      : require("./template_cloudnord/convention_fr");

  return generateFile(
    config,
    `convention_${config.id}.pdf`,
    config.lang === "fr" ? ConventionFr : ConventionEn,
    settings,
    "",
    configurationFromFirestore
  );
}
