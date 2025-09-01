import { fetchDrugQueryResult, fetchVariantAnalysisResult, fetchPresence } from '@/app/lib/data';
import { EyeIcon, InformationCircleIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Search from '../search';
import DrugQueryResultTable from './result-table';



export default async function DrugQueryResult(
  { query_id, analysis_id }: { query_id: string, analysis_id: string }) {
  const drug_query_result: JSON = await fetchDrugQueryResult(query_id);
  const variant_analysis_result: JSON = await fetchVariantAnalysisResult(analysis_id);
  const affected_genes: string[] = JSON.parse(JSON.stringify(variant_analysis_result)).affectedGenes;
  const presence = await fetchPresence(affected_genes);
  const cancer_types: string = "Breast, Colon";

  return (



    <div className="mt-6 flow-root">

      <div className="p-4 pt-0 pb-0 pl-4 w-full h-14 bg-gray-50 rounded-xl mb-4 flex justify-between items-center">
        <div className='flex-1 h-full justify-center flex items-center'>
          <p className="text-left ml-4">Sequenced genes:.</p>
          <button
            type="button"
            className="ml-4 w-7 h-7 aspect-square border-2 border-gray-300 bg-gray-50 text-black rounded-lg hover:bg-gray-300 flex items-center justify-center"
            title='Clinical reports'
          //onClick={}
          >
            <EyeIcon className="h-5 w-5" />
          </button>
        </div>
        <div className='flex-1 border-l-[2px] border-white h-full justify-center flex items-center'>
          <p className="text-left ml-4">Variants:.</p>
          <button
            type="button"
            className="ml-4 w-7 h-7 aspect-square border-2 border-gray-300 bg-gray-50 text-black rounded-lg hover:bg-gray-300 flex items-center justify-center"
            title='Clinical reports'
          //onClick={}
          >
            <EyeIcon className="h-5 w-5" />
          </button>
        </div>
        <div className='flex-1 border-l-[2px] border-white h-full justify-center flex items-center'>
          <p className="text-left ml-4">Affected genes:.</p>
          <button
            type="button"
            className="ml-4 w-7 h-7 aspect-square border-2 border-gray-300 bg-gray-50 text-black rounded-lg hover:bg-gray-300 flex items-center justify-center"
            title='Clinical reports'
          //onClick={}
          >
            <EyeIcon className="h-5 w-5" />
          </button>
        </div>
        <div className='flex-1 border-l-[2px] border-white h-full justify-center flex items-center'>
          <p className="text-left ml-4">Genes analyzed:.</p>
          <button
            type="button"
            className="ml-4 w-7 h-7 aspect-square border-2 border-gray-300 bg-gray-50 text-black rounded-lg hover:bg-gray-300 flex items-center justify-center"
            title='Clinical reports'
          //onClick={}
          >
            <EyeIcon className="h-5 w-5" />
          </button>
        </div>
        <div className='flex-1 border-l-[2px] border-white h-full justify-center flex items-center'>
          <p className="text-left ml-4">Genes excluded:.</p>
          <button
            type="button"
            className="ml-4 w-7 h-7 aspect-square border-2 border-gray-300 bg-gray-50 text-black rounded-lg hover:bg-gray-300 flex items-center justify-center"
            title='Clinical reports'
          //onClick={}
          >
            <EyeIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="p-4 pl-4 w-full h-14 bg-gray-50 rounded-xl mb-4 flex justify-between items-center">
        <p className="text-left w-full ml-4">{`Selected cancer types: ${cancer_types}`}.</p>
      </div>

      <DrugQueryResultTable query_result={JSON.stringify({ "drug_query_result": drug_query_result, "variant_analysis_result": variant_analysis_result, "presence": presence }, null, 2)}/>

      <div className='mt-16'>
            <pre>
              <code>
                {JSON.stringify({ "drug_query_result": drug_query_result, "variant_analysis_result": variant_analysis_result, "presence": presence }, null, 2)}
              </code>
            </pre>
          </div>


    </div>
  );
}
