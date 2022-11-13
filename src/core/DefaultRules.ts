import RulesMethods from "./Rules/Rules.Methods";
import RulesRegexp from "./Rules/Rules.Regexp";

export const DefaultRules = Object.create({
    ...RulesMethods,
    ...RulesRegexp
});
