import type {GetServerSideProps} from 'next'
import {useState} from 'react'
import {PageHeader} from '../../components/PageHeader'
import {PageLayout} from '../../components/PageLayout'
import Image from 'next/image'
import {EditIcon} from '@usevenice/ui'

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@usevenice/ui'

// for server-side
import {serverGetUser} from '../../server'

interface ServerSideProps {}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  ctx,
) => {
  const [user] = await serverGetUser(ctx)
  if (!user?.id) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    }
  }
  return {props: {}}
}

export default function Page() {
  const [selectedEnvironment, setSelectedEnvironment] = useState('sandbox')
  const [selectedLanguage, setSelectedLanguage] = useState('en')

  return (
    <PageLayout title="Plaid Settings">
      <PageHeader title={['Integrations', 'Plaid']} />
      <div className="p-6">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <Image
              width={85}
              height={40}
              src="/plaidLogo.png"
              alt="Plaid Logo"
            />
            <span className="text-center font-mono text-base text-offwhite">
              Settings: Plaid
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <span className="w-28 font-mono text-base text-offwhite">
                Environment
              </span>
              <Select
                value={selectedEnvironment}
                onValueChange={setSelectedEnvironment}>
                <SelectTrigger className="max-w-[10rem]" />
                <SelectContent>
                  <SelectItem value="sandbox">Sandbox</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <span className="w-28 font-mono text-base text-offwhite">
                Language
              </span>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}>
                <SelectTrigger className="max-w-[10rem]" />
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="nl">Nederlands</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button variant="primary" asChild className="max-w-[6rem] gap-2">
            <div>
              <EditIcon className="h-4 w-4 fill-current text-offwhite" />
              Save
            </div>
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}
