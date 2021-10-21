import { GenericOutcome, OtherItem } from "@/util/commonTypes";
import { API } from "aws-amplify";

export async function createItem(newItem: OtherItem): Promise<[GenericOutcome, string, OtherItem?]> {
  try {
    const { message, item } = await API.post("instrument-inventory", "other/create", {
      body: {
        ...newItem
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

export async function getItems(): Promise<[GenericOutcome, OtherItem[], string?]> {
  try {
    const { items } = await API.get("instrument-inventory", "other", {});
    return [GenericOutcome.Ok, items];
  } catch (e) {
    console.error(e);
    if (e.response) {
      return [GenericOutcome.Err, [], e.response.data];
    } else {
      return [GenericOutcome.Err, [], e.toString()];
    }
  }
}

export async function moveItem(itemId: string, fromLocation: string, toLocation: string, count: number): Promise<[GenericOutcome, OtherItem | null, string?]> {
  try {
    const { item } = await API.post("instrument-inventory", "other/move", {
      body: {
        id: itemId,
        from_location: fromLocation,
        to_location: toLocation,
        count
      }
    });
    return [GenericOutcome.Ok, item];
  } catch (e) {
    console.error(e);
    if (e.response) {
      return [GenericOutcome.Err, null, e.response.data];
    } else {
      return [GenericOutcome.Err, null, e.toString()];
    }
  }
}

export async function updateMultipleItems(updates: { id: string, amount: number }[], submitPath: string):
  Promise<[GenericOutcome, string[], OtherItem[], string | null]> {
  try {
    const { updated, updatedItems, failed } = await API.post("instrument-inventory", submitPath, {
      body: {
        item_updates: updates
      }
    });
    const message = failed.length > 0 ? `Updates Failed: ${failed.join(", ")}` : null;
    return [GenericOutcome.Ok, updated, updatedItems, message];
  } catch (e) {
    console.error(e);
    if (e.response) {
      return [GenericOutcome.Err, [], [], e.response.data];
    } else {
      return [GenericOutcome.Err, [], [], e.toString()];
    }
  }
}
