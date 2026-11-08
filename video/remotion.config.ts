import { Config } from '@remotion/cli/config';

// Uses the Chromium headless shell that is pre-installed in this environment.
// Override with REMOTION_BROWSER=/path/to/chrome when rendering elsewhere.
const browser = process.env.REMOTION_BROWSER
  ?? '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
if (require('fs').existsSync(browser)) Config.setBrowserExecutable(browser);
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
