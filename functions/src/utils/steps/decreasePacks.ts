export default async (
  firestore: FirebaseFirestore.Firestore,
  sponsoringType: string
) => {
  if (sponsoringType !== "newsletter") {
    const configuration = await firestore
      .doc("editions/2025")
      .get()
      .then((invoice) => {
        return invoice.data();
      });

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
