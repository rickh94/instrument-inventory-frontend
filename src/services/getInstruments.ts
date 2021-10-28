import { GenericOutcome, Instrument } from "@/util/commonTypes";
import { API } from "aws-amplify";

export async function getAllInstruments(): Promise<[GenericOutcome, Instrument[], string]> {
  let message = "";
  try {
    const { instruments, instrumentsFailed } = await API.get("instrument-inventory", "instruments/all", {});
    if (instrumentsFailed.length > 0) {
      console.log("Failed:", instrumentsFailed);
      message = `Some instrument failed to load`;
    }
    return [GenericOutcome.Ok, instruments, message];
  } catch (e) {
    console.error(e);
    const message = e.response ? "Error: " + e.response.data : e.toString();
    return [GenericOutcome.Err, [], message];
  }
}

export enum DoesInstrumentExist {
  Yes,
  No,
  Err
}

export async function checkNewNumber(instrumentNumber: string): Promise<[DoesInstrumentExist, string]> {
  try {
    await API.post("instrument-inventory",
      "search/number", { body: { term: instrumentNumber } });
    return [DoesInstrumentExist.Yes, "This number is already taken."];
  } catch (e) {
    console.error(e);
    if (e.response.status === 404) {
      return [DoesInstrumentExist.No, `Generating ${instrumentNumber}`];
    } else if (e.response) {
      return [DoesInstrumentExist.Err, e.response.data];
    }
    return [DoesInstrumentExist.Err, e.toString()];
  }
}

export async function getNextNumber(nextType: string, nextSize: string): Promise<[GenericOutcome, string, string]> {
  try {
    const instruments = await API.post("instrument-inventory", "filter",
      { body: { type: nextType, size: nextSize } }
    );
    const latestInstrumentNumber = instruments.map(ins => ins.number).sort().reverse()[0];
    if (latestInstrumentNumber === undefined) {
      return [GenericOutcome.Err, "", "No instruments found in that type/size."];
    }
    const [prefix, insNumber] = latestInstrumentNumber.split("-");
    const nextNumber = `${parseInt(insNumber) + 1}`.padStart(3, "0");
    const fullNumber = `${prefix}-${nextNumber}`;
    return [GenericOutcome.Ok, fullNumber, `Generating ${fullNumber}`];
  } catch (e) {
    console.error(e)
    if (e.response) {
      return [GenericOutcome.Err, "", e.response.data];
    }
    return [GenericOutcome.Err, "", e.toString()];
  }
}
