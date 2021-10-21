/* tslint:disable */
/* eslint-disable */

export interface Instrument {
  /**
   * The inventory number of the instrument
   */
  number: string;
  /**
   * The fractional or inch size of the instrument
   */
  size: string;
  /**
   * What kind of instrument
   */
  type: string;
  location: string;
  /**
   * Who it is signed out to
   */
  assignedTo?: string;
  maintenanceNotes?: string;
  conditionNotes?: string;
  condition?: number;
  quality?: number;
  /**
   * Whether it has been given permanently to the student it is assigned to.
   */
  gifted?: boolean;
  /**
   * An instrument that has been removed from inventory for some reason.
   */
  archived?: boolean;
  /**
   * The id of the instrument in the database
   */
  id?: string;
  history?: string[];
}
export interface RetrieveMultiple {
  /**
   * A list of instrument numbers to retrieve
   */
  numbers: string[];
}
export interface RetrieveSingle {
  /**
   * The number of the instrument to retrieve
   */
  number: string;
}
export interface Search {
  /**
   * Instrument number or name to search assigned or history
   */
  term: string;
}
export interface SignOut {
  /**
   * Instrument Number to sign out
   */
  number: string;
  /**
   * Name of the Person to sign out to
   */
  assignedTo?: string;
  /**
   * Primary location of instrument
   */
  location: Location;
}
export interface SignOutMultiple {
  /**
   * A list of instrument numbers, students, and locations
   */
  instruments: SignOut[];
}

export enum GenericOutcome {
  Ok = "OK",
  Err = "ERROR"
}

export interface AssignBody {
  number: string,
  location: string,
  assignedTo: string,
}

export interface OtherItem {
  id?: string,
  name: string,
  count: number,
  location_counts?: {[location: string]: number},
  signed_out_to?: string[],
  notes?: string,
}
