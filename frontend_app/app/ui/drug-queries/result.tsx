import { fetchDrugQueryResult, fetchVariantAnalysisResult, fetchPresence } from '@/app/lib/data';
import { EyeIcon, InformationCircleIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Search from '../search';
import DrugQueryResultTable from './result-table';
import DrugQueryResultGenesPanel from './result-genes-panel';



export default async function DrugQueryResult(
  { query_id, analysis_id }: { query_id: string, analysis_id: string }) {
  const drug_query_result: JSON = await fetchDrugQueryResult(query_id);
  const variant_analysis_result: JSON = await fetchVariantAnalysisResult(analysis_id);
  const affected_genes: string[] = JSON.parse(JSON.stringify(variant_analysis_result)).affectedGenes;
  const presence = await fetchPresence(affected_genes);
  const cancer_types: string = "Breast, Colon";

  return (



    <div className="mt-6 flow-root">

      <DrugQueryResultGenesPanel affected_genes={affected_genes} presence={presence}/>      

      <div className="p-4 pl-4 w-full h-14 bg-gray-50 rounded-xl mb-4 flex justify-between items-center">
        <p className="text-left w-full">{`Selected cancer types: ${cancer_types}`}.</p>
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
