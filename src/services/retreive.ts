import { GenericOutcome, Instrument } from "@/util/commonTypes";
import { API } from "aws-amplify";

type RetrieveMultipleResponse = {
  instrumentsUpdated: string[],
  instrumentsFailed: string[],
}

export async function retrieveMultiple(
  instrumentNumbers: string[]
): Promise<[GenericOutcome.Ok, RetrieveMultipleResponse] | [GenericOutcome.Err, any]> {
  try {
    const { instrumentsUpdated, instrumentsFailed } = await API.post(
      "instrument-inventory",
      "retrieve-multiple",
      {
        body: {
          numbers: instrumentNumbers
        }
      }
    );
    return [GenericOutcome.Ok, { instrumentsUpdated, instrumentsFailed }];
  } catch (e) {
    return [GenericOutcome.Err, e.response.data];
  }
}

export async function retrieveSingle(instrumentNumber: string):
  Promise<[GenericOutcome.Ok, string, Instrument]
    | [GenericOutcome.Err, string, null]>
{
  try {
    const {item: updatedInstrument, message} = await API.post("instrument-inventory", "retrieve-single", {
      body: {number: instrumentNumber}
    });
    return [GenericOutcome.Ok, message, updatedInstrument];
  } catch(e) {
    console.error(e)
    const message = e.response ? e.response.data : e.toString();
    return [GenericOutcome.Err, message, null]
  }

}
