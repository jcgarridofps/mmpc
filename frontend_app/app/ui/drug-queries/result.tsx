import { fetchDrugQueryResult, fetchVariantAnalysisResult, fetchPresence } from '@/app/lib/data';
import { EyeIcon, InformationCircleIcon, FunnelIcon } from '@heroicons/react/24/outline';



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

      <div className="inline-block w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-4">

          {/*DRUGS RESULT TOP*/}
          <div className='flex text-left mb-4 '>
            <p className="font-medium ml-4">
              Drug results
            </p>
            <button
              type="button"
              className="ml-4 w-7 h-7 aspect-square border-2 border-gray-300 bg-gray-50 text-black rounded-lg hover:bg-gray-300 flex items-center justify-center"
              title='Clinical reports'
            //onClick={}
            >
              <FunnelIcon className="h-5 w-5" />
            </button>
          </div>

          {/*DRUGS RESULT HEADER*/}
          <div className="p-4 pt-0 pb-0 pl-4 w-full h-14 bg-gray-50 rounded-xl mb-4 flex items-center">
            <div className='w-[4rem] h-full justify-center flex items-center'>
              <input
                  className="rounded-sm w-7 h-7 aspect-square flex items-center justify-center"
                type="checkbox"
                id="chb1"
                name="chb1"
                value="chb1"
                /*checked={false}*/
                /*onChange={}*/
              />
            </div>
            <div className='w-[12rem] border-l-[2px] border-white h-full justify-center flex items-center'>
              <p className="text-left ml-4">Drug (family)</p>
            </div>
            <div className='w-[12rem] border-l-[2px] border-white h-full justify-center flex items-center'>
              <p className="text-left ml-4">Drug status</p>
            </div>
            <div className='w-[12rem] border-l-[2px] border-white h-full justify-center flex items-center'>
              <p className="text-left ml-4">Type of therapy</p>
            </div>
            <div className='w-[12rem] border-l-[2px] border-white h-full justify-center flex items-center'>
              <p className="text-left ml-4">Gene(s)</p>
            </div>
            <div className='w-[12rem] border-l-[2px] border-white h-full justify-center flex items-center'>
              <p className="text-left ml-4">Variant(s)</p>
            </div>
            <div className='w-[12rem] border-l-[2px] border-white h-full justify-center flex items-center'>
              <p className="text-left ml-4">Consequence</p>
            </div>
            <div className='w-[12rem] border-l-[2px] border-white h-full justify-center flex items-center'>
              <p className="text-left ml-4">Sample variant frequency</p>
            </div>
            <div className='w-[12rem] border-l-[2px] border-white h-full justify-center flex items-center'>
              <p className="text-left ml-4">ClinVar</p>
            </div>
            <div className='w-[12rem] border-l-[2px] border-white h-full justify-center flex items-center'>
              <p className="text-left ml-4">Evidence</p>
            </div>
          </div>

          {/*TODO: DO FILTERS HERE*/}

          <p className="font-medium ml-4 mb-4 ">Drug response: Sensitivity</p>

          <div className="rounded-lg bg-green-100 p-4 mb-4">

          </div>

          <p className="font-medium ml-4 mb-4 ">Drug response: Resistance</p>

          <div className="rounded-lg bg-orange-100 p-4 mb-4">

          </div>

          <div className='mt-16'>
            <pre>
              <code>
                {JSON.stringify({ "drug_query_result": drug_query_result, "variant_analysis_result": variant_analysis_result, "presence": presence }, null, 2)}
              </code>
            </pre>
          </div>
        </div>
      </div>



    </div>
  );
}
