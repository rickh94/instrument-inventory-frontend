import { AddStrings, InstrumentString, UseStrings } from "@/util/stringTypes";
import { GenericOutcome } from "@/util/commonTypes";
import { API } from "aws-amplify";

export async function getStrings(): Promise<[GenericOutcome, InstrumentString[], string]> {
  try {
    const { strings } = await API.get("instrument-inventory", "strings", {});
    return [GenericOutcome.Ok, strings, ""];
  } catch (e) {
    console.error(e);
    const message = e.response ? e.response.data : e.toString();
    return [GenericOutcome.Err, [], message];
  }
}

export async function updateStrings(path: string, updates: AddStrings | UseStrings): Promise<[GenericOutcome, string[], InstrumentString[], string]> {
  let message = "";
  try {
    const { updated, updatedItems, failed } = await API.post("instrument-inventory", path, {
      body: updates
    });
    if (failed.length > 0) {
      message = `Updates failed: ${failed.join(", ")}`;
    }
    return [GenericOutcome.Ok, updated, updatedItems, message];
  } catch (e) {
    console.error(e);
    message = e.response ? e.response.data : e.toString();
    return [GenericOutcome.Err, [], [], message];
  }
}

export async function createString(newString: InstrumentString): Promise<[GenericOutcome, InstrumentString | null, string]> {
  try {
    const { item, message } = await API.post("instrument-inventory", "strings", {
      body: {
        ...newString
      }
    });
    return [GenericOutcome.Ok, item, message];
  } catch (e) {
    console.error(e);
    if (e.response) {
      return [GenericOutcome.Err, null, e.response.data];
    } else {
      return [GenericOutcome.Err, null, e.toString()];
    }
  }
}
