import { formatDateToLocal } from '@/app/lib/utils';
import { fetchFilteredStudies } from '@/app/lib/data';
import { ReviewStudy } from './buttons';

export type Study = {
  id: string;
  appId: string;
  description: string;
  date: string;
  studyProcedure: string;
};

export default async function DataTable({
  query,
  currentPage,
  historyId
}: {
  query: string;
  currentPage: number;
  historyId: string;
}) {
  const studies:Study[] = await fetchFilteredStudies(query, currentPage, historyId);


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
                  Description
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {studies?.map((study:Study) => (
                <tr
                  key={study.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3 pl-6">
                    {study.appId}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 pl-6"
                  title={study.description}
                  >
                    {study.description}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(study.date)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <ReviewStudy historyId={historyId} studyId={study.id} />
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
