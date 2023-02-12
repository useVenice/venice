export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      institution: {
        Row: {
          created_at: string
          external: Json
          id: string
          provider_name: string
          standard: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          external?: Json
          id?: string
          provider_name?: string
          standard?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          external?: Json
          id?: string
          provider_name?: string
          standard?: Json
          updated_at?: string
        }
      }
      integration: {
        Row: {
          config: Json
          created_at: string
          id: string
          provider_name: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          id?: string
          provider_name?: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          provider_name?: string
          updated_at?: string
        }
      }
      migrations: {
        Row: {
          date: string
          hash: string
          name: string
        }
        Insert: {
          date?: string
          hash: string
          name: string
        }
        Update: {
          date?: string
          hash?: string
          name?: string
        }
      }
      pipeline: {
        Row: {
          created_at: string
          destination_id: string | null
          destination_state: Json
          id: string
          last_sync_completed_at: string | null
          last_sync_started_at: string | null
          link_options: Json
          source_id: string | null
          source_state: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          destination_id?: string | null
          destination_state?: Json
          id?: string
          last_sync_completed_at?: string | null
          last_sync_started_at?: string | null
          link_options?: Json
          source_id?: string | null
          source_state?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          destination_id?: string | null
          destination_state?: Json
          id?: string
          last_sync_completed_at?: string | null
          last_sync_started_at?: string | null
          link_options?: Json
          source_id?: string | null
          source_state?: Json
          updated_at?: string
        }
      }
      raw_account: {
        Row: {
          created_at: string
          external: Json
          id: string
          ledger_resource_id: string | null
          provider_name: string
          source_id: string | null
          standard: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          external?: Json
          id?: string
          ledger_resource_id?: string | null
          provider_name?: string
          source_id?: string | null
          standard?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          external?: Json
          id?: string
          ledger_resource_id?: string | null
          provider_name?: string
          source_id?: string | null
          standard?: Json
          updated_at?: string
        }
      }
      raw_commodity: {
        Row: {
          created_at: string
          external: Json
          id: string
          ledger_resource_id: string | null
          provider_name: string
          source_id: string | null
          standard: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          external?: Json
          id?: string
          ledger_resource_id?: string | null
          provider_name?: string
          source_id?: string | null
          standard?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          external?: Json
          id?: string
          ledger_resource_id?: string | null
          provider_name?: string
          source_id?: string | null
          standard?: Json
          updated_at?: string
        }
      }
      raw_transaction: {
        Row: {
          created_at: string
          external: Json
          id: string
          ledger_resource_id: string | null
          provider_name: string
          source_id: string | null
          standard: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          external?: Json
          id?: string
          ledger_resource_id?: string | null
          provider_name?: string
          source_id?: string | null
          standard?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          external?: Json
          id?: string
          ledger_resource_id?: string | null
          provider_name?: string
          source_id?: string | null
          standard?: Json
          updated_at?: string
        }
      }
      resource: {
        Row: {
          created_at: string
          creator_id: string | null
          display_name: string | null
          env_name: string | null
          id: string
          institution_id: string | null
          integration_id: string | null
          provider_name: string
          settings: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id?: string | null
          display_name?: string | null
          env_name?: string | null
          id?: string
          institution_id?: string | null
          integration_id?: string | null
          provider_name?: string
          settings?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string | null
          display_name?: string | null
          env_name?: string | null
          id?: string
          institution_id?: string | null
          integration_id?: string | null
          provider_name?: string
          settings?: Json
          updated_at?: string
        }
      }
    }
    Views: {
      posting: {
        Row: {
          account_id: string | null
          amount_quantity: string | null
          amount_unit: string | null
          data: Json | null
          id: string | null
          key: string | null
        }
      }
      transaction: {
        Row: {
          account_id: string | null
          amount_quantity: string | null
          amount_unit: string | null
          date: string | null
          description: string | null
          external_category: string | null
          id: string | null
          notes: string | null
          payee: string | null
          postings: string | null
        }
        Insert: {
          account_id?: never
          amount_quantity?: never
          amount_unit?: never
          date?: never
          description?: never
          external_category?: never
          id?: string | null
          notes?: never
          payee?: never
          postings?: never
        }
        Update: {
          account_id?: never
          amount_quantity?: never
          amount_unit?: never
          date?: never
          description?: never
          external_category?: never
          id?: string | null
          notes?: never
          payee?: never
          postings?: never
        }
      }
    }
    Functions: {
      _uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      create_workspace: {
        Args: { name: string }
        Returns: string
      }
      generate_ulid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      http: {
        Args: { request: unknown }
        Returns: unknown
      }
      http_delete:
        | {
            Args: { uri: string; content: string; content_type: string }
            Returns: unknown
          }
        | {
            Args: { uri: string }
            Returns: unknown
          }
      http_get:
        | {
            Args: { uri: string; data: Json }
            Returns: unknown
          }
        | {
            Args: { uri: string }
            Returns: unknown
          }
      http_head: {
        Args: { uri: string }
        Returns: unknown
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: unknown
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: { curlopt: string; value: string }[]
      }
      http_patch: {
        Args: { uri: string; content: string; content_type: string }
        Returns: unknown
      }
      http_post:
        | {
            Args: { uri: string; data: Json }
            Returns: unknown
          }
        | {
            Args: { uri: string; content: string; content_type: string }
            Returns: unknown
          }
      http_put: {
        Args: { uri: string; content: string; content_type: string }
        Returns: unknown
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      jsonb_array_to_text_array: {
        Args: { _js: Json }
        Returns: string[]
      }
      jsonb_object_keys: {
        Args: { obj: Json }
        Returns: string[]
      }
      jsonb_object_keys_to_text_array: {
        Args: { _js: Json }
        Returns: string[]
      }
      plv8_test: {
        Args: { keys: string[]; vals: string[] }
        Returns: Json
      }
      urlencode:
        | {
            Args: { string: string }
            Returns: string
          }
        | {
            Args: { data: Json }
            Returns: string
          }
        | {
            Args: { string: string }
            Returns: string
          }
      xjsonb_object_keys: {
        Args: { obj: Json }
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
