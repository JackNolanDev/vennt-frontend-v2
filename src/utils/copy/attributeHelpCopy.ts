import {
  type EntityAttribute,
  type HTMLString,
  getBaseAttr,
} from "vennt-library";

type HelpMap = {
  [attr in EntityAttribute]?: HTMLString;
};

const BASE_HELP_MAP: HelpMap = {
  hp: `Your default maximum Health (HP) is 20 + Level + 3 times Strength.
  <a href="https://vennt.fandom.com/wiki/Health" target="_blank" class="link">Wiki entry</a>.`,
  mp: `Your default maximum Mana (MP) is 6 + 3 times Wisdom.
  <a href="https://vennt.fandom.com/wiki/Mana" target="_blank" class="link">Wiki entry</a>.`,
  vim: `Your default maximum Vim is 20 + Level + Strength times Agility.
  Vim is used to mitigate incoming attacks and perform combat feats and abilities which use physical exertion..
  <a href="https://vennt.fandom.com/wiki/Vim" target="_blank" class="link">Wiki entry</a>`,
  hero: `Hero Points are reserves of luck that can be spent to create moments of shining excellence.
  <a href="https://vennt.fandom.com/wiki/Hero_Points" target="_blank" class="link">Wiki entry</a>.
  Note: Hero Points require that the
  <a href="https://vennt.fandom.com/wiki/Hero_Points" target="_blank" class="link">Course of Heroism</a>
  has been introduced.`,
  init: `Your default Initiative is your Agility + Dexterity.
  <a href="https://vennt.fandom.com/wiki/Initiative" target="_blank" class="link">Wiki entry</a>.`,
  speed: `Your default Speed is 3 + Agility minus any Burden from your Armor.
  <a href="https://vennt.fandom.com/wiki/Movement" target="_blank" class="link">Wiki entry</a>.`,
  armor: `Your Armor serves as damage reduction from blows dealt to you.
  <a href="https://vennt.fandom.com/wiki/Armor" target="_blank" class="link">Wiki entry</a>.`,
  xp: `Experience Points are the resource gained by player characters during play and spent on Abilities.
  Your character's level is your xp&nbsp;/&nbsp;1000.
  <a href="https://vennt.fandom.com/wiki/XP" target="_blank" class="link">Wiki entry</a>`,
  sp: `Silver Pieces are Amnis's main currency.
  <a href="https://vennt.fandom.com/wiki/Money" target="_blank" class="link">Wiki entry</a>`,
  L: `Level of the cog. See the
  <a href="https://vennt.fandom.com/wiki/Cogs#Level:_the_L_stat" target="_blank" class="link">Wiki entry</a>.`,
  acc: `Attacks are generally made by comparing the target's Accuracy to the target's Vim.
  <a href="https://vennt.fandom.com/wiki/Accuracy" target="_blank" class="link">Wiki entry</a>.`,
  radius: `The Radius of a cog refers to how many hexes outside of it's central hex the cog takes up`,
  reach: `Reach is the distance from which a creature can make melee attacks and manipulate objects.
  This defaults to 1 hex/meter for human-sized creatures.
  <a href="https://vennt.fandom.com/wiki/Reach" target="_blank" class="link">Wiki entry</a>.`,
  burden: `Certain pieces of heavy Armor are cumbersome. This is represented by Burden, which is subtracted from your casting rolls and Speed.
  <a href="https://vennt.fandom.com/wiki/Burden" target="_blank" class="link">Wiki entry</a>.`,
  shield: `Shields are like armor except you must have the ability "Shield Block" to use them.
  <a href="https://vennt.fandom.com/wiki/Armor#Shields" target="_blank" class="link">Wiki entry</a>.`,
  casting: `Used as the adjustment when doing spell casting roll. Note: this field acts as an adjustment on top of your spirit / burden.
  <a href="https://vennt.fandom.com/wiki/Casting_roll" target="_blank" class="link">Wiki entry</a>.`,
  recovery_shock: `<a href="https://vennt.fandom.com/wiki/Recovery_Shock" target="_blank" class="link">Wiki entry</a>.`,
  bluespace: `<a href="https://vennt.fandom.com/wiki/Bluespace" target="_blank" class="link">Wiki entry</a>.`,
  // name: "This character's name.",
  // gift: `<i>Most legends are born gifted in some way. Mozart was gifted in music, Achilles was gifted in combat,
  // and Merlin was gifted in magic. There are nine gifts available to choose from as a hero of Amnis, each one
  // providing unique boons to your character.</i><br><br>
  // At the start of Character Creation, each player chooses a Gift for their character.`,
  // TODO: write a webscraper to automatically pull these descriptions from the wiki when building the website
  per: `Your ability to understand the stimuli you are perceiving and notice fine detail. How far away can you see,
  how quickly can you pick out a person in a crowd, and do you notice someone pickpocketing you? This stat can be used
  for identifying people far away, noticing traps before they trigger, and avoiding attacks in combat.`,
  tek: `Your ability to make and use tools — the practical counterpart to INT. How quickly can you build a bomb,
  how much damage does that bomb do, and how far can you see through this extremely-complicated telescope? This stat
  can be used for creating weapons, using unfamiliar technologies, destroying technologies efficiently, and using
  technology-based weapons in combat.`,
  agi: `Your ability to respond and move yourself quickly. How quickly can you leap over a barricade, how far can you
  run in one minute, and how effectively can you swing from vines in a jungle? This stat can be used for gymnastic
  feats of all kinds, and dodging blows in combat.`,
  dex: `Your ability to respond and move quickly and precisely, with the action primarily focused on your hands.
  How long can you juggle for, how easy is it for you to pickpocket that guard, and how far can you shoot an arrow
  with perfect accuracy? This stat can be used for pickpocketing, attempting to catch thrown objects, disarming a foe,
  and attacking with a lighter or ranged weapon in combat.`,
  int: `Your ability to learn and retain information as well as the accumulation of knowledge you have gained
  in the past. The theoretical counterpart to Technology. How much do you know about the history of this world,
  how quickly can you calculate the trajectory that ballista is going to take, and how quickly can you memorize
  a list of important names? This stat can be used for researching, creating nonmagical tools, remembering vital
  information, and using technology-based attacks in combat.`,
  spi: `Your ability to wield, analyze, and control the arcane forces that permeate this world, as well as the
  endurance of your soul, your willpower, the strength of your heart. How large can you make this fireball,
  how long can you make a curse on a foe last, and how long does it take you to figure out what the runes on
  an enchanted sword mean? This stat can be used for identifying magical items, dispelling other people's enchantments,
  sensing magical residue left behind by magical creatures, and casting spells in combat.`,
  str: `Your ability to exert physical force on your environment, and endure physical force exerted onto you.
  How much can you move, how quickly, and how far? How long can you run for? This stat can be used for pushing,
  pulling, climbing, or attacking with a heavier weapon in combat`,
  wis: `Your common sense, mental fortitude, and ability to piece together abstract concepts and gain insight
  and understanding. How long does it take you to come up with a creative solution to something, how much
  street smarts do you have, and how intuitive do you find a task? This stat can be used for resisting psychic attacks,
  interpreting discoveries, medicine-related checks, and using alchemy-based attacks in combat.`,
  cha: `Your ability to get people to trust you, as well as your own status as a judge of character. How effectively
  can you talk down an angry foe, how quickly does it take you to get through layers of bureaucracy, and what's
  the minimum amount of money you need to bribe that guard with before he lets you go for pickpocketing him?
  This stat can be used for attempting to convince someone of a lie, attempting to see through a lie, seduction,
  and avoiding combat entirely.`,
};

export const attrHelpHTML = (attr: EntityAttribute): HTMLString | undefined => {
  const baseAttr = getBaseAttr(attr);
  const searchAttr = baseAttr ? baseAttr : attr;
  return BASE_HELP_MAP[searchAttr];
};
