import Form from '@/app/ui/patient/create-form';
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
          { label: 'Patient', href: '/dashboard/patient' },
          {
            label: 'Create patient',
            href: '/dashboard/patient/create',
            active: true,
          },
        ]}
      />
      <Form/>
    </main>
  );
}