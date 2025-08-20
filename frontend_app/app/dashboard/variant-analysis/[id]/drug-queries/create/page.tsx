import Form from '@/app/ui/drug-queries/create-form';
import Breadcrumbs from '@/app/ui/variant-analysis/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Drug Query',
};

export default async function PagePage(props: {
    params: Promise<{ id: string }>;
  }) {
    const {params} = await props
    const {id} = await params
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Variant analysis', href: '/dashboard/variant-analysis' },
                    {
                        label: 'Drug queries', href: `/dashboard/variant-analysis/${id}/drug-queries`
                    },
                    {
                        label: 'Create drug query',
                        href: `/dashboard/variant-analysis/${id}/drug-queries/create`,
                        active: true,
                    },
                ]}
            />
            <Form id={id}/>
        </main>
    );
}