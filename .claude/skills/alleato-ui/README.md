# @alleato/ui Skills for Claude Code

These skill files teach Claude Code how to use the `@alleato/ui` Web Component library — component APIs, theming, and usage patterns.

## Installing in a consumer project

Copy this directory into your project's `.claude/skills/` folder:

```bash
# From your project root
mkdir -p .claude/skills
cp -r /path/to/alleato-ui/.claude/skills/alleato-ui .claude/skills/
```

Or if using the GitHub repo:

```bash
mkdir -p .claude/skills/alleato-ui
curl -sL https://raw.githubusercontent.com/alleato-llc/alleato-ui/main/.claude/skills/alleato-ui/SKILL.md -o .claude/skills/alleato-ui/SKILL.md
curl -sL https://raw.githubusercontent.com/alleato-llc/alleato-ui/main/.claude/skills/alleato-ui/api-reference.md -o .claude/skills/alleato-ui/api-reference.md
curl -sL https://raw.githubusercontent.com/alleato-llc/alleato-ui/main/.claude/skills/alleato-ui/examples.md -o .claude/skills/alleato-ui/examples.md
```

## Files

| File | Purpose |
|------|---------|
| `SKILL.md` | Skill declaration (triggers, setup instructions) |
| `api-reference.md` | All components: attributes, properties, events, slots, CSS tokens |
| `examples.md` | Working usage patterns per component |

## How it works

Claude Code loads skills from `.claude/skills/` in the current working directory. When a conversation matches the skill's trigger conditions (e.g., importing from `@alleato/ui`, asking about alleato components), Claude Code uses these files as context for accurate answers.
