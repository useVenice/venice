import {z} from '@usevenice/vdk'

export const address = z
  .object({
    city: z.string(),
    country: z.string(),
    postal_code: z.string(),
    state: z.string(),
    street_1: z.string(),
    street_2: z.string(),
  })
  .openapi({ref: 'sales-engagement.address'})

export const email_addresses = z
  .array(
    z.object({
      email_address: z.string(),
      email_address_type: z.enum(['primary', 'personal', 'work']),
    }),
  )
  .openapi({ref: 'sales-engagement.email_addresses'})

export const phone_numbers = z
  .array(
    z.object({
      phone_number: z.string(),
      phone_number_type: z.enum(['primary', 'work', 'home', 'mobile', 'other']),
    }),
  )
  .openapi({ref: 'sales-engagement.phone_numbers'})

export const contact = z
  .object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    // Enable me later...
    // owner_id: z.string(),
    // account_id: z.string().optional(),
    // job_title: z.string(),
    // address,
    // email_addresses,
    // phone_numbers,
    // open_count: z.number(),
    // click_count: z.number(),
    // reply_count: z.number(),
    // bounced_count: z.number(),
    // created_at: z.string(),
    // updated_at: z.string(),
    // is_deleted: z.boolean(),
    // last_modified_at: z.string(),
    // raw_data: z.object({}).catchall(z.any()).optional(),
  })
  .openapi({ref: 'sales-engagement.contact'})
