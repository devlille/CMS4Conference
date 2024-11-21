import { Timestamp } from '@google-cloud/firestore';

export async function update(firestore: FirebaseFirestore.Firestore, c4hId: string, companyId: string, event: any, address: any, media: any) {
  const docRef = firestore.collection('conferences4hall').doc(c4hId).collection('companies').doc(companyId);
  const hasTwitter = event.twitterAccount == '' || event.twitterAccount == undefined;
  const hasLinkedin = event.linkedinAccount == '' || event.linkedinAccount == undefined;
  const hasSchemaSiteUrl = event.siteUrl.startsWith('https://');
  await docRef.set({
    id: companyId,
    name: event.name,
    description: event.description ? event.description : '',
    logoUrl: event.logoUrl,
    siteUrl: hasSchemaSiteUrl ? event.siteUrl : `https://${event.siteUrl}`,
    twitterUrl: hasTwitter ? null : event.twitterAccount,
    twitterMessage: event.twitter ? event.twitter : null,
    linkedinUrl: hasLinkedin ? null : event.linkedinAccount,
    linkedinMessage: event.linkedin ? event.linkedin : null,
    media: media,
    address: address
      ? address
      : {
          formatted: [event.address, `${event.zipCode} ${event.city}`],
          address: event.address,
          country: '',
          countryCode: '',
          city: event.city,
          lat: event.location.lat,
          lng: event.location.lng
        },
    sponsoring: event.sponsoring,
    wldId: event.wldId ? event.wldId : null,
    creationDate: Timestamp.fromDate(new Date())
  });
}

export async function remove(firestore: FirebaseFirestore.Firestore, c4hId: string, companyId: string) {
  await firestore.collection('conferences4hall').doc(c4hId).collection('companies').doc(companyId).delete();
}
