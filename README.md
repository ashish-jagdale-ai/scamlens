# ScamLens

Scam-awareness app using deterministic warning signals and an optional server-side Ollama explanation. The rule-based analysis works without any AI provider, including on a public deployment.

## Run

```powershell
npm.cmd install
npm.cmd run server
```

In a second terminal: `npm.cmd run dev` and open http://localhost:5173. If Ollama is unavailable, rule analysis and fixed safety guidance still work.

ScamLens does not prove that a message is a scam. Never paste passwords, OTPs, card details, or other sensitive information. Verify independently through official channels.
