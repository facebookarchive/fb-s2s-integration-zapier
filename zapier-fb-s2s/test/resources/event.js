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
    const bundle = { inputData: {
      pixelId: '',
      accessToken: '',
      eventName: 'ViewContent',
      eventTime: '1571246071',
      fn: 'Lia',
      ln: 'Skywalker',
      em: 'lia@dog.com',
      value: '45.00',
      currency: 'usd',
      ct: 'newyork',
      st: 'ny',
      external_id: '1234567',
      content_ids: '["123abc"]'

    } };

    appTester(App.resources.event.create.operation.perform, bundle)
      .then(results => {
        should.exist(results);
        console.log(results);
        done();
      })
      .catch(done);
  });
});
