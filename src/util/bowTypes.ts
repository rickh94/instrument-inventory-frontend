/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export interface AddBow {
  /**
   * Unique id for the bow to add to
   */
  id: string;
  amount: number;
}
export interface AddBows {
  bow_updates: AddBow[];
}
export interface Bow {
  /**
   * Instrument size of the bows
   */
  size: string;
  /**
   * Instrument type of the bows
   */
  type: string;
  /**
   * How many of this type of bow do we have
   */
  count?: number;
  /**
   * Unique id for the type of bow
   */
  id?: string;
}
export interface UseBow {
  /**
   * Unique id of the bow to use
   */
  id: string;
  amount: number;
}
export interface UseBows {
  bow_updates: UseBow[];
}
