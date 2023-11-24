<template>
  <div v-bind:title="title" class="alignRow wrap">
    <div
      v-for="(diceElement, idx) in elementsToRender"
      v-bind:key="idx"
      v-bind:class="diceRenderClass(diceElement)"
      class="alignRow wrap"
    >
      <div v-if="diceElement.type === 'math'" class="diceElement math">
        <div class="shiftDown">{{ diceElement.val }}</div>
      </div>
      <div
        v-else-if="diceElement.type === 'die'"
        v-bind:class="diceClass(diceElement)"
        class="diceElement dice"
      >
        <div class="shiftDown">
          {{ diceElement.val }}<span v-if="diceElement.exploded">!</span>
        </div>
      </div>
      <div
        v-else-if="diceElement.type === 'const'"
        class="diceElement constantContainer"
      >
        <div class="diceElement constant">{{ diceElement.val }}</div>
      </div>
    </div>
    <div class="alignRow mathRender">
      <div class="diceElement math shiftDown">=</div>
      <div class="total shiftDown">{{ roll.total }}</div>
    </div>
  </div>
</template>

<script>
// NOTE: this could probably be converted to TS some day, but for now is just vanilla JS
export default {
  name: "diceRender",
  props: {
    roll: { type: Object, required: true },
  },
  computed: {
    elementsToRender() {
      const matches = this.roll.notation.match(/\d+d\d+/gm) || [];
      const sidesList = matches.map((match) => {
        const dIdx = match.indexOf("d");
        const num = parseInt(match.substring(dIdx + 1));
        if (isNaN(num)) {
          return 0;
        }
        return num;
      });
      let diceGroupsSeen = 0;
      const elements = [];
      const addMath = (math) => {
        elements.push({ type: "math", val: math });
      };
      const addDice = (dieResult, diceGroup) => {
        const el = { type: "die", val: dieResult.value };
        if (diceGroup < sidesList.length) {
          const maxVal = sidesList[diceGroup];
          if (maxVal > 0 && dieResult.value === maxVal) {
            el.crit = "success";
          } else if (dieResult.value === 1) {
            el.crit = "fail";
          }
        }
        if (dieResult.modifiers.includes("drop")) {
          el.dropped = true;
        }
        if (dieResult.modifiers.includes("explode")) {
          el.exploded = true;
        }
        elements.push(el);
      };
      const addConstant = (constant) => {
        elements.push({ type: "const", val: constant });
      };
      this.roll.rolls.forEach((rollElement) => {
        if (
          typeof rollElement === "object" &&
          typeof rollElement.value === "number" &&
          rollElement.rolls.length > 0
        ) {
          addMath("(");
          rollElement.rolls.forEach((dieResult, idx) => {
            if (idx !== 0) {
              addMath("+");
            }
            addDice(dieResult, diceGroupsSeen);
          });
          addMath(")");
          diceGroupsSeen++;
        } else if (typeof rollElement === "string") {
          addMath(rollElement);
        } else if (typeof rollElement === "number") {
          addConstant(rollElement);
        }
      });
      return elements;
    },
    title() {
      return (
        `Average value: ${this.roll.averageTotal}\n` +
        `Minimum Roll: ${this.roll.minTotal}\n` +
        `Maximum Roll: ${this.roll.maxTotal}`
      );
    },
  },
  methods: {
    diceRenderClass(diceElement) {
      return {
        mathRender: diceElement.type === "math",
      };
    },
    diceClass(dice) {
      return {
        dropped: dice.dropped,
        "crit-success": dice.crit === "success",
        "crit-fail": dice.crit === "fail",
      };
    },
  },
};
</script>

<style scoped>
.diceSum {
  margin-bottom: 8px;
}

.diceRow {
  display: flex;
  flex-wrap: wrap;
}

.diceElement {
  font-family: var(--number-font);
  font-weight: 500;
  font-size: 22pt;
  width: 40px;
  height: 40px;
  text-align: center;
  border-radius: 5px;
}

.dice {
  background-color: var(--main-button);
  color: white;
}
.dice.crit-success {
  background-color: var(--green-500);
}
.dice.crit-fail {
  background-color: var(--red-700);
}
.dice.dropped {
  background-color: var(--gray-700);
}
/* sudo class which crosses out the dropped die */
.dice.dropped::after {
  content: "/";
  font-family: var(--app-font);
  color: black;
  font-size: 72px;
  position: relative;
  top: -58px;
  left: -3px;
}

.math {
  font-weight: 400;
  width: 30px;
}

/* Pile constant and border on top of each other, so the border doesn't affect the height for the number */
.constantContainer {
  position: relative;
  width: 34px;
  height: 34px;
  border: 3px solid var(--logo-color);
}
.constant {
  margin-left: -3px; /* margin left instead of top because of 3px border in container */
}

.total {
  font-family: var(--number-font);
  font-weight: 500;
  font-size: 22pt;
  height: 40px;
  text-align: center;
  border-radius: 5px;
}

.shiftDown {
  margin-top: 3px;
}

.mathRender + .mathRender {
  margin-left: -10px; /* Gets the spacing down a bit better */
}
</style>
