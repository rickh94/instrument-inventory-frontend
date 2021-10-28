import { sortBySize, sortByString } from "@/mixins/ordering";
import Component from "vue-class-component";
import Vue from "vue";
import { InstrumentString } from "@/util/stringTypes";

@Component
export default class ComputedStrings extends Vue {
  public strings!: InstrumentString[];

  get violinStrings(): InstrumentString[] {
    return this.strings
      .filter(item => item.type === "Violin")
      .sort(sortByString)
      .sort(sortBySize);
  }

  get violaStrings(): InstrumentString[] {
    return this.strings
      .filter(item => item.type === "Viola")
      .sort(sortByString)
      .sort(sortBySize);
  }

  get celloStrings(): InstrumentString[] {
    return this.strings
      .filter(item => item.type === "Cello")
      .sort(sortByString)
      .sort(sortBySize);
  }

  get bassStrings(): InstrumentString[] {
    return this.strings
      .filter(item => item.type === "Bass")
      .sort(sortByString)
      .sort(sortBySize);
  }
}

