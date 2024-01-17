import { saveCompany } from "./conference4hall/save-event";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import { Storage } from "@google-cloud/storage";

import { defineSecret } from "firebase-functions/params";
const GEOCODE_API_KEY = defineSecret("GEOCODE_API_KEY");

const firestore = admin.firestore();
const storage = new Storage();

export const updatePartnerToC4H = functions
  .runWith({ secrets: [GEOCODE_API_KEY] })
  .firestore.document("companies-2024/{companyId}")
  .onUpdate(async (changes) => {
    const newValue = changes.after.data();
    await saveCompany(firestore, storage, changes.after.id, newValue, {
      c4hId: "devfest-lille-2024",
      year: "2024",
      geocodeApiKey: GEOCODE_API_KEY.value(),
    });
  });
