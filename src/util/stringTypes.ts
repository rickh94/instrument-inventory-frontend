/* tslint:disable */
/* eslint-disable */
export type StringOption = "E" | "A" | "D" | "G" | "C";

export interface AddString {
  /**
   * Unique id of string type
   */
  id: string;
  /**
   * Number of the string to add
   */
  amount: number;
}

export interface AddStrings {
  /**
   * Ids and counts of strings to add
   */
  string_updates: AddString[];
}

export interface InstrumentString {
  /**
   * Type of instrument
   */
  type: string;
  size: string;
  /**
   * Which string it is
   */
  string: StringOption;
  /**
   * How many of this type of string we have
   */
  count?: number;
  id?: string;
}
export interface UseString {
  /**
   * Unique id of string type
   */
  id: string;
  /**
   * Number of the string to use
   */
  amount: number;
}
export interface UseStrings {
  /**
   * Ids and counts of strings to use
   */
  string_updates: UseString[];
}
