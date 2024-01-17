import * as admin from "firebase-admin";
import * as cms4devfestFunctions from "./cms4devfest";
import * as cms4devfestFunctionsGdg from "./cms4devfest-gdg";

admin.initializeApp();

export const cms4devfest = cms4devfestFunctions;
export const cms4devfestgdg = cms4devfestFunctionsGdg;
