import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { tasks } from "@trigger.dev/sdk/v3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/init-research", async (req, res) => {
  try {
    const { niche, clientName, clientGoals, animationStyle, brandServices } = req.body;

    const missing: string[] = [];
    if (!niche?.trim()) missing.push("niche");
    if (!clientName?.trim()) missing.push("clientName");
    if (!clientGoals?.trim()) missing.push("clientGoals");
    if (!animationStyle?.trim()) missing.push("animationStyle");
    if (!brandServices?.trim()) missing.push("brandServices");
    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing fields: ${missing.join(", ")}` });
    }

    const handle = await tasks.trigger("research-orchestrator", {
      niche: niche.trim(),
      clientName: clientName.trim(),
      clientGoals: clientGoals.trim(),
      animationStyle: animationStyle.trim(),
      brandServices: brandServices.trim(),
    });

    res.json({
      runId: handle.id,
      status: "triggered",
      message: `Research started for ${niche} — ${clientName}. Check your email for the PDF.`,
    });
  } catch (err) {
    console.error("Trigger failed:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to trigger research",
    });
  }
});

app.get("/status/:runId", async (req, res) => {
  res.json({ runId: req.params.runId, note: "Check Trigger.dev dashboard for detailed status" });
});

app.listen(PORT, () => {
  console.log(`Design Research Server running at http://localhost:${PORT}`);
  console.log(`Submit research at POST http://localhost:${PORT}/init-research`);
});
