// Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved

// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

const should = require('should');

const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('My App', () => {
  it('should run resources.event', done => {
    const bundle = {
      authData: {
        accessToken: '',
      },
      inputData: {
      pixelId: '',
      eventName: 'ViewContent',
      eventTime: '1580573487',
      fn: 'Lia',
      ln: 'Skywalker',
      em: 'lia@dog.com',
      value: '45.00',
      currency: 'usd',
      ct: 'newyork',
      st: 'ny',
      external_id: '1234567',
      content_ids: '["123abc"]',
      userSpecifiedApiVersion: ''
    } };

    appTester(App.resources.event.create.operation.perform, bundle)
      .then(results => {
        should.exist(results);
        console.log(JSON.stringify(results, undefined, 2));
        done();
      })
      .catch(done);
  });
});
