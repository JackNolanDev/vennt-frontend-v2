import type { DiceSettings, EntityAttribute } from "vennt-library";
import type { DiceRoll } from "@dice-roller/rpg-dice-roller";
import { defineStore } from "pinia";

type DiceStore = {
  latestRoll: {
    [key in EntityAttribute]?: DiceRoll;
  };
  defaultDiceSettings: DiceSettings;
  diceDropDown: boolean;
  useBuiltinDice: boolean;
};

export const useDiceStore = defineStore("dice", {
  state: (): DiceStore => {
    return {
      latestRoll: {},
      defaultDiceSettings: {
        flow: 0,
        ebb: 0,
        rr1s: false,
        otherToggles: {},
      },
      diceDropDown: false, // shared between components to hopefully make the experience feel a bit smoother
      useBuiltinDice: true,
    };
  },
  actions: {
    updateLatestRoll(attr: EntityAttribute, roll: DiceRoll) {
      this.latestRoll[attr] = roll;
    },
    toggleDiceDropDown() {
      this.diceDropDown = !this.diceDropDown;
    },
    toggleUseBuiltinDice() {
      this.useBuiltinDice = !this.useBuiltinDice;
    },
  },
});
