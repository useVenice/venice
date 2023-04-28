'use client'

export default function CreateMagicLink({params}: {params: {slug: string}}) {
  return (
    <div className="flex h-screen w-screen flex-col">
      <h1>Magic link {params.slug}</h1>
    </div>
  )
}
