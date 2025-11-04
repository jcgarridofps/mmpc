import { fetchDrugQueryResult, fetchVariantAnalysisResult, fetchPresence } from '@/app/lib/data';
import { EyeIcon, InformationCircleIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Search from '../search';
import DrugQueryResultTable from './result-table';
import DrugQueryResultGenesPanel from './result-genes-panel';



export default async function DrugQueryResult(
  { analysis_id, annotation_id }: { analysis_id: string, annotation_id: string }) {
  const analysis_result: any = await fetchDrugQueryResult(analysis_id);
  const annotation_result: any = await fetchVariantAnalysisResult(annotation_id);
  const affected_genes: string[] = annotation_result.affectedGenes;
  const n_variants: Number = annotation_result.variantsInInput;
  const presence = await fetchPresence(affected_genes);
  const cancer_types: string = "Breast, Colon";

  return (



    <div className="mt-6 flow-root">

      <DrugQueryResultGenesPanel affected_genes={affected_genes} presence={presence} n_variants={n_variants} />

      <div className="p-4 pl-4 w-full h-14 bg-gray-50 rounded-xl mb-4 flex justify-between items-center">
        <p className="text-left w-full">{`Selected cancer types: ${cancer_types}`}.</p>
      </div>

      <DrugQueryResultTable query_result={{ "drug_query_result": analysis_result, "variant_analysis_result": annotation_result, "presence": presence }} />

{/*       <div className='mt-16'>
        <pre>
          <code>
            {JSON.stringify({ "drug_query_result": drug_query_result, "variant_analysis_result": variant_analysis_result, "presence": presence }, null, 2)}
          </code>
        </pre>
      </div> */}


    </div>
  );
}
