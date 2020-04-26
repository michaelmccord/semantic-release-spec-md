/**
 * Signale logger
 * @external Signale
 * @see {@link https://github.com/klaussinani/signale}
 */
const {Signale} = require('signale');
const figures = require('figures');

/** @module */

/**
 * Returns a {@link external:Signale} logger
 * @param {Object} context Provides the {@link external:Signale} logger with the stdout and stderr streams
 * @param {Stream} context.stdout The stdout stream
 * @param {Stream} context.stderr The stderr stream
 * @param {String} scope Provides a scope string to the {@link external:Signale} logger
 * @returns {external:Signale}
 */
module.exports = ({stdout, stderr}, scope) =>
  new Signale({
    config: {displayTimestamp: true, underlineMessage: false, displayLabel: false},
    disabled: false,
    interactive: false,
    scope: scope ? `semantic-release-spec-md:${scope}` : 'semantic-release-spec-md',
    stream: [stdout],
    types: {
      error: {badge: figures.cross, color: 'red', label: '', stream: [stderr]},
      log: {badge: figures.info, color: 'magenta', label: '', stream: [stdout]},
      success: {badge: figures.tick, color: 'green', label: '', stream: [stdout]},
    },
  });
