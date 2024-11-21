import PartnerhipKoFactory from '../../emails/template/step-2-partnership-ko';
import { Company, Configuration } from '../../model';
import { sendEmailToAllContacts } from '../mail';

export default (company: Company, configuration: Configuration) => {
  sendEmailToAllContacts(company, PartnerhipKoFactory(configuration), configuration);
};
