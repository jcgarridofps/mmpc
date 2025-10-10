import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
//import { LatestInvoice } from '@/app/lib/definitions';
import { fetchLatestDrugQueries } from '@/app/lib/data';
import { formatDateToLocal } from '@/app/lib/utils';

export type Analysis = {
  id: string;
  appId: string;
  cancer_types: string;
  date: string;
  type: AnalysisType;
  //annotation: Annotation;
  status: ComputationStatus;
  version: ComputationVersion;
};

export default async function LatestDrugQueries(){

  const latestDrugQueries: DrugQuery[] = await fetchLatestDrugQueries();

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <h3 className="pb-4 ml-2 text-sm font-medium">Latest analyses</h3>

        <div className="bg-white px-6 rounded-xl">
          {latestDrugQueries.map((query, i) => {
            return (
              <div
                key={query.id}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div className="flex items-center">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {query.id}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {formatDateToLocal(query.date)}
                    </p>
                  </div>
                </div>
                <p
                  className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                >
                  {query.status}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
