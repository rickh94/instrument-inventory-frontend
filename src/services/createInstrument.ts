import { GenericOutcome, Instrument } from "@/util/commonTypes";
import { API } from "aws-amplify";

export async function createInstrument(newInstrument: Instrument):
  Promise<[GenericOutcome, string, Instrument?]> {
  try {
    const { item, message } = await API.post("instrument-inventory", "instruments", {
      body: {
        ...newInstrument,
      }
    });
    return [GenericOutcome.Ok, message, item];
  } catch (e) {
    if (e.response) {
      return [GenericOutcome.Err, e.response.data]
    }
    return [GenericOutcome.Err, e.toString()]
  }
}
