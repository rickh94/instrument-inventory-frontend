import { GenericOutcome, Instrument } from "@/util/commonTypes";
import { API } from "aws-amplify";

type MoveMultipleResponse = {
  instrumentsUpdated: string[],
  instrumentsFailed: string[],
}

export async function moveMultiple(
  instrumentNumbers: string[], location: string
): Promise<[GenericOutcome.Ok, MoveMultipleResponse] | [GenericOutcome.Err, any]> {
  try {
    const { instrumentsUpdated, instrumentsFailed } = await API.post(
      "instrument-inventory",
      "move-multiple",
      {
        body: {
          numbers: instrumentNumbers,
          location
        }
      }
    );
    return [GenericOutcome.Ok, { instrumentsUpdated, instrumentsFailed }];
  } catch (e) {
    return [GenericOutcome.Err, e.response.data];
  }
}

