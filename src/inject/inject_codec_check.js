/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 alextrv
 * Copyright (c) 2015 erkserkserks
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

function readSettings() {
  var data = document.currentScript.dataset;
  var disallowed = [];
  if (data.blockH264 === 'true') {
    disallowed.push('avc');
  }
  if (data.blockVp9 === 'true') {
    disallowed.push('vp9', 'vp09');
  }
  if (data.blockAv1 === 'true') {
    disallowed.push('av01', 'av99');
  }
  if (data.blockOpus === 'true') {
    disallowed.push('opus');
  }
  if (data.blockMp4a === 'true') {
    disallowed.push('mp4a');
  }
  return {
    disallowedTypes: disallowed,
    block60fps: data.block60fps === 'true'
  };
}

function override() {
  var settings = readSettings();

  // Override video element canPlayType() function
  var videoElem = document.createElement('video');
  var origCanPlayType = videoElem.canPlayType.bind(videoElem);
  videoElem.__proto__.canPlayType = makeModifiedTypeChecker(origCanPlayType, settings);

  // Override media source extension isTypeSupported() function
  var mse = window.MediaSource;
  // Check for MSE support before use
  if (mse === undefined) return;
  var origIsTypeSupported = mse.isTypeSupported.bind(mse);
  mse.isTypeSupported = makeModifiedTypeChecker(origIsTypeSupported, settings);
}

// return a custom MIME type checker that can defer to the original function
function makeModifiedTypeChecker(origChecker, settings) {
  // Check if a video type is allowed
  return function (type) {
    if (type === undefined) return '';

    // If video type is in disallowed_types, say we don't support them
    for (var i = 0; i < settings.disallowedTypes.length; i++) {
      if (type.indexOf(settings.disallowedTypes[i]) !== -1) return '';
    }

    if (settings.block60fps) {
      var match = /framerate=(\d+)/.exec(type);
      if (match && match[1] > 30) return '';
    }

    // Otherwise, ask the browser
    return origChecker(type);
  };
}

override();
