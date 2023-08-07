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
        activation: "Passive",
        cost: { passive: true },
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
        activation: "Passive",
        cost: { passive: true },
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
          attr: { max_mp: 9 },
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
          attr: { casting: 1 },
        },
        check: {
          attr: "casting",
          bonus: "+1",
          label: "At full HP",
        },
      },
    },
  },
  "Projected Spirit": {
    gift: "Magic",
    ability: {
      name: "Boon: Projected Spirit",
      effect:
        "Whenever you use a single-target ability, you may spend X Vim (at least 5) to extend its effective range by up to X meters. This includes spells and attacks that normally require adjacency or touching the target.",
      active: false,
      custom_fields: {
        path: "Gift of Magic Boon",
        activation: "Passive",
        cost: { passive: true },
      },
    },
  },
  Meaty: {
    gift: "Rage",
    ability: {
      name: "Boon: Meaty",
      effect:
        "Gain 20 max HP. Whenever you Rest, gain 9 HP. Whenever you wear Armor, increase its Burden by 2.",
      active: false,
      custom_fields: {
        path: "Gift of Rage Boon",
        activation: "Passive",
        cost: { passive: true },
      },
      uses: {
        adjust: {
          time: "permanent",
          attr: {
            max_hp: 20,
          },
        },
      },
    },
  },
  "B4ST-RD": {
    gift: "Rage",
    ability: {
      name: "Boon: B4ST-RD",
      effect:
        "You gain a B4ST-RD Sword. This enormous steam-powered weapon requires either this boon or 9 Strength to wield. This weapon uses Strength as its weapon attribute and deals 5d6 damage. When you declare an Attack with this weapon, the attack hits everything in a 2-hex line and consumes all of your remaining Reactions. You may spend 3 Actions to make a special skill strike with this weapon that hits every hex within a 2 meter radius and consumes all of your remaining Reactions. If you lose your B4ST-RD Sword, another one may be purchased for 300 sp.",
      active: false,
      custom_fields: {
        path: "Gift of Rage Boon",
        activation: "Passive",
        cost: { passive: true },
      },
    },
  },
  "Exceptional Strength": {
    gift: "Rage",
    ability: {
      name: "Boon: Exceptional Strength",
      effect:
        "Once per Rest, you may automatically succeed an STR check up to DL {{11 + (2*str)}} instead of rolling. Additionally, gain +10 XP whenever you purchase an ability Expedited for your Gift.",
      active: false,
      custom_fields: {
        path: "Gift of Rage Boon",
        activation: "Passive",
        cost: { passive: true },
      },
    },
  },
  "Inquisitive Experimentation": {
    gift: "Science",
    ability: {
      name: "Boon: Inquisitive Experimentation",
      effect:
        "Whenever you would roll 3d6, you may instead roll 4d6-2 or 2d6+4.",
      active: false,
      custom_fields: {
        path: "Gift of Science Boon",
        activation: "Passive",
        cost: { passive: true },
      },
    },
  },
  "Astute Observation": {
    gift: "Science",
    ability: {
      name: "Boon: Astute Observation",
      effect:
        "Whenever you make a roll of any kind (e.g. a check, damage with a certain weapon, or casting a particular spell), you may record the dice result. On your next roll of the same kind, you may choose to use your recorded result instead of rolling and recording a new result. Regardless of whether you use your recorded result, the recorded result is then discarded and unable to be used again. Recorded results using **Astute Observation** never expire, but when using a recorded result, you should narratively recount where you are remembering it from.",
      active: false,
      custom_fields: {
        path: "Gift of Science Boon",
        activation: "Passive",
        cost: { passive: true },
      },
    },
  },
  "Exceptional Wisdom": {
    gift: "Science",
    ability: {
      name: "Boon: Exceptional Wisdom",
      effect:
        "Once per Rest, you may automatically succeed an WIS check up to DL {{11 + (2*wis)}} instead of rolling. Additionally, gain +10 XP whenever you purchase an ability Expedited for your Gift.",
      active: false,
      custom_fields: {
        path: "Gift of Science Boon",
        activation: "Passive",
        cost: { passive: true },
      },
    },
  },
  "Helpful Heart": {
    gift: "Charm",
    ability: {
      name: "Boon: Helpful Heart",
      effect:
        "Whenever you Assist, gain +6 to your roll to Assist. If you succeed, your Assistance provides +6 instead of +3.",
      active: false,
      custom_fields: {
        path: "Gift of Charm Boon",
        activation: "Passive",
        cost: { passive: true },
      },
    },
  },
  Tycoon: {
    gift: "Charm",
    ability: {
      name: "Boon: Tycoon",
      effect:
        "Whenever you complete a Quest, gain 12d6 SP per Act in the Quest.",
      active: false,
      custom_fields: {
        path: "Gift of Charm Boon",
        activation: "Passive",
        cost: { passive: true },
      },
      uses: {
        roll: { dice: "12d6", attr: "sp" },
      },
    },
  },
  "Exceptional Charisma": {
    gift: "Charm",
    ability: {
      name: "Boon: Exceptional Charisma",
      effect:
        "Once per Rest, you may automatically succeed an CHA check up to DL {{11 + (2*cha)}} instead of rolling. Additionally, gain +10 XP whenever you purchase an ability Expedited for your Gift.",
      active: false,
      custom_fields: {
        path: "Gift of Charm Boon",
        activation: "Passive",
        cost: { passive: true },
      },
    },
  },
  Generalist: {
    gift: "None",
    ability: {
      name: "Boon: Generalist",
      effect: "All abilities cost 100 XP less (min. 50 XP)",
      active: false,
      custom_fields: {
        path: "Normality Boon",
        activation: "Passive",
        cost: { passive: true },
      },
      uses: {
        adjust_ability_cost: {
          adjust_cost: -100,
        },
      },
    },
  },
  Underdog: {
    gift: "None",
    ability: {
      name: "Boon: Underdog",
      effect:
        "Whenever you deal damage to named characters, deal an extra +3 per d6, up to +12.",
      active: false,
      custom_fields: {
        path: "Normality Boon",
        activation: "Passive",
        cost: { passive: true },
      },
    },
  },
  Hardcore: {
    gift: "None",
    ability: {
      name: "Boon: Hardcore",
      effect:
        "You cannot purchase abilities in the Path of the Colorful. You are either very mundane or trying to prove something.",
      active: false,
      custom_fields: {
        path: "Normality Boon",
        activation: "Passive",
        cost: { passive: true },
      },
    },
  },
};
