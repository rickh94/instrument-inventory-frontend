import { API } from "aws-amplify";
import { Instrument } from "@/util/commonTypes";

export enum SearchOutcome {
  FoundOne = "FOUND_ONE",
  FoundMultiple = "FOUND_MULTIPLE",
  FoundOnlyArchived = "FOUND_ONLY_ARCHIVED",
  NumberNotFound = "NUMBER_NOT_FOUND",
  NameNotFound = "NAME_NOT_FOUND",
  Err = "ERROR",
}

function getPath(input: string): string {
  // This regex will match the instrument number format and search for an instrument number.
  // If it does not match, it is assumed to be a name and searches in assigned and history.
  return input.match(/\w?\w?\d*-\d+/) ? "search/number" : "search/assigned-history";
}

export async function searchForInstrument(term: string, includeArchived: boolean):
  Promise<[SearchOutcome, Instrument | Instrument[], string]> {
  const path = getPath(term);
  try {
    const response = await API.post("instrument-inventory", path, {
      body: { term }
    });
    const instruments =
      path === "search/number" || includeArchived
        ? response
        : response.filter(item => !item.archived);
    if (instruments.length === 1) {
      return [SearchOutcome.FoundOne, instruments[0], "Instrument Found"];
    }
    if (instruments.length < 1) {
      return [SearchOutcome.FoundOnlyArchived, [], "Only archived instruments found"];
    }
    return [SearchOutcome.FoundMultiple, instruments, "Multiple instruments found"];
  } catch (e) {
    if (e.response.status === 404) {
      if (path === "search/number") {
        return [SearchOutcome.NumberNotFound, [], ""];
      } else {
        return [SearchOutcome.NameNotFound, [], `Could not find instrument assigned to ${term}`];
      }
    }
    const message = e.response ? e.response.data : e.toString();
    return [SearchOutcome.Err, [], `Error: ${message}`];
  }
}
