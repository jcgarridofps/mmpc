import { formatDateToLocal } from '@/app/lib/utils';
import { fetchFilteredReports } from '@/app/lib/data';
import { ReviewReport } from './buttons';

export type Report = {
  id:string,
  date: string
};

export default async function Table({
  variant_analysis_id,
  drug_query_id,
  currentPage,
}: {
  variant_analysis_id: string;
  drug_query_id: string;
  currentPage: number;
}) {
  const reports:Report[] = await fetchFilteredReports(drug_query_id, currentPage);

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
                  Date
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {reports?.map((report:Report) => (
                <tr
                  key={report.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    {report.id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(report.date)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <ReviewReport variant_analysis_id={variant_analysis_id} drug_query_id={drug_query_id} report_id={report.id} />
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
