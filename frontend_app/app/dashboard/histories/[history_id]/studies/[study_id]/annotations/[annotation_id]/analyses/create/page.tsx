import Form from '@/app/ui/drug-queries/create-form';
import Breadcrumbs from '@/app/ui/variant-analysis/breadcrumbs';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Drug Query',
};

export default async function PagePage(props: {
    params: Promise<{ id: string }>;
}) {
    const { params } = await props
    const { id } = await params
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Patient: ENXXXXXXXXX', href: '/dashboard1/' },
                    {
                        label: 'Study: SXXXXXXXXX',
                        href: `/dashboard2/`,
                    },
                    {
                        label: 'Annotation: AXXXXXXXXX',
                        href: `/dashboard3/`,
                    },
                    {
                        label: 'New analysis',
                        href: `/dashboard4/`,
                        active: true,
                    },
                ]}
            />

            <div className="p-4 pl-4 w-full h-14 bg-gray-50 rounded-xl mb-4 flex justify-between items-center">
                <InformationCircleIcon className="h-[30] w-[30] text-gray-500" />
                <p className="text-left w-full ml-4">Request a new analysis overt the current annotation.</p>
            </div>

            <Form id={id} />
        </main>
    );
}