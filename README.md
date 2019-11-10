# fb-s2s-integration-zapier
Fb S2S is a Zapier app that allows users within Zapier to send their pixel S2S events to Facebook.
To use the app the user needs to generate access token for his pixel and Facebook developer app that has ads_read permission.
The app normalizes the data, hashes it and constructs a proper json payload with the data.

## Requirements
node.js v8 or above
Zapier platform CLI `npm install -g zapier`


## Building Fb S2S
`zapier build`
You can also run `zapier validate` to verify basic correctness.

## Testing
`npm test`

## Installing
`zapier upload`

See the [CONTRIBUTING](CONTRIBUTING.md) file for how to help out.

## License
fb-s2s-integration-zapier is MIT licensed, as found in the LICENSE file.