import { useEntityStore } from "@/stores/entity";

export const handleEndTimePeriod = (period: "turn" | "encounter" | "rest") => {
  const entityStore = useEntityStore();
  if (!entityStore.entity) {
    return;
  }
  entityStore.entity.abilities.forEach((ability) => {
    if (
      ability.active &&
      ability.uses?.adjust &&
      compTimePeriod(ability.uses.adjust.time, period) >= 0
    ) {
      entityStore.updateAbility(ability.id, { active: false });
    }
  });
  entityStore.entity.items.forEach((item) => {
    if (
      item.active &&
      item.uses?.adjust &&
      compTimePeriod(item.uses.adjust.time, period) >= 0
    ) {
      if (item.type === "consumable") {
        entityStore.deleteItemById(item.id);
      } else {
        entityStore.updateItem(item.id, { active: false });
      }
    }
  });
};

export const compTimePeriod = (
  p1: "rest" | "turn" | "encounter" | "permanent",
  p2: "rest" | "turn" | "encounter" | "permanent"
): number => {
  const timeMap = {
    turn: 1,
    encounter: 2,
    rest: 3,
    permanent: 100,
  };
  return timeMap[p2] - timeMap[p1];
};
