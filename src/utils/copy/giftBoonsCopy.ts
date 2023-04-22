import type { CharacterGift, EntityAbility } from "../backendTypes";

type GiftBoonCopy = Record<
  string,
  { gift: CharacterGift; ability: EntityAbility }
>;

export const giftBoonCopy: GiftBoonCopy = {
  "Sense Reflexes": {
    gift: "Alertness",
    ability: {
      name: "Boon: Sense Reflexes",
      effect:
        "Your Vim is doubled for the purpose determining if an attack is a glancing blow.",
      active: false,
      custom_fields: {
        path: "Gift of Alertness Boon",
        activation: "Passive",
        cost: { passive: true },
      },
    },
  },
  "Perfect Aim": {
    gift: "Alertness",
    ability: {
      name: "Boon: Perfect Aim",
      effect: "Gain +20 Accuracy on all attacks.",
      active: false,
      custom_fields: {
        path: "Gift of Alertness Boon",
        activation: "Passive",
        cost: { passive: true },
      },
      uses: {
        adjust: {
          time: "permanent",
          attr: {
            acc: 20,
          },
        },
      },
    },
  },
  "Exceptional Perception": {
    gift: "Alertness",
    ability: {
      name: "Boon: Exceptional Perception",
      effect:
        "Once per Rest, you may automatically succeed a PER check up to DL {{11 + (2 * per)}} instead of rolling. Additionally, gain +10 XP whenever you purchase an ability Expedited for your Gift.",
      active: false,
      custom_fields: {
        path: "Gift of Alertness Boon",
        activation: "Passive",
        cost: { passive: true },
      },
    },
  },
  Workshopper: {
    gift: "Craft",
    ability: {
      name: "Boon: Workshopper",
      effect:
        "Once per Rest, add any Equipment to your inventory. It breaks permanently at the next Rest.",
      active: false,
      custom_fields: {
        path: "Gift of Craft Boon",
        activation: "Rest",
        cost: { rest: true },
      },
    },
  },
  "Automaton Pet": {
    gift: "Craft",
    ability: {
      name: "Boon: Automaton Pet",
      effect:
        "You have a machine companion. It functions as a trained animal of your choice using your {{tek}} for any checks it makes. The automaton is not useful in Tactical Scenes and can be repaired during a Rest if injured.",
      active: false,
      custom_fields: {
        path: "Gift of Craft Boon",
        activation: "Passive",
        cost: { passive: true },
      },
    },
  },
  "Exceptional Technology": {
    gift: "Craft",
    ability: {
      name: "Boon: Exceptional Technology",
      effect:
        "Once per Rest, you may automatically succeed a TEK check up to DL {{11 + (2 * tek)}} instead of rolling. Additionally, gain +10 XP whenever you purchase an ability Expedited for your Gift.",
      active: false,
      custom_fields: {
        path: "Gift of Craft Boon",
        activation: "Rest",
        cost: { rest: true },
      },
    },
  },
  "Ultimate Endurance": {
    gift: "Alacrity",
    ability: {
      name: "Boon: Ultimate Endurance",
      effect: "Gain 15 maximum Vim.",
      active: false,
      custom_fields: {
        path: "Gift of Alacrity Boon",
        activation: "Passive",
        cost: { passive: true },
      },
      uses: {
        adjust: {
          time: "permanent",
          attr: {
            max_vim: 15,
          },
        },
      },
    },
  },
  "Expert Evasion": {
    gift: "Alacrity",
    ability: {
      name: "Boon: Expert Evasion",
      effect: "Dodge (Beginner) costs 2 Vim fewer for you (min. 0).",
      active: false,
      custom_fields: {
        path: "Gift of Alacrity Boon",
        activation: "Passive",
        cost: { passive: true },
      },
    },
  },
  "Exceptionally Swift": {
    gift: "Alacrity",
    ability: {
      name: "Boon: Exceptionally Swift",
      effect: "Gain 4 Speed. Once per turn, you may Move as a Free Action.",
      active: false,
      custom_fields: {
        path: "Gift of Alacrity Boon",
        activation: "Passive",
        cost: { passive: true },
      },
      uses: {
        adjust: {
          time: "permanent",
          attr: {
            speed: 4,
          },
        },
      },
    },
  },
  "Perfect Strike": {
    gift: "Finesse",
    ability: {
      name: "Boon: Perfect Strike",
      effect:
        "Once per Encounter, this ability can be used to modify an attack: the attack cannot be evaded and, instead of rolling for damage, deals the maximum amount possible.",
      active: false,
      custom_fields: {
        path: "Gift of Finesse Boon",
        activation: "Attack",
        cost: { attack: true },
      },
    },
  },
  "Lightning Strikes": {
    gift: "Finesse",
    ability: {
      name: "Boon: Lightning Strikes",
      effect:
        "{{dex}} times per Encounter, you may reduce the cost of an Attack by 1 Action.",
      active: false,
      custom_fields: {
        path: "Gift of Finesse Boon",
        activation: "Attack",
        cost: { attack: true },
      },
    },
  },
  "Exceptional Dexterity": {
    gift: "Finesse",
    ability: {
      name: "Boon: Exceptional Dexterity",
      effect: "Dodge (Beginner) costs 2 Vim fewer for you (min. 0).",
      active: false,
      custom_fields: {
        path: "Gift of Finesse Boon",
        activation: "Passive",
        cost: { passive: true },
      },
    },
  },
  "Book of Minor Arcana": {
    gift: "Mind",
    ability: {
      name: "Boon: Book of Minor Arcana",
      effect:
        "You immediately gain Spell Training (Magician). You can attempt to cast any spell in Paths you have unlocked so long as the Casting DL is 11 or less.",
      active: false,
      custom_fields: {
        path: "Gift of Mind Boon",
        activation: "Passive",
        cost: { passive: true },
      },
      uses: {
        criteria_benefits: [
          {
            criteria: {
              type: "comp",
              left: {
                type: "ability_field",
                path: ["name"],
              },
              right: {
                type: "const",
                const: "Spell Training",
              },
              operator: "equals",
            },
            adjust_ability_cost: {
              adjust_cost: "0",
            },
          },
        ],
      },
    },
  },
  "Adaptive Learning": {
    gift: "Mind",
    ability: {
      name: "Boon: Adaptive Learning",
      effect:
        "Whenever you are directly hit by an enemy, evade the next attack from that enemy as a Free Reaction. Whenever your attack results in a glancing blow, gain +10 Accuracy to your next attack against that target.",
      active: false,
      custom_fields: {
        path: "Gift of Mind Boon",
        activation: "Passive",
        cost: { passive: true },
      },
    },
  },
  "Exceptional Intelligence": {
    gift: "Mind",
    ability: {
      name: "Boon: Exceptional Intelligence",
      effect:
        "Once per Rest, you may automatically succeed an INT check up to DL {{11 + (2*int)}} instead of rolling. Additionally, gain +10 XP whenever you purchase an ability Expedited for your Gift.",
      active: false,
      custom_fields: {
        path: "Gift of Mind Boon",
        activation: "Passive",
        cost: { passive: true },
      },
    },
  },
  Manaful: {
    gift: "Magic",
    ability: {
      name: "Boon: Manaful",
      effect: "Gain 9 max MP. Whenever you Rest, gain 6 MP.",
      active: false,
      custom_fields: {
        path: "Gift of Magic Boon",
        activation: "Passive",
        cost: { passive: true },
      },
      uses: {
        adjust: {
          time: "permanent",
          attr: {
            max_mp: 9,
          },
        },
      },
    },
  },
  "Perfect Cast": {
    gift: "Magic",
    ability: {
      name: "Boon: Perfect Cast",
      effect: "Gain +1 to all casting rolls, or +2 when you are at full HP.",
      active: false,
      custom_fields: {
        path: "Gift of Magic Boon",
        activation: "Passive",
        cost: { passive: true },
      },
      uses: {
        adjust: {
          time: "permanent",
          attr: {
            casting: 1,
          },
        },
      },
    },
  },
  "Projected Spirit": {
    gift: "Magic",
    ability: {
      name: "Boon: Projected Spirit",
      effect:
        "Once per Rest, you may automatically succeed an INT check up to DL {{11 + (2*int)}} instead of rolling. Additionally, gain +10 XP whenever you purchase an ability Expedited for your Gift.",
      active: false,
      custom_fields: {
        path: "Gift of Magic Boon",
        activation: "Passive",
        cost: { passive: true },
      },
    },
  },
};
