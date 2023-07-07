import { useJsonStore } from "@/stores/jsonStorage";
import Graph from "graph-data-structure";
import type {
  PathsAndAbilities,
  UncompleteEntityAbility,
} from "./backendTypes";
import { stringToLinkID } from "./textUtils";

export const buildPathGraph = (abilities: PathsAndAbilities) => {
  const filteredPaths = abilities.paths.filter((path) =>
    abilities.abilities.some(
      (ability) => ability.custom_fields?.path === path.name
    )
  );
  const validPaths = new Set(filteredPaths.map((path) => path.name));

  const graph = Graph();
  filteredPaths.forEach((path) => {
    graph.addNode(path.name);
  });
  filteredPaths.forEach((path) => {
    const parents = path.reqs
      ?.match(/(?!\()[\w ]+(?=\))/gimu)
      ?.map((parent) => `Path of the ${parent}`)
      .filter((parent) => validPaths.has(parent));
    const dedupedParents = new Set(parents);
    dedupedParents.forEach((parent) => {
      graph.addEdge(parent, path.name);
    });
  });
  return graph;
};

export const sortWikiPaths = (nodes: string[]) => {
  const jsonStorage = useJsonStore();
  return nodes.sort((nodeA, nodeB) => {
    const childrenA = jsonStorage.pathGraph.outdegree(nodeA) > 0;
    const childrenB = jsonStorage.pathGraph.outdegree(nodeB) > 0;
    if (childrenA && !childrenB) {
      return -1;
    } else if (!childrenA && childrenB) {
      return 1;
    }
    return nodeA.localeCompare(nodeB);
  });
};

export const buildAbilityMap = (abilities: PathsAndAbilities) => {
  return abilities.abilities.reduce<Record<string, UncompleteEntityAbility>>(
    (acc, ability) => {
      acc[ability.name] = ability;
      return acc;
    },
    {}
  );
};

// TODO: New concept: Return list of objects that tell vue component what to do.
// strings go for regular html text.
// objects contain details of what should be converted into <RouterLink>s (e.g. text content / route info)
// could also use this to pass along any special styling or something
export const addWikiLinks = (text: string): string => {
  return text.replaceAll(
    /([A-Z][a-zA-Z ]+) \(([a-zA-z ]+)\)/gm,
    (match, ability, path) => {
      if (
        !ability ||
        typeof ability !== "string" ||
        !path ||
        typeof path !== "string"
      ) {
        return match;
      }
      return `[${match}](/wiki/paths/${stringToLinkID(
        `Path of the ${path}`
      )}#${stringToLinkID(ability)})`;
    }
  );
};
