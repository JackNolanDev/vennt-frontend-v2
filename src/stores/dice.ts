import {
  REQUEST_DICE_ROLL_TYPE,
  type DiceCommands,
  type DiceSettings,
  type EntityAttribute,
  type RequestDiceRoll,
} from "vennt-library";
import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import { defineStore } from "pinia";
import { useEntityStore } from "./entity";
import { useCampaignStore } from "./campaign";
import router from "@/router";
import { v4 } from "uuid";

export type SingleDiceRollResultValue = {
  type: "result";
  calculationValue: number;
  modifierFlags: string;
  modifiers: string[];
  initialValue: number;
  useInTotal: boolean;
  value: number;
};
export type DiceRollResultValue = {
  type: "roll-results";
  total: number;
  rolls: SingleDiceRollResultValue[];
};

export type RollResult = {
  type: "dice-roll";
  output: string;
  total: number;
  minTotal: number;
  maxTotal: number;
  averageTotal: number;
  notation: string;
  rolls: Array<DiceRollResultValue | string | number>;
};

type DiceStore = {
  latestRoll: Record<string, DiceRoll>;
  rolls: Record<string, RollResult>;
  pendingRolls: Record<string, string>;
  defaultDiceSettings: DiceSettings;
  diceDropDown: boolean;
  useBuiltinDice: boolean;
};

export const useDiceStore = defineStore("dice", {
  state: (): DiceStore => {
    return {
      latestRoll: {},
      rolls: {},
      pendingRolls: {},
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
    async rollDice(dice: DiceCommands, key: string, comment?: string) {
      const entityStore = useEntityStore();
      const campaignStore = useCampaignStore();
      if (campaignStore.ws && entityStore.canEdit) {
        const campaignId =
          router.currentRoute.value.params.campaignId ??
          router.currentRoute.value.query.campaign;
        if (campaignStore.ws.campaignId === campaignId) {
          const requestId = v4();
          const diceMsg: RequestDiceRoll = {
            type: REQUEST_DICE_ROLL_TYPE,
            message: comment,
            dice: dice.web,
            entity: entityStore.entity?.entity.id,
            request_id: requestId,
            gm_only:
              entityStore.entity?.entity.type === "COG" ? "t" : undefined,
          };
          this.pendingRolls[requestId] = key;
          campaignStore.ws.send(diceMsg);
          return;
        } else {
          console.warn("not connected to correct WS, using default dice roll!");
        }
      }
      const rollResult = new DiceRoll(dice.web).toJSON();
      this.rolls[key] = JSON.parse(JSON.stringify(rollResult));
    },
  },
});
