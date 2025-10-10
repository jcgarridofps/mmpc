import { fetchAnnotationByAnnotationId, fetchPatientByHistoryId, fetchStudyByStudyId } from '@/app/lib/data';
import Form from '@/app/ui/analysis/create-form';
import Breadcrumbs from '@/app/ui/annotations/breadcrumbs';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Drug Query',
};

export default async function PagePage(props: {
    params: Promise<{
        history_id: string,
        study_id: string,
        annotation_id: string
    }>;
}) {
    const params = await props.params;
    const patientAppId = await fetchPatientByHistoryId(params.history_id);
    const studyAppId = await fetchStudyByStudyId(params.study_id);
    const annotationAppId = await fetchAnnotationByAnnotationId(params.annotation_id);

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: `Patient: ${patientAppId}`, href: `/dashboard/histories/${params.history_id}/studies/` },
                    {
                        label: `Study: ${studyAppId}`,
                        href: `/dashboard/histories/${params.history_id}/studies/${params.study_id}/annotations/`,
                    },
                    {
                        label: `Annotation: ${annotationAppId}`,
                        href: `/dashboard/histories/${params.history_id}/studies/${params.study_id}/annotations/${params.annotation_id}/analyses/`,
                    },
                    {
                        label: 'New analysis',
                        href: `/dashboard/histories/${params.history_id}/studies/${params.study_id}/annotations/${params.annotation_id}/analyses/create/`,
                        active: true,
                    },
                ]}
            />

            <div className="p-4 pl-4 w-full h-14 bg-gray-50 rounded-xl mb-4 flex justify-between items-center">
                <InformationCircleIcon className="h-[30] w-[30] text-gray-500" />
                <p className="text-left w-full ml-4">Request a new analysis overt the current annotation.</p>
            </div>

            <Form annotation_id={params.annotation_id} />
        </main>
    );
}