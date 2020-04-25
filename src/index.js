const debug = require('debug')('semantic-release-spec-md:index');
const getLogger = require('./get-logger');
const requireg = require('requireg');
const path = require('path');
const fs = require('fs');
const SemanticReleaseError = require('@semantic-release/error');


let output = null;

function verifyConditions(pluginConfig, context) {
  const logger = getLogger(context);
  let foundSpecMD = false;
  try {
    foundSpecMD = require('spec-md');
  } catch(error) {
    logger.warn('spec-md was not found as a local dependency, checking globally...');
    logger.warn(error);
  }

  if(!foundSpecMD) {
    try {
      requireg('spec-md');
    } catch(error) {
      logger.fatal('Could not load spec-md as a local dependency or as a global install.');
      logger.fatal('Please ensure spec-md is installed.');
      throw [new SemanticReleaseError('Missing spec-md', 'E_MISSING_SPEC_MD', 'Attempted to find spec-md as a local dependency and as a global install and failed.'), error];
    }
  }

  logger.info('spec-md was found, continuing...');

  if(!pluginConfig.specPath)
    throw new SemanticReleaseError('Missing specPath', 'E_MISSING_SPEC_PATH','Must provide a `specPath` in your semantic-release-spec-md configuration!');

  const specPath = path.resolve(context.cwd, pluginConfig.specPath);
  let specExists = false;
  try {
    specExists = fs.existsSync(specPath);
  }
  catch(error) {
    logger.fatal(`There was an error verifying spec existence at ${specPath}`);
    throw error;
  }

  if(!specExists) {
    const error = `Spec does not exist at ${specPath}`;
    logger.fatal(error);
    logger.fatal('Please verify that spec exists and that your semantic-release configuration is correct.');
    throw error;
  }


  if(pluginConfig.specMDPlugin && !pluginConfig.specMDPlugin.package) {
    throw new SemanticReleaseError('Missing plugin package', 'E_MISSING_PLUGIN_PACKAGE', 'Please supply a specMDPlugin.package to load if using a plugin');
  }

  if(!pluginConfig.outputPath)
    throw new SemanticReleaseError('Missing output path!', 'E_MISSING_OUTPUT_PATH', 'Please supply an output path');

}

async function verifyRelease(pluginConfig, context) {
  const logger = getLogger(context);
  const specmd = require('./get-spec-md');
  const specPath = path.resolve(context.cwd, pluginConfig.specPath);


  logger.info(`Validating spec at ${specPath}`);

  let ast = null;
  try {
    ast = await specmd.parse(specPath);
  } catch(error) {
    throw [new SemanticReleaseError('Error parsing spec', 'E_SPEC_PARSE_ERROR',
      `There was an error parsing the spec at ${specPath}`),
      error];
  }

  if(!ast)
    throw new SemanticReleaseError('AST empty',
      'E_AST_EMPTY',
      'The abstract syntax tree returned from spec-md was empty.');

  logger.info(`Spec at ${specPath} is valid.`);

}


async function prepare(pluginConfig, context) {
  const logger = getLogger(context);
  const specmd = require('./get-spec-md');
  const specPath = path.resolve(context.cwd, pluginConfig.specPath);
  const plugin = pluginConfig.specMDPlugin;
  const metadata = pluginConfig.metadata;

  logger.info(`Converting spec at ${specPath}`);

  try {

    if(!plugin) {
      output = await specmd.html(specPath, metadata);
    } else {
      const pluginPackage = pluginConfig.specMDPlugin.package;
      const {args, metadata} = pluginConfig.specMDPlugin;
      const plugin = require('./get-package')(pluginPackage);
      output = await plugin([specPath,...args], specmd.parse(specPath), metadata);
    }
  } catch(error) {
    logger.fatal('There was an error producing spec-md output');
    throw [new SemanticReleaseError('Error producing output', 'E_OUTPUT_ERROR', 'An error occurred while trying to produce output'), error];
  }

  if(!output)
    throw new SemanticReleaseError('Empty output', 'E_MISSING_OUTPUT', 'No output was produced after execution of spec-md');

  logger.info(`Spec at ${specPath} converted`);


  const outputPath = pluginConfig.outputPath;

  let outputPathExists = false;

  try {
    outputPathExists = fs.existsSync(outputPath);
  } catch(error) {
    throw [new SemanticReleaseError('Error determining output path existence', 'E_DET_OUTPUT_PATH', `There was an error determining if ${outputPath} exists`), error]
  }

  if(!outputPathExists) {
    logger.info('Output path does not exist.');
    logger.info('Creating output path.');

    fs.mkdirSync(outputPath);

    logger.info('Output path created.');
  }


  logger.info(`Writing output to ${outputPath}`);
  try {
    fs.writeFileSync(outputPath, output);
  } catch(error) {
    throw new [new SemanticReleaseError('Output write error', 'E_OUTPUT_WRITE_ERROR', `There was an issue writing spec-md output to ${outputPath}`), error];
  }
  logger.info(`Output written to ${outputPath}`);

}



module.exports = {
  verifyConditions,
  verifyRelease,
  prepare
};


