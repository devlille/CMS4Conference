export type Environement = {
  firebase?: Record<string, string>;
  emailDomain: string;
  files: Record<string, string>;
  sponsoringTypes: { value: string; label: string; enabled?: boolean }[];
  title: string;
};
