# enhanced-h264ify

A browser extension for Firefox and Chrome that lets you control which video and audio codecs YouTube uses. Force YouTube to play H.264 instead of VP9 or AV1 to reduce CPU usage on devices without hardware decoding support for those codecs.

This is a fork of the original [h264ify](https://github.com/nicedayjin/nicedayjin.github.io/tree/master/nicedayjin/nicedayjin.github.io/nicedayjin/nicedayjin.github.io/nicedayjin/h264ify) extension with additional codec and audio controls.

## Features

- Selectively block H.264 (AVC), VP9, or AV1 video codecs
- Block 60fps video to reduce CPU load
- Block Opus or AAC audio codecs
- Disable YouTube's loudness normalization
- Works on youtube.com, youtube-nocookie.com, and youtu.be
- Light and dark theme support

By default, VP9 and AV1 are blocked, forcing YouTube to fall back to H.264.

## When is this useful

YouTube prefers AV1, then VP9, then H.264 when selecting a codec. AV1 and VP9 deliver better quality at lower bitrates but require more processing power to decode. If your device lacks hardware decoding for these codecs, playback is handled by the CPU, which leads to high CPU usage, fan noise, battery drain, and stuttering video.

Hardware decoding support by era:

| Codec | Hardware decoding available since   |
| ----- | ----------------------------------- |
| H.264 | Virtually all devices               |
| VP9   | GPUs from roughly 2016 onwards      |
| AV1   | GPUs from roughly 2020-2021 onwards |

If your hardware supports VP9/AV1 hardware decoding, you likely do not need this extension.

## Installation

- Firefox: https://addons.mozilla.org/en-US/firefox/addon/enhanced-h264ify/
- Chrome: https://chrome.google.com/webstore/detail/enhanced-h264ify/omkfmpieigblcllmkgbflkikinpkodlk

## Usage

1. Install the extension
2. Click the extension icon to open the settings popup
3. Check the codecs you want to block
4. Reload any open YouTube tabs

Changes take effect on page reload. You can verify the active codec by right-clicking the YouTube player, selecting "Stats for nerds", and checking the Codecs line.

## Options

| Option                         | Default | Description                                  |
| ------------------------------ | ------- | -------------------------------------------- |
| Block h264 (AVC)               | Off     | Block H.264 video codec                      |
| Block VP9                      | On      | Block VP9 video codec                        |
| Block AV1                      | On      | Block AV1 video codec                        |
| Block 60fps video              | Off     | Block videos with frame rate above 30fps     |
| Block Opus                     | Off     | Block Opus audio codec                       |
| Block AAC (MP4A)               | Off     | Block AAC audio codec                        |
| Disable Loudness Normalization | Off     | Use actual volume level instead of normalized |

## How it works

The extension overrides two browser APIs that YouTube uses to check codec support:

- `HTMLVideoElement.canPlayType()`
- `MediaSource.isTypeSupported()`

When YouTube asks the browser whether it supports a blocked codec, the extension returns an empty string (unsupported), forcing YouTube to fall back to the next available codec.

Settings are passed securely from the extension context to the page context via script data attributes, without using localStorage.

## License

MIT
