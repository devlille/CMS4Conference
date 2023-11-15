import { getFrom } from "../../utils/mail";
const functions = require("firebase-functions");
jest.mock("firebase-functions");

it("should return from parameters for email", () => {
  functions.config = jest.fn().mockImplementation(() => ({
    mail: {
      from: "mail",
    },
  }));

  expect(getFrom()).toEqual({
    From: {
      Email: "mail",
      Name: "GDG Lille",
    },
  });
});
