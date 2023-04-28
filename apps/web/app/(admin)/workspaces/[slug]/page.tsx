'use client'

export default function WorkspaceHome({params}: {params: {slug: string}}) {
  return (
    <div className="flex h-screen w-screen flex-col">
      <h1>Hello {params.slug}</h1>
    </div>
  )
}
