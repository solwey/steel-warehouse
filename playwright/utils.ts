const stripeTestSubscriptionId = 'sub_1OcAkGAtqjBKUOx95gILbgaH';

export const MockPriceId1 = 'price_1OAdJYAtqjBKUOx9V3O3up0u';

export const MockWebhookPayload = {
  id: 'evt_1OcAfdesiotr',
  object: 'event',
  api_version: '2020-08-27',
  created: 1706119813,
  data: {
    object: {
      id: 'cs_test_jfsd-0fds09fujf90-u',
      object: 'checkout.session',
      after_expiration: null,
      allow_promotion_codes: null,
      amount_subtotal: 1000,
      amount_total: 1000,
      automatic_tax: [Object],
      billing_address_collection: null,
      cancel_url: 'https://test.app/user/dashboard',
      client_reference_id: null,
      client_secret: null,
      consent: null,
      consent_collection: null,
      created: 1706119789,
      currency: 'usd',
      currency_conversion: null,
      custom_fields: [],
      custom_text: [Object],
      customer: 'cus_test123',
      customer_creation: 'always',
      customer_details: [Object],
      customer_email: 'test@yahoo.com',
      expires_at: 1706206189,
      invoice: 'in_1OcAtpAtr43rtr',
      invoice_creation: null,
      livemode: false,
      locale: null,
      metadata: { org_id: '' },
      mode: 'subscription',
      payment_intent: null,
      payment_link: null,
      payment_method_collection: 'always',
      payment_method_configuration_details: null,
      payment_method_options: {},
      payment_method_types: [Array],
      payment_status: 'paid',
      phone_number_collection: [Object],
      recovered_from: null,
      setup_intent: null,
      shipping: null,
      shipping_address_collection: null,
      shipping_options: [],
      shipping_rate: null,
      status: 'complete',
      submit_type: null,
      subscription: stripeTestSubscriptionId,
      success_url: 'https://test.app/user/dashboard',
      total_details: [Object],
      ui_mode: 'hosted',
      url: null
    }
  },
  livemode: false,
  pending_webhooks: 1,
  request: { id: null, idempotency_key: null },
  type: 'checkout.session.completed'
};

export const MockSubscriptionEvent = {
  id: 'evt_1OcCpJAtqjBKUOx9iBuVVktm',
  object: 'event',
  api_version: '2020-08-27',
  created: 1706127217,
  data: {
    object: {
      id: stripeTestSubscriptionId,
      object: 'subscription',
      application: null,
      application_fee_percent: null,
      automatic_tax: [Object],
      billing_cycle_anchor: 1706119809,
      billing_cycle_anchor_config: null,
      billing_thresholds: null,
      cancel_at: null,
      cancel_at_period_end: false,
      canceled_at: null,
      cancellation_details: [Object],
      collection_method: 'charge_automatically',
      created: 1706119809,
      currency: 'usd',
      current_period_end: 1708798209,
      current_period_start: 1706119809,
      customer: 'cus_PR2zeBY2i1WGlg',
      days_until_due: null,
      default_payment_method: 'pm_1OcAtoAtqjBKUOx9B1ng25m8',
      default_source: null,
      default_tax_rates: [],
      description: null,
      discount: null,
      ended_at: null,
      invoice_settings: [Object],
      items: {
        data: [
          {
            price: {
              id: ''
            }
          }
        ]
      },
      latest_invoice: 'in_1OcCpHAtqjBKUOx9W3Dz4q8a',
      livemode: false,
      metadata: {},
      next_pending_invoice_item_invoice: null,
      on_behalf_of: null,
      pause_collection: null,
      payment_settings: [Object],
      pending_invoice_item_interval: null,
      pending_setup_intent: null,
      pending_update: null,
      plan: [Object],
      quantity: 1,
      schedule: null,
      start_date: 1706119809,
      status: 'active',
      test_clock: null,
      transfer_data: null,
      trial_end: null,
      trial_settings: [Object],
      trial_start: null
    },
    previous_attributes: {
      items: [Object],
      latest_invoice: 'in_1OcAtpAtqjBKUOx9a8Mljs95',
      plan: [Object]
    }
  },
  livemode: false,
  pending_webhooks: 1,
  request: { id: null, idempotency_key: 'c8cd4f56-4362-4271-941b-ee994852bfda' },
  type: 'customer.subscription.updated'
};
