import type {
  AbilityCostMap,
  EntityAttribute,
  HTMLString,
  UsesMap,
} from "../backendTypes";

type Equation = string | number;

interface CogAbilityCreationEffect {
  attrLevelAdjust: Partial<Record<EntityAttribute, Equation>>;
}

export interface CogAbility {
  name: string;
  cost: Equation;
  maxCost?: Equation; // If the ability uses X in its formula, this is the maximum value the user can set
  effect: HTMLString;
  creationEffect?: CogAbilityCreationEffect;
  uses?: UsesMap;
  useCost?: AbilityCostMap;
}

export interface CogAbilityCategory {
  name: string;
  options: CogAbility[];
}

export interface CogAbilitySection {
  section: string;
  categories: CogAbilityCategory[];
}

export const cogAbilityOptions: CogAbilitySection[] = [
  {
    section: "Course of Tactics",
    categories: [
      {
        name: "Templates",
        options: [
          {
            name: "Agile",
            cost: "L/2",
            effect:
              "This Cog’s Level is treated as {{L/4}} higher for the purpose of Vim, Speed, and Initiative.",
            creationEffect: {
              attrLevelAdjust: {
                vim: "(L/4) + L",
                speed: "(L/4) + L",
                init: "(L/4) + L",
              },
            },
          },
          {
            name: "Bruiser",
            cost: "L/2",
            effect:
              "This Cog deals +{{L}} damage with impact on all abilities.",
            uses: {
              check: {
                bonus: "+L",
                attr: "dmg",
              },
            },
          },
          {
            name: "Fighter",
            cost: "L/2",
            effect:
              "This Cog gains {{5*L}} Accuracy and half as much Vim (rounded up to the next multiple of 5).",
            uses: {
              adjust: {
                time: "permanent",
                attr: {
                  acc: "acc + (5*L)",
                  max_vim: "max_vim + ((5*L)/2) + 5 - (((5*L)/2) Mod 5)", // this is ridiculously complicated to solve for mathematically
                },
              },
            },
          },
          {
            name: "Mooks",
            cost: "L",
            effect:
              "This Cog has {{-L}} Initiative and only one fifth of its normal HP, but there are {{L}} of them. Mooks have halved values for all of their effects, such as damage, healing, DLs, and the number of times they can use abilities. The group of Mooks is considered one Cog for calculating Encounter difficulty.",
            uses: {
              adjust: {
                time: "permanent",
                attr: {
                  init: "init - L",
                  max_hp: "max_hp / 5",
                  dmg: "dmg / 2",
                },
              },
            },
          },
          {
            name: "Tank",
            cost: "L/2",
            effect: "This Cog gains {{L}} Armor and {{5*L}} Vim.",
            uses: {
              adjust: {
                time: "permanent",
                attr: {
                  armor: "armor + L",
                  max_vim: "max_vim + 5*L",
                },
              },
            },
          },
        ],
      },
      {
        name: "Major Abilities",
        options: [
          {
            name: "Powerful Melee",
            cost: "L/2",
            effect:
              "This Cog can spend 2 Actions to make a melee basic attack that deals Ld6 damage.",
            useCost: { actions: 2 },
          },
          {
            name: "Fast Melee",
            cost: "L/2",
            effect:
              "This Cog can spend 2 Actions to make {{L/4}} melee basic attacks that each deal 1d6+L damage.",
            useCost: { actions: 2 },
          },
          {
            name: "Powerful Ranged",
            cost: "L/2",
            effect:
              "This Cog can spend 2 Actions to make a ranged basic attack anywhere within line of sight that deals Ld6 - L damage.",
            useCost: { actions: 2 },
          },
          {
            name: "Fast Ranged",
            cost: "L/2",
            effect:
              "This Cog can spend 2 Actions to make {{L/3}} ranged basic attacks anywhere within line of sight that each deal 1d6 damage.",
            useCost: { actions: 2 },
          },
          {
            name: "Thousand Cuts",
            cost: "X",
            maxCost: "L",
            effect:
              "This Cog can spend 2 Actions to make X melee basic attacks (up to {{L}}) that each deal {{L/5}} damage.",
            useCost: { actions: 2 },
          },
        ],
      },
      {
        name: "Minor Abilities",
        options: [
          {
            name: "Heal",
            cost: "X",
            maxCost: "L",
            effect:
              "This Cog can spend 1 Action to heal itself or an adjacent ally for X HP, up to {{L}}.",
            useCost: { actions: 1 },
          },
          {
            name: "Alert",
            cost: "L/2",
            effect: "This Cog can spend 1 Action to gain {{L/5}} Alerts.",
            useCost: { actions: 1 },
          },
          {
            name: "Breach",
            cost: "L/2",
            effect:
              "This Cog can spend 1 Action to make a melee basic attack that removes {{L}} Armor on a direct hit.",
            useCost: { actions: 1 },
          },
          {
            name: "Secondary Melee",
            cost: "L/2",
            effect:
              "Once per turn, this Cog can spend 1 Action to make a melee basic attack that deals 1d6+L damage.",
            useCost: { actions: 1 },
          },
          {
            name: "Secondary Ranged",
            cost: "L/2",
            effect:
              "Once per turn, this Cog can spend 1 Action to make a ranged basic attack anywhere within line of sight that deals 1d6 + L/2 damage.",
            useCost: { actions: 1 },
          },
        ],
      },
      {
        name: "Traits",
        options: [
          {
            name: "Small",
            cost: "L/2",
            effect:
              "This Cog is considered {{L/4}} Levels lower for STR, HP, damage, and Speed but {{L/4}} levels higher for Vim, DEX, and AGI. They can move through hexes with hostile creatures and they gain {{L/5}} Alerts at the start of each turn.",
            creationEffect: {
              attrLevelAdjust: {
                str: "L - (L/4)",
                hp: "L - (L/4)",
                dmg: "L - (L/4)",
                speed: "L - (L/4)",
                vim: "L + (L/4)",
                dex: "L + (L/4)",
                agi: "L + (L/4)",
              },
            },
          },
          {
            name: "Large",
            cost: "L/2",
            effect:
              "This Cog is considered {{L/4}} Levels higher for STR, HP, damage, and Speed but {{L/4}} levels lower for Vim, DEX, and AGI. They take up 7 hexes (a 1-meter radius) and have a Reach of {{L/5}} meters.",
            creationEffect: {
              attrLevelAdjust: {
                str: "L + (L/4)",
                hp: "L + (L/4)",
                dmg: "L + (L/4)",
                speed: "L + (L/4)",
                vim: "L - (L/4)",
                dex: "L - (L/4)",
                agi: "L - (L/4)",
              },
            },
            uses: {
              adjust: {
                time: "permanent",
                attr: {
                  radius: 3,
                  reach: "L/5",
                },
              },
            },
          },
          {
            name: "Fast",
            cost: "X",
            maxCost: "L",
            effect: "This Cog gains X Speed, up to {{L}}.",
            uses: {
              adjust: {
                time: "permanent",
                attr: {
                  speed: "speed + X",
                },
              },
            },
          },
          {
            name: "Blocker",
            cost: "L/2",
            effect:
              "This Cog always Blocks (as Block (Beginner)) all attacks as a Free Reaction.",
            useCost: { reactions: 0 },
          },
          {
            name: "Dodger",
            cost: "L/2",
            effect:
              "This Cog gains {{L/4}} Dodges per Encounter. When attacked, if it has any Dodges remaining, it Dodges the attack (as Dodge (Beginner)) as a Free Reaction.",
            useCost: { reactions: 0 },
          },
          {
            name: "Perfect Shielding",
            cost: "L/2",
            effect:
              "When this Cog loses a quarter of its HP in a single Round, it becomes immune to further HP loss until the start of its next turn (after resolving any current actions).",
          },
        ],
      },
      {
        name: "Bonuses",
        options: [],
      },
      {
        name: "Attack Modifiers",
        options: [],
      },
    ],
  },
];

export const cogAbilityList = cogAbilityOptions.reduce<CogAbility[]>(
  (acc, path) => {
    const abilities = path.categories.reduce<CogAbility[]>((acc, category) => {
      return acc.concat(category.options);
    }, []);
    return acc.concat(abilities);
  },
  []
);

export const cogAbilityMap = cogAbilityList.reduce<Record<string, CogAbility>>(
  (acc, ability) => {
    acc[ability.name] = ability;
    return acc;
  },
  {}
);
