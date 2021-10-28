import { GenericOutcome } from "@/util/commonTypes";
import { AddBow, Bow, UseBow } from "@/util/bowTypes";
import { API } from "aws-amplify";

export async function createBow(instrumentType: string, size: string, count: number): Promise<[GenericOutcome, string, Bow?]> {
  try {
    const { message, item } = await API.post("instrument-inventory", "bows", {
      body: {
        type: instrumentType,
        count,
        size
      }
    });
    return [GenericOutcome.Ok, message, item];
  } catch (e) {
    console.error(e);
    if (e.response) {
      return [GenericOutcome.Err, e.response.data];
    } else {
      return [GenericOutcome.Err, e.toString()];
    }
  }
}

export async function getBows(): Promise<[GenericOutcome, Bow[], string?]> {
  try {
    const { bows } = await API.get("instrument-inventory", "bows", {});
    return [GenericOutcome.Ok, bows];
  } catch (e) {
    console.error(e);
    if (e.response) {
      return [GenericOutcome.Err, [], e.response.data];
    } else {
      return [GenericOutcome.Err, [], e.toString()];
    }
  }
}

export async function updateBows(bowUpdates: AddBow[] | UseBow[], submitPath: string):
  Promise<[GenericOutcome, string[], Bow[], string[], string]> {
  try {
    const { updated, updatedItems, failed } = await API.post("instrument-inventory", submitPath, {
      body: {
        bow_updates: bowUpdates
      }
    });
    return [GenericOutcome.Ok, updated, updatedItems, failed, ""];
  } catch (e) {
    console.error(e);
    if (e.response) {
      return [GenericOutcome.Err, [], [], [], e.response.data];
    }
    return [GenericOutcome.Err, [], [], [], e.toString()];
  }
}
