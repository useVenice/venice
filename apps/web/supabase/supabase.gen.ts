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
      integration: {
        Row: {
          created_at: string
          external: Json
          id: string
          connector_name: string
          standard: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          external?: Json
          id?: string
          connector_name?: string
          standard?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          external?: Json
          id?: string
          connector_name?: string
          standard?: Json
          updated_at?: string
        }
      }
      connector_config: {
        Row: {
          config: Json
          created_at: string
          id: string
          org_id: string
          connector_name: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          id?: string
          org_id: string
          connector_name?: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          org_id?: string
          connector_name?: string
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
          end_user_id: string | null
          external: Json
          id: string
          connector_name: string
          source_id: string | null
          standard: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_user_id?: string | null
          external?: Json
          id?: string
          connector_name?: string
          source_id?: string | null
          standard?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_user_id?: string | null
          external?: Json
          id?: string
          connector_name?: string
          source_id?: string | null
          standard?: Json
          updated_at?: string
        }
      }
      raw_commodity: {
        Row: {
          created_at: string
          end_user_id: string | null
          external: Json
          id: string
          connector_name: string
          source_id: string | null
          standard: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_user_id?: string | null
          external?: Json
          id?: string
          connector_name?: string
          source_id?: string | null
          standard?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_user_id?: string | null
          external?: Json
          id?: string
          connector_name?: string
          source_id?: string | null
          standard?: Json
          updated_at?: string
        }
      }
      raw_transaction: {
        Row: {
          created_at: string
          end_user_id: string | null
          external: Json
          id: string
          connector_name: string
          source_id: string | null
          standard: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_user_id?: string | null
          external?: Json
          id?: string
          connector_name?: string
          source_id?: string | null
          standard?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_user_id?: string | null
          external?: Json
          id?: string
          connector_name?: string
          source_id?: string | null
          standard?: Json
          updated_at?: string
        }
      }
      resource: {
        Row: {
          created_at: string
          display_name: string | null
          end_user_id: string | null
          env_name: string | null
          id: string
          integration_id: string | null
          connector_config_id: string | null
          connector_name: string
          settings: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          end_user_id?: string | null
          env_name?: string | null
          id?: string
          integration_id?: string | null
          connector_config_id?: string | null
          connector_name?: string
          settings?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          end_user_id?: string | null
          env_name?: string | null
          id?: string
          integration_id?: string | null
          connector_config_id?: string | null
          connector_name?: string
          settings?: Json
          updated_at?: string
        }
      }
    }
    Views: {
      account: {
        Row: {
          available_balance: number | null
          created_at: string | null
          current_balance: number | null
          default_unit: string | null
          end_user_id: string | null
          external: Json | null
          id: string | null
          institution_name: string | null
          last_four: string | null
          name: string | null
          connector_name: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          available_balance?: never
          created_at?: string | null
          current_balance?: never
          default_unit?: never
          end_user_id?: string | null
          external?: never
          id?: string | null
          institution_name?: never
          last_four?: never
          name?: never
          connector_name?: string | null
          type?: never
          updated_at?: string | null
        }
        Update: {
          available_balance?: never
          created_at?: string | null
          current_balance?: never
          default_unit?: never
          end_user_id?: string | null
          external?: never
          id?: string | null
          institution_name?: never
          last_four?: never
          name?: never
          connector_name?: string | null
          type?: never
          updated_at?: string | null
        }
      }
      transaction: {
        Row: {
          account_id: string | null
          amount_quantity: number | null
          amount_unit: string | null
          created_at: string | null
          date: string | null
          description: string | null
          end_user_id: string | null
          external: Json | null
          external_category: string | null
          id: string | null
          notes: string | null
          payee: string | null
          connector_name: string | null
          splits: Json | null
          updated_at: string | null
        }
        Insert: {
          account_id?: never
          amount_quantity?: never
          amount_unit?: never
          created_at?: string | null
          date?: never
          description?: never
          end_user_id?: string | null
          external?: never
          external_category?: never
          id?: string | null
          notes?: never
          payee?: never
          connector_name?: string | null
          splits?: never
          updated_at?: string | null
        }
        Update: {
          account_id?: never
          amount_quantity?: never
          amount_unit?: never
          created_at?: string | null
          date?: never
          description?: never
          end_user_id?: string | null
          external?: never
          external_category?: never
          id?: string | null
          notes?: never
          payee?: never
          connector_name?: string | null
          splits?: never
          updated_at?: string | null
        }
      }
      transaction_split: {
        Row: {
          account_id: string | null
          amount_quantity: number | null
          amount_unit: string | null
          created_at: string | null
          data: Json | null
          end_user_id: string | null
          key: string | null
          transaction_id: string | null
          updated_at: string | null
        }
      }
    }
    Functions: {
      format_relative_date: {
        Args: {
          date: string
        }
        Returns: string
      }
      generate_ulid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: Json
      }
      jsonb_array_to_text_array: {
        Args: {
          _js: Json
        }
        Returns: unknown
      }
      test_is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
