import type {GetServerSideProps} from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {PageHeader} from '../../components/PageHeader'
import {PageLayout} from '../../components/PageLayout'
import {Button, Card, EmailIcon, SettingsIcon} from '@usevenice/ui'

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
        destination: '/admin/auth',
        permanent: false,
      },
    }
  }
  return {props: {}}
}

export default function Page() {
  return (
    <PageLayout title="Integrations">
      <PageHeader title={['Integrations']} />
      <div className="flex flex-wrap gap-8 p-10">
        <PlaidCard />
        <MergeCard />
        <QuickbooksCard />
        <NetSuiteCard />
        <StripeCard />
        <RequestIntegrationCard />
      </div>
    </PageLayout>
  )
}

/* Plaid */
function PlaidCard() {
  return (
    <Card className="flex w-40 flex-col gap-4 p-2">
      <span className="mt-2 text-center font-mono text-base text-offwhite">
        Plaid
      </span>
      <div className="mb-2 flex items-center justify-center">
        <Image width={150} height={70} src="/plaidLogo.png" alt="Plaid Logo" />
      </div>
      <Button asChild className="disabled mb-1 opacity-30">
        <div>
          <SettingsIcon className="h-6 w-6 fill-current pr-2 text-gray" />
          Settings
        </div>
      </Button>
    </Card>
  )
}

/* MergeCard */
function MergeCard() {
  return (
    <Card className="flex w-40 flex-col gap-4 p-2">
      <span className="mt-2 text-center font-mono text-base text-offwhite">
        Merge
      </span>
      <div className="mb-2 flex items-center justify-center">
        <Image width={150} height={70} src="/mergeLogo.png" alt="Merge Logo" />
      </div>
      <Button asChild className="disabled mb-1 opacity-30">
        <div>
          <SettingsIcon className="h-6 w-6 fill-current pr-2 text-gray" />
          Settings
        </div>
      </Button>
    </Card>
  )
}

/* Quickbooks */
function QuickbooksCard() {
  return (
    <Card className="flex w-40 flex-col gap-4 p-2">
      <span className="mt-2 text-center font-mono text-base text-offwhite">
        Quickbooks
      </span>
      <div className="mb-2 flex items-center justify-center">
        <Image
          width={150}
          height={70}
          src="/qboLogo.png"
          alt="Quickbooks Logo"
        />
      </div>
      <ContactUsButton />
    </Card>
  )
}

/* NetSuite */
function NetSuiteCard() {
  return (
    <Card className="flex w-40 flex-col gap-4 p-2">
      <span className="mt-2 text-center font-mono text-base text-offwhite">
        NetSuite
      </span>
      <div className="mb-2 flex items-center justify-center">
        <Image
          width={150}
          height={70}
          src="/netsuiteLogo.png"
          alt="NetSuite Logo"
        />
      </div>
      <ContactUsButton />
    </Card>
  )
}

/* Stripe */
function StripeCard() {
  return (
    <Card className="flex w-40 flex-col gap-4 p-2">
      <span className="mt-2 text-center font-mono text-base text-offwhite">
        Stripe
      </span>
      <div className="mb-2 flex items-center justify-center">
        <Image
          width={150}
          height={70}
          src="/stripeLogo.png"
          alt="Stripe Logo"
        />
      </div>
      <ContactUsButton />
    </Card>
  )
}

/* Request an integration */
function RequestIntegrationCard() {
  return (
    <Card className="flex w-40 flex-col gap-4 p-2">
      <span className="mt-2 text-center font-mono text-base text-offwhite">
        Need another?
      </span>
      <div className="mb-2 flex items-center justify-center">
        <Image
          width={150}
          height={70}
          src="/requestLogo.png"
          alt="Request an integration"
        />
      </div>
      <ContactUsButton />
    </Card>
  )
}

/* Contact Button */
function ContactUsButton() {
  return (
    <Button variant="primary" asChild className="gap-2">
      <Link href="mailto:hi@venice.is">
        <EmailIcon className="h-4 w-4 fill-current text-offwhite" />
        Contact Us
      </Link>
    </Button>
  )
}
