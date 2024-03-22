/* eslint-disable jest/no-standalone-expect */
import {initTwentySDK} from '@opensdks/sdk-twenty'

const accessToken = process.env['TWENTY_ACCESS_TOKEN']
const maybeTest = accessToken ? test : test.skip

const twenty = initTwentySDK({
  headers: {authorization: `Bearer ${accessToken}`},
})

maybeTest('should return a list of companies', async () => {
  const companies = await twenty.core.GET('/companies')
  expect(companies.data.data?.companies).toBeTruthy()
})
