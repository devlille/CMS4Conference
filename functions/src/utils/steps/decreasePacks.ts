import { getConfiguration } from "../../v3/infrastructure/getConfiguration";

export default async (
  firestore: FirebaseFirestore.Firestore,
  sponsoringType: string
) => {
  if (sponsoringType !== "newsletter") {
    const configuration = await getConfiguration(firestore);

    if (configuration) {
      await firestore
        .doc("editions/2025")
        .update({
          ...configuration,
          [sponsoringType]: configuration[sponsoringType] - 1,
        })
        .catch((err) => console.error(err));
    }
  }
};
