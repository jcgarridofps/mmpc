import Form from '@/app/ui/history/create-form';
import Breadcrumbs from '@/app/ui/variant-analysis/breadcrumbs';
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

      <div className="p-4 pl-6 w-full h-14 bg-gray-50 rounded-xl mb-4">
        Start a new history for a new patient.
      </div>

      <Form />
    </main>
  );
}