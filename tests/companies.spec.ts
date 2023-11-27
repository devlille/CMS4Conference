import { readFileSync } from "fs";
import * as testing from "@firebase/rules-unit-testing";
import { collection, getDocs } from "@firebase/firestore";

const projectId = "test-project";

describe("Testing users (users/{userId}) security rule", () => {
  let testEnv: testing.RulesTestEnvironment;

  beforeAll(async () => {
    testEnv = await testing.initializeTestEnvironment({
      projectId: projectId,
      firestore: {
        rules: readFileSync("firestore.rules", "utf8"),
        host: "localhost",
        port: require("../firebase.json").emulators.firestore.port,
      },
    });

    await testEnv.withSecurityRulesDisabled(async (context) => {
      const firestoreWithoutRule = context.firestore();
      await firestoreWithoutRule.collection("companies-2024").doc("1").set({ name: "initial user name" });
    });
  });

  it("should not be able to access to the collection", async () => {
    const user = testEnv.unauthenticatedContext();
    await testing.assertFails(getDocs(collection(user.firestore(), "companies-2024")));
  });

  it("should be able to access to the collection", async () => {
    const user = testEnv.authenticatedContext("manu", { email: "manu@gdglille.org" });
    await testing.assertSucceeds(getDocs(collection(user.firestore(), "companies-2024")));
  });
});
