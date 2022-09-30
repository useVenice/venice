 
/* eslint-disable @typescript-eslint/array-type */
declare namespace Asana {
  // Client
  export interface Credentials {
    personalAccessToken: string
  }

  // API
  export interface Res<T> {
    data: T
  }

  export interface ListOf<T extends ResourceType> {
    data: Array<Compact<T>>
  }

  export interface CurrentUser {
    email: string
    gid: string
    name: string
    photo: Photo
    resource_type: string
    workspaces: Compact<'workspace'>[]
  }

  export interface Photo {
    image_128x128: string
    image_21x21: string
    image_27x27: string
    image_36x36: string
    image_60x60: string
  }

  export type ResourceType =
    | 'project'
    | 'task'
    | 'user'
    | 'tag'
    | 'section'
    | 'workspace'

  export interface Compact<T extends ResourceType> {
    gid: string
    name: string
    resource_type: T
  }

  export interface Task {
    assignee: Compact<'user'>
    assignee_status: string
    completed: boolean
    completed_at: string | null
    created_at: string
    custom_fields: unknown[]
    due_at: string | null
    due_on: string | null
    followers: Compact<'user'>[]
    gid: string
    hearted: boolean
    hearts: unknown[]
    liked: boolean
    likes: unknown[]
    memberships: Array<{
      project: Compact<'project'>
      section: Compact<'section'>
    }>
    modified_at: string
    name: string
    notes: string
    num_hearts: number
    num_likes: number
    parent: unknown
    projects: Compact<'project'>[]
    resource_subtype: string
    resource_type: string
    start_on: string | null
    tags: Compact<'tag'>[]
    workspace: Compact<'workspace'>
  }
}
