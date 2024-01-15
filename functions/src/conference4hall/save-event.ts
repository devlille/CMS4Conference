import { update, remove } from './firestore-dao';
import { save } from './storage-dao';
import { generate } from '../utils/image-resizing';
import { getAddress } from '../utils/gmap';
import { Storage } from '@google-cloud/storage';

export async function saveCompany(
    firestore: FirebaseFirestore.Firestore,
    storage: Storage,
    companyId: string,
    event: any,
    context: any
) {
  if (event.public == false) {
    console.log("The partner isn't public.");
    return;
  }
  if (event.edition != context.year) {
    console.log(`Partner is registered for another edition (${context.year}).`);
    return;
  }
  if (event.status.paid != "done") {
    console.log("Partner didn't paid yet.");
    return;
  }
  if (event.logoUrl == "" ||
    event.logoUrl == undefined ||
    event.logoUrl == null) {
    console.log("Partner doesn't have a logo.");
    return;
  }
  if (event.siteUrl == "" ||
    event.siteUrl == undefined ||
    event.siteUrl == null) {
    console.log("Partner doesn't have a website.");
    return;
  }
  if (event.archived == true) {
    await remove(firestore, context.c4hId, companyId);
  } else {
    const media = {
      svg: event.logoUrl,
      pngs: {
        _250: await _genPng(storage, context.c4hId, companyId, event.logoUrl, 250),
        _500: await _genPng(storage, context.c4hId, companyId, event.logoUrl, 500),
        _1000: await _genPng(storage, context.c4hId, companyId, event.logoUrl, 1000),
      },
    };
    const address = await getAddress(context.geocodeApiKey, event.address);
    await update(firestore, context.c4hId, companyId, event, address, media);
  }
};

async function _genPng(
    storage: Storage,
    c4hId: string,
    companyId: string,
    logoUrl: string,
    size: number
) {
  const image = await generate(logoUrl, size);
  return await save(storage, c4hId, companyId, size, image);
}
