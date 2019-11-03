// create a event
const API_VERSION = 'v4.0';
const utf8 = require('utf8');
const shajs = require('sha.js');

function hash(dataToBeHashed) {
  dataToBeHashed = dataToBeHashed.trim().toLowerCase();
  let hashedData = new shajs.sha256().update(dataToBeHashed).digest('hex');
  return utf8.encode(hashedData);
}

function setHashedField(targetObject, bundle, fieldName) {
  let dataToBeHashed = bundle.inputData[fieldName];
  if (dataToBeHashed !== undefined && dataToBeHashed !== '') {
    targetObject[fieldName] = hash(dataToBeHashed);
  }
}

function setField(targetObject, bundle, fieldName) {
  let dataToBeSet = bundle.inputData[fieldName];
  if (dataToBeSet !== undefined && dataToBeSet !== '') {
    targetObject[fieldName] = dataToBeSet;
  }
}

const createEvent = (z, bundle) => {
  let pixelId = bundle.inputData.pixelId;
  let accessToken = bundle.inputData.accessToken;

  let payload = {
    "data": [
      {
        "event_name": bundle.inputData.eventName,
        "event_time": bundle.inputData.eventTime,
        "user_data": {},
        "custom_data": {},
      }
    ]
  };

  if (bundle.inputData.eventId !== undefined && bundle.inputData.eventId !== '') {
    payload.data[0]['event_id'] = bundle.inputData.eventId;
  }

  // update optional payload fields
  let user_data = payload.data[0].user_data;
  setHashedField(user_data, bundle, 'fn');
  setHashedField(user_data, bundle, 'ln');
  setHashedField(user_data, bundle, 'em');
  setHashedField(user_data, bundle, 'ct');
  setHashedField(user_data, bundle, 'st');
  setHashedField(user_data, bundle, 'country');
  setHashedField(user_data, bundle, 'zp');
  setHashedField(user_data, bundle, 'ph');
  setHashedField(user_data, bundle, 'external_id');

  let custom_data = payload.data[0].custom_data;
  setField(custom_data, bundle, 'value');
  setField(custom_data, bundle, 'currency');
  setField(custom_data, bundle, 'content_ids');
  setField(custom_data, bundle, 'content_type');

  const responsePromise = z.request({
    method: 'POST',
    url: `https://graph.facebook.com/${API_VERSION}/${pixelId}/events?access_token=${accessToken}`,
    body: payload,
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content));
};

const allUserDataFields = [
  {
      key: 'fn',
      required: false,
      label: 'First Name',
      helpText: 'Example: joe'
  },
  {
      key: 'ln',
      required: false,
      label: 'Last Name',
      helpText: 'Example: smith'
  },
  {
      key: 'em',
      required: false,
      label: 'Email',
      helpText: 'Example: joe@eg.com'
  },
  {
      key: 'ct',
      required: false,
      label: 'City',
      helpText: 'City without spaces or punctuation. Example: menlopark'
  },
  {
      key: 'st',
      required: false,
      label: 'State',
      helpText: 'A two-letter state code in lowercase. Example: ca'
  },
  {
      key: 'country',
      required: false,
      label: 'Country',
      helpText: 'A two-letter country code in lowercase. Example: us'
  },
  {
      key: 'zp',
      required: false,
      label: 'Zip',
      helpText: 'A five-digit zip code. Example: 94035'
  },
  {
      key: 'ph',
      required: false,
      label: 'Phone',
      helpText: 'A phone number. Include only digits with country code, area code, and number. Example: 16505551212'
  },
  {
      key: 'external_id',
      required: false,
      label: 'External ID',
      helpText: 'Any unique ID from the advertiser, such as loyalty membership IDs, user IDs.'
  }
];

const allEventDataFields = [
  {
      key: 'value',
      required: false,
      label: 'Value (Required for Purchase event)',
      helpText: 'The value of a user performing this event to the business (ex price).Example: 98.00'
  },
  {
      key: 'currency',
      required: false,
      label: 'Currency (Required for Purchase events)',
      helpText: 'Three-letter ISO currency code. Example: USD'
  },
  {
      key: 'content_ids',
      required: false,
      label: 'content_ids (Required for Dynamic ads)',
      helpText: 'Array of product IDs, such as SKUs. Example ["ABC123"] or ["ABC123", "XYZ789"]).'
  },
  {
      key: 'content_type',
      required: false,
      label: 'content_type (Required for Dynamic ads)',
      helpText: 'Either product or product_group based on the content_ids. If the IDs being passed in content_ids are IDs of products then the value should be product. If product group IDs are being passed, then the value should be product_group.'
  }
];

module.exports = {
  key: 'event',
  noun: 'Event',

  create: {
    display: {
      label: 'Send your events',
      description: 'Send your S2S events to FB.'
    },
    operation: {
      inputFields: [
        {
            key: 'pixelId',
            required: true,
            label: 'Pixel ID',
            helpText: 'Your pixel id'
        },
        {
            key: 'accessToken',
            required: true,
            label: 'Access Token',
            type: 'password',
            helpText: 'Access Token you generated for your pixel'
        },
        {
            key: 'eventName',
            required: true,
            label: 'Event Type',
            choices: ['Purchase', 'AddToCart', 'AddPaymentInfo', 'CompleteRegistration', 'Lead', 'ViewContent'],
            placeholder: 'Purchase',
            helpText: 'The name of the standard event.'
        },
        {
            key: 'eventTime',
            required: true,
            label: 'Event time (when the event occurred)',
            helpText: 'A Unix timestamp in seconds indicating when the actual event occurred.'
        },
        {
            key: 'eventId',
            required: false,
            label: 'Event_id',
            helpText: 'Used by Facebook to deduplicate events sent from both server and browser (pixel).'

        },
        {
            key: 'userDataFields',
            label: 'Select user data fields to send',
            children: allUserDataFields
        },
        {
            key: 'eventDataFields',
            label: 'Select event data fields to be sent',
            children: allEventDataFields
        }
      ],
      perform: createEvent
    },
  }
};
