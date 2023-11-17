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
        port: 8080,
      },
    });

    await testEnv.withSecurityRulesDisabled((context) => {
      const firestoreWithoutRule = context.firestore();
      return firestoreWithoutRule.collection("companies-2024").doc("1").set({ name: "initial user name" });
    });
  });

  it("", async () => {
    const user = testEnv.unauthenticatedContext();
    await testing.assertFails(getDocs(collection(user.firestore(), "companies-2024")));
  });

  it("", async () => {
    const user = testEnv.authenticatedContext("manu", { email: "manu@gdglille.org" });
    await testing.assertSucceeds(getDocs(collection(user.firestore(), "companies-2024")));
  });
});
