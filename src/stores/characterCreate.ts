import { giftValidator, nameValidator } from "@/utils/backendTypes";
import { defineStore } from "pinia";
import { z } from "zod";

const characterCreateStoreValidator = z.object({
  name: nameValidator,
  gift: giftValidator.optional(),
});

type CharacterCreateStore = z.infer<typeof characterCreateStoreValidator>;

export const useCharacterCreateStore = defineStore("characterCreate", {
  state: (): CharacterCreateStore => {
    return {
      name: "",
    };
  },
});
