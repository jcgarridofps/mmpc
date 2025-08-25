import { formatDateToLocal } from '@/app/lib/utils';
import { fetchFilteredDrugQueries } from '@/app/lib/data';
import { ReviewDrugQuery } from './buttons';
import { DrugQuery } from '../dashboard/latest-drug-queries';

export type VariantAnalysis = {
  id: string;
  description: string;
  date: string;
  status: string;
};

export default async function DrugQueriesTable({
  query,
  currentPage,
  variant_analysis,
}: {
  query: string;
  currentPage: number;
  variant_analysis: string;
}) {
  const drug_queries:DrugQuery[] = await fetchFilteredDrugQueries(query, currentPage, variant_analysis);
  console.log(JSON.stringify(drug_queries));

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
              {drug_queries?.map((drug_query:DrugQuery) => (
                <tr
                  key={drug_query.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{drug_query.id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{drug_query.cancer_types}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(drug_query.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-red-700">
                    OUTDATED
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {drug_query.status}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className={drug_query.status != "PROCESSED" ? "hidden" : "flex justify-end gap-3"} >
                      <ReviewDrugQuery id={variant_analysis} query_id={drug_query.id}/>
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
