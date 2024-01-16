import { DocumentData } from "@google-cloud/firestore";
import { sendEmailToAllContacts } from "../mail";
import PartnerhipKoFactory from "../../emails/template/step-2-partnership-ko";

export default (company: DocumentData, settings: any) => {
  sendEmailToAllContacts(company, PartnerhipKoFactory(settings), settings);
};
