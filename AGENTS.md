# AGENTS.md - Jastrow Dictionary Search Project

## Project Overview

**Jastrow Dictionary Search** is a web application that provides a searchable interface for the Jastrow Talmud Dictionary using the Sefaria API. The Jastrow Dictionary is a comprehensive Aramaic/Hebrew lexicon used for Talmudic and rabbinic text study.

## Technology Stack

- **Runtime & Package Manager**: [Bun](https://bun.com) - NOT npm/yarn/pnpm. Always use `bun install`, `bun run`, etc.
- **Frontend Framework**: React 19
- **Language**: TypeScript with strict mode
- **Linting/Formatting**: [Biome](https://biomejs.dev/) - Use `bun biome` for linting and formatting
- **Build Tool**: Bun's built-in bundler

## Essential Commands

```bash
# Install dependencies (use Bun, not npm!)
bun install

# Start development server with hot reload
bun dev

# Build for production
bun build

# Run production server
bun start

# Lint and format code
bun biome check .
bun biome check --write .
```

## Key Development Notes

### Use Bun, Not npm
This project uses **Bun** as its runtime and package manager. Do not use `npm`, `yarn`, or `pnpm` commands. Always use `bun` equivalents:
- ✅ `bun install` (not `npm install`)
- ✅ `bun add <package>` (not `npm install <package>`)
- ✅ `bun remove <package>` (not `npm uninstall <package>`)
- ✅ `bun run <script>` or just `bun <script>`

### Use Biome for Linting
This project uses **Biome** for linting and formatting instead of ESLint/Prettier. Run `bun biome check .` to lint and `bun biome check --write .` to auto-fix issues.

### TypeScript Configuration
- Strict mode enabled
- Module resolution: `bundler` mode (Bun-specific)
- Path alias: `@/*` maps to `./src/*`
- No emit mode (Bun handles transpilation)

## Sefaria API Integration

The project integrates with Sefaria's open API to access Jastrow Dictionary data.

### API Endpoints
- Base URL: `https://www.sefaria.org/api/`
- Jastrow text: `v3/texts/Jastrow,{entry_name}`
- Search: `search-wrapper` endpoint
- No authentication required
- Free to use with reasonable rate limiting

### Example Usage
```typescript
// Search for a dictionary entry
const response = await fetch(
  `https://www.sefaria.org/api/v3/texts/Jastrow,${term}`
);
const data = await response.json();
```

## Project Structure Basics

```
JastrowSearch/
├── src/
│   ├── Components/     # React components
│   ├── App.tsx         # Main app component
│   ├── index.tsx       # Server entry (Bun serve)
│   ├── frontend.tsx    # Frontend entry
│   └── index.html      # HTML template
├── package.json
├── tsconfig.json
├── bunfig.toml         # Bun configuration
└── biome.json          # Biome configuration
```

## Resources

- **Sefaria API Docs**: https://github.com/Sefaria/Sefaria-Project/wiki/API-Documentation
- **Jastrow on Sefaria**: https://www.sefaria.org/Jastrow
- **Bun Documentation**: https://bun.sh/docs
- **Biome Documentation**: https://biomejs.dev/

## Notes for AI Agents

1. **Always use Bun** - This is critical. Never suggest npm/yarn/pnpm commands
2. **Use Biome** - For code quality checks, not ESLint or Prettier
3. **React 19** - Use modern React patterns (hooks, no class components)
4. **TypeScript strict mode** - All code must be properly typed
5. **Sefaria API is open** - No API keys needed, but respect rate limits
6. **Hebrew/Aramaic text** - Be mindful of RTL text rendering needs

---

**Note**: Project structure, conventions, and specific implementation details may change rapidly. Focus on using the correct tooling (Bun + Biome) and integrating with the Sefaria API correctly.