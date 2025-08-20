import { fetchDrugQueryResult, fetchVariantAnalysisResult, fetchPresence } from '@/app/lib/data';



export default async function DrugQueryResult(
  { query_id, analysis_id }: { query_id: string, analysis_id: string })
 {
  const drug_query_result:JSON = await fetchDrugQueryResult(query_id);
  const variant_analysis_result:JSON = await fetchVariantAnalysisResult(analysis_id);
  const affected_genes:string[] = JSON.parse(JSON.stringify(variant_analysis_result)).affectedGenes;
  const presence = await fetchPresence(affected_genes);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div>
            <pre>
                <code>
                    {JSON.stringify({"drug_query_result": drug_query_result, "variant_analysis_result": variant_analysis_result, "presence":presence}, null, 2)}
                </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
