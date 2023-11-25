import * as z from 'zod'
import type {oas30, oas31} from 'zod-openapi'
import {extendZodWithOpenApi} from 'zod-openapi'

extendZodWithOpenApi(z)

export {z}
export {extendZodWithOpenApi}

export type OpenAPISpec = oas30.OpenAPIObject | oas31.OpenAPIObject

export type JsonSchema = oas31.SchemaObject
