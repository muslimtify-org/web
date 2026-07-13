# AI Usage Policy

This repository is the documentation website and blog for **Muslimtify** — a tool that real Muslims rely on to perform their daily prayers. The pages here teach people how to install it, configure their location and calculation method, and understand how prayer times are computed. Wrong or misleading documentation can lead someone to mis-configure the tool and pray at the wrong time. That is not an ordinary content defect — it touches an act of worship (`ibadah`). Because of this, we hold contributions to a higher standard than most documentation projects, and that includes how AI tools are used.

**Using AI to contribute to this project is discouraged.** It is not forbidden, but if you reach for an AI tool you are taking on extra responsibility, not less.

## What outside contributors may change

Outside contributions are limited to **content**:

- `blog/` — blog posts and announcements.
- `docs/` — user documentation.

Everything else — `src/` (custom pages, React components, CSS), `static/`, `docusaurus.config.ts`, `sidebars.ts`, `package.json`, `.github/`, and other configuration — is **maintainer-only**. If you want a change there, **open an issue, not a pull request.** See [CONTRIBUTING.md](CONTRIBUTING.md) for the full boundary.

## The Rules

These rules apply to outside contributions (issues, discussions, and pull requests). Maintainers may use AI tools at their discretion; they have proven they apply good judgment.

- **All AI usage must be disclosed.** State the tool you used (e.g. Claude Code, Cursor, Copilot, ChatGPT) and how much of the work was AI-assisted. Put this in the pull request or issue description.

- **You must fully understand every word and every command you submit.** If you cannot explain what your article or documentation change says, and *why it is correct* — without the AI in front of you — do not submit it. This is especially true for any instruction that touches installation, location setup, calculation methods, madhab/method selection, or the Muslimtify CLI. Every command you document must actually work as written.

- **You must review and fix the output.** AI produces plausible-looking prose and commands that are often subtly wrong: invented flags, outdated command names, links that 404, steps in the wrong order. It is your job to read it critically, test every command against the real tool, and fix the bad parts before submission. Submitting raw AI output and hoping a maintainer will catch the problems is not acceptable.

- **You take full responsibility for the content.** "The AI wrote it" is never an excuse. Once you open the PR, the work is yours. If it ships an instruction that makes someone mis-configure Muslimtify and miss a prayer, that is on you.

- **NEVER touch maintainer-only files** if you are not a maintainer (see the list above and in [CONTRIBUTING.md](CONTRIBUTING.md)). Working with these files as an outside contributor is forbidden. If you find a bug or want an improvement there, **open an issue — not a pull request** — with a human in the loop.

- **Issues and discussions may use AI, but a human must be in the loop.** Any AI-generated text must be reviewed *and edited* by a human before submission. AI tends to be verbose and noisy — trim it down to the actual point.

- **No AI-generated media.** Screenshots must be genuine captures of the real software. Diagrams must reflect how the tool actually behaves. Do not submit AI-generated images, illustrations, audio, or video. Text is the only AI-assisted content allowed, subject to the rules above.

## There Are Humans Here

Every issue, discussion, and pull request is read and reviewed by a human maintainer. It is disrespectful to hand a maintainer low-effort, unverified work and leave them to do the validation you should have done yourself. The burden of proof is on the contributor, not the reviewer.

## AI Is Not the Enemy

This policy is not anti-AI. AI is a legitimate tool and good writers use it well. The problem is not the tool — it is people who submit unverified AI output and treat the maintainers' time and the users' worship as cheap.

If you are early in your journey and want to learn, you are welcome here — but then do the work yourself, ask questions, and we will gladly help you grow. If you only want to forward AI output without understanding it, this is not the project for that.

We build this for the sake of helping Muslims pray on time. Please contribute with that same care.
