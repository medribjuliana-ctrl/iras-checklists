/**
 * Calcula a adesão ao bundle com base nas respostas e regras do schema.
 *
 * Regras suportadas:
 * - all_must_pass: cada check define field + equals/allEqual/includes
 * - all_yes: todos os fields listados devem ter valor "SIM"
 * - all_c_or_na: todos os fields devem ser "C" ou "NA"
 */

type AdherenceRules = {
  type: "all_must_pass" | "all_yes" | "all_c_or_na";
  checks?: Array<{
    field: string;
    equals?: string;
    allEqual?: string;
    includes?: string;
  }>;
  fields?: string[];
};

export function calculateAdherence(
  responses: Record<string, any>,
  rules: AdherenceRules
): boolean {
  switch (rules.type) {
    case "all_must_pass":
      return (rules.checks ?? []).every((check) => {
        const val = responses[check.field];
        if (check.equals) return val === check.equals;
        if (check.allEqual) {
          // Para grupos (ex: EPIs), val é um objeto {item: value}
          if (typeof val === "object" && val !== null) {
            return Object.values(val).every((v) => v === check.allEqual);
          }
          return val === check.allEqual;
        }
        return true;
      });

    case "all_yes":
      return (rules.fields ?? []).every(
        (f) => responses[f] === "SIM"
      );

    case "all_c_or_na":
      return (rules.fields ?? []).every(
        (f) => responses[f] === "C" || responses[f] === "NA"
      );

    default:
      return false;
  }
}
