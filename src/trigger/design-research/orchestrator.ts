import { task } from "@trigger.dev/sdk";
import { agent1Research } from "./agent-1-research.js";
import { agent2Curator } from "./agent-2-curator.js";
import { agent3Output } from "./agent-3-output.js";
import type { ResearchInput } from "./types.js";

export const researchOrchestrator = task({
  id: "research-orchestrator",
  retry: { maxAttempts: 1 },
  run: async (input: ResearchInput) => {
    const required: (keyof ResearchInput)[] = ["niche", "clientGoals", "animationStyle", "brandServices", "clientName"];
    for (const field of required) {
      if (!input[field]?.trim()) {
        throw new Error(`${field} is required`);
      }
    }

    console.log(`Design Research Workflow — ${input.niche} / ${input.clientName}`);
    console.log(`Goals: ${input.clientGoals}`);

    const research = await agent1Research.triggerAndWait(input).unwrap();
    console.log("Agent 1 — Research complete");

    const curatedBrief = await agent2Curator.triggerAndWait({ input, research }).unwrap();
    console.log("Agent 2 — Curation complete");

    const output = await agent3Output.triggerAndWait({ input, curatedBrief }).unwrap();
    console.log("Agent 3 — PDF generated and emailed");

    return {
      niche: input.niche,
      clientName: input.clientName,
      pdfPath: output.pdfPath,
      emailStatus: output.emailStatus,
      status: "complete",
    };
  },
});
