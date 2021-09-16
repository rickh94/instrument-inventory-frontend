import { GenericOutcome, Instrument } from "@/util/commonTypes";
import { API } from "aws-amplify";


export async function toggleArchived(prevInstrument: Instrument):
  Promise<[GenericOutcome, string, Instrument]> {
  try {
    const {item: nextInstrument} = await API.put("instrument-inventory", `instruments/${prevInstrument.id}`, {
      body: {
        ...prevInstrument,
          archived: !prevInstrument.archived
      }
    });
    const change = nextInstrument.archived ? 'archived' : 'un-archived'
    return [GenericOutcome.Ok, `Instrument ${nextInstrument.number} ${change}`, nextInstrument];
  } catch (e) {
    console.error(e);
    return [GenericOutcome.Err, e.response.data, prevInstrument]
  }
}
