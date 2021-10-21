import { AssignBody, GenericOutcome, Instrument } from "@/util/commonTypes";
import { API } from "aws-amplify";


export async function assignSingle(body: AssignBody): Promise<[GenericOutcome.Ok, string, Instrument] | [GenericOutcome.Err, string, null]> {
  if (body.number.length === 0) {
    return [GenericOutcome.Err, "Instrument Number is required", null];
  }
  if (body.location.length === 0) {
    return [GenericOutcome.Err, "Location is required", null];
  }
  try {
    const { message, item } = await API.post("instrument-inventory", "sign-out", {
      body
    });
    return [GenericOutcome.Ok, message, item];
  } catch (e) {
    console.error(e);
    const message = e.response ? e.response.data : e.toString();
    return [GenericOutcome.Err, message, null];
  }
}

export async function assignMultiple(instruments: AssignBody[]): Promise<[GenericOutcome.Ok, string] | [GenericOutcome.Err, string]> {
  try {
    const { updated } = await API.post("instrument-inventory", "sign-out/multiple", {
      body: {
        instruments
      }
    });
    return [GenericOutcome.Ok, updated.join(", ")];
  } catch (e) {
    console.error(e);
    const message = e.response ? e.response.data : e.toString();
    return [GenericOutcome.Err, message];
  }
}
