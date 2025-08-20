import Form from '@/app/ui/variant-analysis/create-form';
import Breadcrumbs from '@/app/ui/variant-analysis/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Create Variant Analysis',
};
 
export default async function Page() {
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Variant analysis', href: '/dashboard/variant-analysis' },
          {
            label: 'Create variant analysis',
            href: '/dashboard/variant-analysis/create',
            active: true,
          },
        ]}
      />
      <Form/>
    </main>
  );
}