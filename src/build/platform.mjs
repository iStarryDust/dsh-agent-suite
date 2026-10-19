/**
 * The module-table specifiers the web shell seeds before any plugin loads
 * (mirror of the harness's `packages/client/web/src/platform.ts`). A client
 * bundle may only `require()` these — everything else it needs must be inlined,
 * because a require the table cannot answer throws when the factory runs.
 *
 * `build.mjs` validates every emitted client bundle against this list.
 */
export const PLATFORM_MODULES = [
  'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client', '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-store',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-ui-primitives',
  '@deepseek-ai/dsh-client-ui-dockkit',
]
