import { sendEmailToAllContacts } from "../mail";
import PartnerhipKoFactory from "../../emails/template/step-2-partnership-ko";
import { Company } from "../../model";

export default (company: Company, settings: any) => {
  sendEmailToAllContacts(company, PartnerhipKoFactory(settings), settings);
};
