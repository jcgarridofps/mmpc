import { formatDateToLocal } from '@/app/lib/utils';
import { fetchFilteredAnnotations } from '@/app/lib/data';
import { ReviewAnalysis, ReviewAnnotation } from './buttons';

export type Annotation = {
  id: string;
  appId: string;
  date: string;
  status: string;
  version: string
};

export default async function DataTable({
  query,
  currentPage,
  history_id,
  study_id
}: {
  query: string;
  currentPage: number;
  history_id: string;
  study_id: string;
}) {
  const annotations:Annotation[] = await fetchFilteredAnnotations(query, currentPage, study_id);


  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Version
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {annotations?.map((annotation:Annotation) => (
                <tr
                  key={annotation.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3 pl-6">
                    {annotation.appId}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(annotation.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-green-700">
                    UPDATED
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {annotation.status}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <ReviewAnnotation historyId={history_id} studyId={study_id} annotationId={annotation.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
