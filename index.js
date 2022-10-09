const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const exec = require('@actions/exec');
const io = require('@actions/io');
const fs = require('fs');
const { getZarfBinary } = require('./lib/utils');

async function setup() {
  try {
    // Get version of zarf to be installed
    const version = core.getInput('version');

    // Download the specified version of zarf
    const download = getZarfBinary(version);
    const pathToBinary = await tc.downloadTool(download.url);

    // Debugging. Need to remove when finished
    core.debug(pathToBinary);

    // Set executable permission for the owner of the file
    const filePermissions = fs.chmod(pathToBinary, 100);
    core.debug(filePermissions);

    // Expose the zarf binary by adding it to the PATH
    core.addPath(pathToBinary);

    // Execute the zarf binary
    const zarfBinary = download.filename;
    core.debug(zarfBinary);
    await exec.exec(zarfBinary);

  } catch (err) {
    core.setFailed(err);
  }
}

setup();