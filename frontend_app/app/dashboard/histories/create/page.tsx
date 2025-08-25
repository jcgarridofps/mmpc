import Form from '@/app/ui/history/create-form';
import Breadcrumbs from '@/app/ui/variant-analysis/breadcrumbs';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Variant Analysis',
};

export default async function Page() {

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Histories', href: '/dashboard/' },
          {
            label: 'New history',
            href: `/dashboard/histories/create`,
            active: true,
          },
        ]}
      />

      <div className="p-4 pl-4 w-full h-14 bg-gray-50 rounded-xl mb-4 flex justify-between items-center">
        <InformationCircleIcon className="h-[30] w-[30] text-gray-500" />
        <p className="text-left w-full ml-4">Start a new history for a new patient.</p>
      </div>

      <Form />
    </main>
  );
}