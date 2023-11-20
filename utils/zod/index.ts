import * as z from 'zod'
import {extendZodWithOpenApi} from 'zod-openapi'

extendZodWithOpenApi(z)

export {z}
export {extendZodWithOpenApi}
