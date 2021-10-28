import { sortBySize } from "@/mixins/ordering";
import Vue from "vue";
import { Bow } from "@/util/bowTypes";
import Component from "vue-class-component";

@Component
export default class ComputedBows extends Vue {
  public bows!: Bow[];

  get violinBows(): Bow[] {
    return this.bows.filter(item => item.type === "Violin").sort(sortBySize);
  }

  get violaBows(): Bow[] {
    return this.bows.filter(item => item.type === "Viola").sort(sortBySize);
  }

  get celloBows(): Bow[] {
    return this.bows.filter(item => item.type === "Cello").sort(sortBySize);
  }

  get bassBows(): Bow[] {
    return this.bows.filter(item => item.type === "Bass").sort(sortBySize);
  }


}
