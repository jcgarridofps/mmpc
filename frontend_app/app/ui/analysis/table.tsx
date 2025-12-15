import { formatDateToLocal } from '@/app/lib/utils';
import { fetchFilteredAnalyses } from '@/app/lib/data';
import { ReviewAnalysis } from './buttons';
import { Analysis } from '@/types/app-types';
import { parseAppSegmentConfig } from 'next/dist/build/segment-config/app/app-segment-config';

export default async function AnalysesTable({
  query,
  currentPage,
  history_id,
  study_id,
  annotation_id
}: {
  query: string;
  currentPage: number;
  history_id: string;
  study_id: string;
  annotation_id: string;
}) {
  const analyses:Analysis[] = await fetchFilteredAnalyses(query, currentPage, annotation_id);
  console.log(JSON.stringify(analyses));

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
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Cancer types
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
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
              {analyses?.map((analysis:Analysis) => (
                <tr
                  key={analysis.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{analysis.appId}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{JSON.stringify(analysis.cancerTypes)}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(analysis.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-green-700">
                    UPDATED
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {analysis.status}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className={analysis.status != "PROCESSED" ? "hidden" : "flex justify-end gap-3"} >
                      <ReviewAnalysis history_id={history_id} study_id = {study_id} annotation_id={annotation_id} analysis_id={analysis.id}/>
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
