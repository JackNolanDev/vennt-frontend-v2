<template>
  <div :title="title" class="alignRow baseline wrap number syntax-container">
    <div
      v-for="(syntax, idx) in syntaxList"
      :key="syntax.type + idx"
      :class="syntaxClass(syntax)"
    >
      {{ syntax.value }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RollResult } from "@/stores/dice";
import { computed } from "vue";

const props = defineProps<{ rollResult: RollResult }>();

type MathResult = {
  type: "math";
  value: string;
  numeric?: boolean;
};
type DieResult = {
  type: "die";
  value: string;
  crit?: "success" | "fail";
  dropped?: boolean;
  exploded?: boolean;
};

const syntaxList = computed(() => {
  const matches = props.rollResult.notation.match(/\d+d\d+/gm) || [];
  const sidesList = matches.map((match) => {
    const dIdx = match.indexOf("d");
    const num = parseInt(match.substring(dIdx + 1));
    if (isNaN(num)) {
      return 0;
    }
    return num;
  });

  let diceGroupsSeen = 0;
  const result: Array<MathResult | DieResult> = [];
  props.rollResult.rolls.forEach((val) => {
    if (typeof val === "string") {
      result.push({ type: "math", value: val });
    } else if (typeof val === "number") {
      result.push({ type: "math", value: val.toString(), numeric: true });
    } else if (typeof val === "object") {
      result.push({ type: "math", value: "(" });
      val.rolls.forEach((dieResult, idx) => {
        if (idx !== 0) {
          result.push({ type: "math", value: "+" });
        }
        let crit: "success" | "fail" | null = null;
        if (diceGroupsSeen < sidesList.length) {
          const maxVal = sidesList[diceGroupsSeen];
          if (maxVal > 0 && dieResult.value === maxVal) {
            crit = "success";
          } else if (dieResult.value === 1) {
            crit = "fail";
          }
        }
        result.push({
          type: "die",
          value: dieResult.value.toString(),
          ...(crit && { crit }),
          ...(dieResult.modifiers.includes("drop") && { dropped: true }),
          ...(dieResult.modifiers.includes("explode") && { exploded: true }),
        });
      });
      result.push({ type: "math", value: ")" });
      diceGroupsSeen++;
    }
  });
  result.push(
    { type: "math", value: "=" },
    { type: "math", value: props.rollResult.total.toString(), numeric: true },
  );
  return result;
});

const title = computed(
  () =>
    `Notation: ${props.rollResult.notation}\n` +
    `Average Roll: ${props.rollResult.averageTotal}\n` +
    `Minimum Roll: ${props.rollResult.minTotal}\n` +
    `Maximum Roll: ${props.rollResult.maxTotal}`,
);

const syntaxClass = (syntax: MathResult | DieResult) => ({
  math: syntax.type === "math",
  numeric: syntax.type === "math" && syntax.numeric,
  die: syntax.type === "die",
  dropped: syntax.type === "die" && syntax.dropped,
  exploded: syntax.type === "die" && syntax.exploded,
  "crit-success": syntax.type === "die" && syntax.crit === "success",
  "crit-fail": syntax.type === "die" && syntax.crit === "fail",
});
</script>

<style scoped>
.syntax-container {
  font-size: 28px;
  column-gap: 2px;
}
.math.numeric {
  font-weight: 500;
}
.die {
  font-weight: 500;
  background-color: var(--blue-500);
  border-radius: var(--border-radius);
  padding: 2px;
  min-width: 33px;
  text-align: center;
}
.die.crit-success {
  background-color: var(--green-500);
}
.die.crit-fail {
  background-color: var(--red-700);
}
.die.dropped {
  background-color: var(--gray-700);
  text-decoration: line-through;
  text-decoration-color: var(--red-700);
}

.die.exploded::after {
  content: "!";
}
</style>
