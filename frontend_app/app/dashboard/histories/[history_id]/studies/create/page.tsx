import Form from '@/app/ui/studies/create-form';
import Breadcrumbs from '@/app/ui/annotations/breadcrumbs';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Metadata } from 'next';
import { fetchPatientByHistoryAppId } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Create study',
};

export default async function Page(props: {params: Promise<{ history_id: string }>;}
) {

  const params = await props.params;
  const patient_appId = await fetchPatientByHistoryAppId(params.history_id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: `Patient: ${patient_appId}`, href: '/dashboard/' },
          {
            label: 'New study',
            href: '/dashboard2/',
            active: true,
          },
        ]}
      />

      <div className="p-4 pl-4 w-full h-14 bg-gray-50 rounded-xl mb-4 flex justify-between items-center">
        <InformationCircleIcon className="h-[30] w-[30] text-gray-500" />
        <p className="text-left w-full ml-4">Start a new study for the patient.</p>
      </div>

      <Form patient_appId={patient_appId} history_id={params.history_id}/>
    </main>
  );
}