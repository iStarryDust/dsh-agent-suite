//#region ../.build/client-ui-edit-regen/tsc/index.js
/**
* Host half of the edit-and-regenerate surface. The surface is a pure Client
* plugin (see `./client`); this entry exists so the package resolves as an
* ordinary workspace plugin and reserves the package name. The session-side
* verbs live in `@istarry/dsh-edit-regen`.
*
* It injects NOTHING. The browser's services (`slots`, `locale`, `sessions`,
* `workspaces`, `uiWorkspace`, `remote`) live on the Client plane; a Host row
* that declares them never resolves them and stays `pending` for the life of
* the process. The Plugins page reports the ROOT fiber's phase, so such a
* package reads "waiting for dependencies" while its browser entry — composed
* and activated separately in the page — works perfectly. The Host half needs
* no service: `apply` only reserves the identity.
* @module @istarry/dsh-client-ui-edit-regen
*/
/**
* Reserve the plugin identity on the Host.
* @param ctx - host context.
*/
function apply(ctx) {}
//#endregion
export { apply };
