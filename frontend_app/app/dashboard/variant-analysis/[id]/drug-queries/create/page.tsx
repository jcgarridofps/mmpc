import Form from '@/app/ui/drug-queries/create-form';
import Breadcrumbs from '@/app/ui/variant-analysis/breadcrumbs';
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

            <div className="p-4 pl-6 w-full h-14 bg-gray-50 rounded-xl mb-4">
                Request a new analysis overt the current annotation.
            </div>

            <Form id={id} />
        </main>
    );
}