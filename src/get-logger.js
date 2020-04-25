const {Signale} = require('signale');
const figures = require('figures');

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
