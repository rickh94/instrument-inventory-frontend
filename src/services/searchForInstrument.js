import { API } from "aws-amplify";

export const SEARCH_OUTCOMES = {
  foundOne: Symbol(),
  foundMultiple: Symbol(),
  foundOnlyArchived: Symbol(),
  numberNotFound: Symbol(),
  nameNotFound: Symbol(),
  error: Symbol(),
};

function getPath(input) {
  // This regex will match the instrument number format and search for an instrument number.
  // If it does not match, it is assumed to be a name and searches in assigned and history.
  return input.match(/\w?\w?\d*-\d+/) ? "search/number" : "search/assigned-history";
}

export async function searchForInstrument(term, includeArchived) {
  const path = getPath(term);
  try {
    const response = await API.post("instrument-inventory", path, {
      body: { term },
    });
    const instruments =
      path === "search/number" || includeArchived
        ? response
        : response.filter(item => !item.archived);
    if (instruments.length === 1) {
      return [SEARCH_OUTCOMES.foundOne, instruments[0]];
    }
    if (instruments.length < 1) {
      return [SEARCH_OUTCOMES.foundOnlyArchived, null];
    }
    return [SEARCH_OUTCOMES.foundMultiple, instruments];
  } catch (e) {
    if (e.response.status === 404) {
      if (path === "search/number") {
        return [SEARCH_OUTCOMES.numberNotFound, term];
      } else {
        return [SEARCH_OUTCOMES.nameNotFound, term];
      }
    }
    return [SEARCH_OUTCOMES.error, e.response.data];
  }
}
