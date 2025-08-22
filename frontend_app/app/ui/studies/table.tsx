import { formatDateToLocal } from '@/app/lib/utils';
import { fetchFilteredVariantAnalysis } from '@/app/lib/data';
// import { ReviewAnalysis } from './buttons';

export type VariantAnalysis = {
  id: string;
  description: string;
  date: string;
  status: string;
};

export default async function DataTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const variant_analysis:VariantAnalysis[] = await fetchFilteredVariantAnalysis(query, currentPage);


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
              {variant_analysis?.map((analysis:VariantAnalysis) => (
                <tr
                  key={analysis.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-3 py-3 pl-6">
                    {analysis.id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 pl-6"
                  title={analysis.description}
                  >
                    {analysis.description}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(analysis.date)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      {/* <ReviewAnalysis id={analysis.id} /> */}
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
