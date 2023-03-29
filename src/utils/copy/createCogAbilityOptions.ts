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

/**
 * This specifies all of the options the user can make when choosing a cog's abilities.
 *
 * Effect formatting notes:
 * - Mustaches: {{ }}
 *   text withing mustache templates are equations which will be solved whenever the text is displayed.
 *   Both the equation and the result will be displayed.
 * - Square Brackets [[ ]]
 *   text within square brackets are equations which will be solved whenever the text is displayed.
 *   Only the result will be displayed. When the ability is added to the entity, these will be replaced with the final value.
 */
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
              "This Cog can spend 2 Actions to make [[X/2]] melee basic attacks (up to {{L}}) that each deal {{L/5}} damage.",
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
              "This Cog can spend 1 Action to heal itself or an adjacent ally for [[X]] HP, up to {{L}}.",
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
            name: "Tiny",
            cost: "L",
            effect:
              "This Cog is considered {{L/2}} Levels lower for STR, HP, damage, and Speed but {{L/2}} levels higher for Vim, DEX, and AGI. They can move through hexes with hostile creatures and they gain {{L/3}} Alerts at the start of each turn.",
            creationEffect: {
              attrLevelAdjust: {
                str: "L - (L/2)",
                hp: "L - (L/2)",
                dmg: "L - (L/2)",
                speed: "L - (L/2)",
                vim: "L + (L/2)",
                dex: "L + (L/2)",
                agi: "L + (L/2)",
              },
            },
          },
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
                  radius: 1,
                  reach: "reach + (L/5)",
                },
              },
            },
          },
          {
            name: "Huge",
            cost: "L",
            effect:
              "This Cog is considered {{L/2}} Levels higher for STR, HP, damage, and Speed but {{L/2}} levels lower for Vim, DEX, and AGI. They take up 7 hexes (a 1-meter radius) and have a Reach of {{L/3}} meters.",
            creationEffect: {
              attrLevelAdjust: {
                str: "L + (L/2)",
                hp: "L + (L/2)",
                dmg: "L + (L/2)",
                speed: "L + (L/2)",
                vim: "L - (L/2)",
                dex: "L - (L/2)",
                agi: "L - (L/2)",
              },
            },
            uses: {
              adjust: {
                time: "permanent",
                attr: {
                  radius: 1,
                  reach: "reach + (L/3)",
                },
              },
            },
          },
          {
            name: "Fast",
            cost: "X",
            maxCost: "L",
            effect: "This Cog gains [[X]] Speed, up to {{L}}.",
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
        options: [
          {
            name: "Harsh Opener",
            cost: "3*X",
            effect:
              "For the first X Rounds of an Encounter, this Cog gains 1 extra Action on each of its turns.",
          },
          {
            name: "Frenzy",
            cost: "X",
            maxCost: "L",
            effect:
              "When this Cog is below half HP, the first attack it deals each turn deals an additional +[[X]] damage, up to +{{L}}.",
          },
          {
            name: "Armor Protection",
            cost: "X",
            maxCost: "L",
            effect:
              "This Cog's Armor cannot be reduced below [[X]] or {{L}} (whichever is lower), although this ability does not itself grant any Armor.",
          },
          {
            name: "Great Initiative",
            cost: "X",
            maxCost: "L",
            effect: "This Cog gains +[[X]] Initiative, up to +{{L}}.",
            uses: {
              adjust: {
                time: "permanent",
                attr: {
                  init: "init + X",
                },
              },
            },
          },
          {
            name: "Volatile",
            cost: "L/2",
            effect:
              "When this Cog dies, they explode dealing {{L}} damage (with their base Accuracy) to all creatures in a radius of {{L/2}} (or smaller, set during Cog creation).",
          },
        ],
      },
      {
        name: "Attack Modifiers",
        options: [
          {
            name: "Push",
            cost: "X",
            maxCost: "L",
            effect:
              "When this Cog directly hits, it also moves the target [[X]] meters away (up to {{L}} meters).",
          },
          {
            name: "Exhaust",
            cost: "X",
            maxCost: "L",
            effect:
              "When this Cog directly hits, the target also loses [[X]] Vim, up to {{L}}.",
          },
          {
            name: "Drain",
            cost: "2*X",
            maxCost: "L/2",
            effect:
              "When this Cog directly hits, the target also loses [[X]] MP, up to {{L/2}}.",
          },
          {
            name: "Homing",
            cost: "L",
            effect: "This Cog's attacks cannot be Evaded.",
          },
          {
            name: "Piercing",
            cost: "X",
            effect: "This Cog's attacks ignore [[2*X]] Armor.",
          },
          {
            name: "Radial",
            cost: "L/2",
            effect:
              "This Cog's ranged attacks target a radius of {{L/4}} meters, or smaller if the Cog chooses.",
          },
          {
            name: "Line",
            cost: "L/2",
            effect:
              "This Cog's melee attacks target a line of {{L}} meters, or shorter if the Cog chooses.",
          },
        ],
      },
    ],
  },
  {
    section: "Course of Combat",
    categories: [
      {
        name: "Combat Defenses",
        options: [
          {
            name: "Perceptive",
            cost: 2,
            effect: "This Cog is never considered flanked.",
          },
          {
            name: "Cover Expert",
            cost: 3,
            effect:
              "This Cog applies 1 Alert against ranged attacks that hit this Cog through Cover.",
          },
          {
            name: "Patient",
            cost: 4,
            effect: "This Cog cannot be threatened.",
          },
          {
            name: "Perfect Senses",
            cost: 2,
            effect: "This Cog is immune to Accuracy debuffs.",
          },
          {
            name: "Tenacious",
            cost: 2,
            effect:
              "This Cog is cannot be knocked prone. When this Cog is forcibly moved, halve the distance of the effect (this ability stacks with similar effects).",
          },
          {
            name: "Thorns",
            cost: "X",
            effect:
              "Whenever this Cog is targeted by a melee attack from an adjacent attacker, the attacker takes an unavoidable [[X]] damage (up to {{L}}) before resolving the attack.",
          },
        ],
      },
      {
        name: "Combat Offenses",
        options: [
          {
            name: "Predator",
            cost: 3,
            effect:
              "This Cog always targets characters who are not Supported if one exists, and deals an additional 2d6 damage with damage-dealing abilities against targets who are not Supported.",
          },
          {
            name: "Reach",
            cost: "L/4",
            effect: "This Cog gains +{{L/4}} meters of Reach.",
            uses: {
              adjust: {
                time: "permanent",
                attr: {
                  reach: "reach + (L/4)",
                },
              },
            },
          },
          {
            name: "Surrounding",
            cost: "L/4",
            effect:
              "This Cog gains +{{5L}} Accuracy and +{{L}} damage on all attacks against targets they are flanking.",
          },
          {
            name: "Cuffer",
            cost: 3,
            effect:
              "On a direct hit that results in HP loss, this Cog's attacks also knock the target prone.",
          },
          {
            name: "Obscuring",
            cost: 3,
            effect:
              "On a direct hit, this Cog's attacks also apply the stacking debuff _Obscured_: -10 Accuracy.",
          },
          {
            name: "Merciless",
            cost: 3,
            effect: "This Cog deals double damage against prone targets.",
          },
          {
            name: "Intimidating",
            cost: 2,
            effect: "This Cog's attacks threaten the target.",
          },
          {
            name: "Threatening Aura",
            cost: "X",
            effect: "When an enemy to this Cog moves within [[X]] meters of this Cog, they become threatened. This Cog has {{2*X}} Armor against threatened enemies.",
          },
        ],
      },
      {
        name: "Buffs and Debuffs",
        options: [
          {
            name: "Empower",
            cost: 2,
            effect:
              "Once per turn, this Cog can spend 1 Action to give a stacking _Empowered_ buff to its allies within 12 meters (including itself): gain +{{L/4}} damage on all attacks.",
            useCost: {
              actions: 1,
            },
          },
          {
            name: "Haste",
            cost: 4,
            effect:
              "Once per turn, this Cog can spend 1 Action to grant an allied target within 12 meters +2 Actions on their next turn.",
            useCost: {
              actions: 1,
            },
          },
          {
            name: "Slow",
            cost: "L/2",
            effect:
              "This Cog can spend 2 Actions to give a stacking Slowed debuff of -{{L/4}} Speed to a hostile target within 12 meters if they fail a DL {{7+L}} Attribute check chosen by the Cog during creation.",
            useCost: {
              actions: 2,
            },
          },
          {
            name: "Charge",
            cost: 3,
            effect:
              "This Cog can spend 2 Actions to grant a _Charged_ buff on themself: their next attack deals double damage (then remove this buff).",
            useCost: {
              actions: 2,
            },
          },
          {
            name: "Weaken",
            cost: "L/2",
            effect:
              "This Cog can spend 2 Actions to give a stacking _Weakened_ debuff of -{{L/4}} damage on all attacks to a hostile target within 12 meters if they fail a DL {{7+L}} Attribute check chosen by the Cog during creation.",
            useCost: {
              actions: 2,
            },
          },
          {
            name: "Aim",
            cost: "L/2",
            effect:
              "This Cog can spend 1 Action to gain a stacking Aimed buff: their next attack has +{{5L}} Accuracy (then remove this buff).",
            useCost: {
              actions: 1,
            },
          },
        ],
      },
    ],
  },
  {
    section: "Course of Conditions",
    categories: [
      {
        name: "Type Upgrades",
        options: [
          {
            name: "Inherent Benefits",
            cost: 1,
            effect:
              "[NYI] Based on their Type, this Cog gains the following passive bonus: \n- Arcanae: cannot become stiff\n- Automata: cannot become sick" +
              "\n- Beast / Flora: considered +1 Level for Vim\n- Humanoid: considered +1 Level for MP\n- Monster: considered +1 Level for HP" + 
              "\n- Undead: cannot become sick",
          },
          {
            name: "Power Shift",
            cost: "{{L/4}}",
            effect:
              "[NYI] Based on their Type, this Cog gains the following stat modifiers: \n- Arcanae: +{{L}} MP, -{{5*L}} Vim\n- Automata: +{{2*L}} Initiative, -{{L/2}} Speed" +
              "\n- Beast / Flora: +{{5*L}} Vim, -{{L}} MP\n- Humanoid: +{{5*L}} Accuracy, -{{2*L}} HP\n- Monster: +{{L}} Speed, -{{2*L}} Initiative" + 
              "\n- Undead: +{{L/2}} damage on all attacks, halved Accuracy",
          }
        ],
      },
      {
        name: "Condition Defenses",
        options: [
          {
            name: "Startled Prey",
            cost: "{{L/2}}",
            effect:
              "When this Cog rolls Initiative, it loses half of its HP and Vim and gains twice as much as temporary HP and Vim.",
          },
          {
            name: "Enduring",
            cost: 2,
            effect:
              "This Cog cannot be fatigued.",
          },
          {
            name: "Sturdy",
            cost: 2,
            effect:
              "This Cog cannot be staggered. When this Cog is forcibly moved, halve the distance of the effect (this ability stacks with similar effects).",
          }
        ],
      },
      {
        name: "Condition Offenses",
        options: [
          {
            name: "Staggering",
            cost: 4,
            effect:
              "On a direct hit that results in HP loss, this Cog's attacks also stagger the target.",
          },
          {
            name: "Sickening",
            cost: 4,
            effect:
              "On a direct hit, this Cog's attacks also cause a sick debuff.",
          },
          {
            name: "Stiffening",
            cost: 4,
            effect:
              "On a direct hit, this Cog's attacks also cause a stiff debuff.",
          },
          {
            name: "Tiring",
            cost: 4,
            effect:
              "Once per Round, when this Cog directly hits a target, the target must succeed a Strength check DL {{3+L}} or become fatigued.",
          },
        ],
      },
      {
        name: "Conditional Stats",
        options: [
          {
            name: "Modified HP",
            cost: "[[X]]",
            effect:
              "This Cog gains +[[5*X]] max HP. X may be between {{-L/2}} and {{L/4}}.",
            uses: {
              adjust: {
                time: "permanent",
                attr: {
                  max_hp: "max_hp + 5*X",
                },
              },
            },
          },
          {
            name: "Modified Accuracy",
            cost: "[[X]]",
            effect:
              "This Cog gains +[[5*X]] Accuracy. X may be between {{-L/4}} and {{L/2}}.",
            uses: {
              adjust: {
                time: "permanent",
                attr: {
                  acc: "acc + 5*X",
                },
              },
            },
          },
          {
            name: "Modified Vim",
            cost: "[[X]]",
            effect:
              "This Cog gains +[[5*X]] Vim. X may be between {{-L/4}} and {{L/2}}.",
            uses: {
              adjust: {
                time: "permanent",
                attr: {
                  max_vim: "max_vim + 5*X",
                },
              },
            },
          },
          {
            name: "Modified Speed",
            cost: "[[X]]",
            effect:
              "This Cog gains +[[X]] Speed. X may be between {{-L/4}} and {{L/4}}.",
            uses: {
              adjust: {
                time: "permanent",
                attr: {
                  speed: "speed + X",
                },
              },
            },
          }
        ],
      },
    ],
  },
  {
    section: "Course of Damages",
    categories: [
      {
        name: "Damage Offenses",
        options: [
          {
            name: "Bleeding",
            cost: "{{L/2}}",
            effect:
              "This Cog's attacks also deal {{L/2}} bleed damage with impact.",
          },
          {
            name: "Burning",
            cost: "{{L/2}}",
            effect:
              "This Cog's attacks also deal {{L/2}} burn damage with impact.",
          },
          {
            name: "Stunning",
            cost: 4,
            effect:
              "This Cog's attacks also deal 2 stun damage with impact.",
          },
          {
            name: "Paralyzing",
            cost: 4,
            effect:
              "This Cog's attacks also deal 2 paralysis damage with impact.",
          },
          {
            name: "Taxing",
            cost: "{{L/2}}",
            effect:
              "This Cog's attacks also deal {{L}} Vim damage with impact.",
          },
          {
            name: "Attribute Drain",
            cost: "{{L/2}}",
            effect:
              "[Attribute selection NYI] When this Cog directly hits a target, the target must succeed an Attribute check chosen during Cog creation of DL {{7+L}} or take 1 Attribute damage of an Attribute chosen during Cog creation. The Attributes for the check and damage may be the same or different Attributes.",
          },
        ],
      },
      {
        name: "Resistances",
        options: [],
      },
      {
        name: "Vulnerabilities",
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
