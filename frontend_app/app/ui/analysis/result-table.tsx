'use client';

import { EyeIcon, InformationCircleIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Search from '../search';
import { useState, useEffect } from 'react';
import { title } from 'process';
import { list } from 'postcss';

{/**
  
  DRUG FAMILY-> drug_query_result.geneDrugGroup.standardDrugName
  DRUG STATUS-> drug_query_result.geneDrugGroup.statusDescription
  TYPE OF THERAPY-> drug_query_result.geneDrugGroup.therapy
  GENES-> drug_query_result.geneDrugGroup.gene[].geneSymbol
  VARIANTS-> variant_analysis_result.affectedGenesInfo[GENE].HGVS_cDNA+'/'+ HGVS_protein
  CONSEQUENCE-> variant_analysis_result.affectedGenesInfo[GEN].consequence
  SAMPLE VARIANT FREQUENCY-> ¿?
  CLINVAR-> variant_analysis_result.affectedGenesInfo[GEN].cosmic_id.split':'[1]? ("cosmic_id":"COSV67420943:PATHOGENIC",)
  EVIDENCE-> drug_query_result.geneDrugGroup.geneDrugInfo.drugStatusInfo
  
  */}

export default function DrugQueryResultTable(
  { query_result, cancer_types }: { query_result: any, cancer_types: string[] }) {

  const [enableFiltersView, setEnableFiltersView] = useState<boolean>(false);

  const [drug_family_list, setDrugFamilyList] = useState(new Set());
  const [drug_status_list, setDrugStatusList] = useState(new Set());
  const [type_of_therapy_list, setTypeOfTherapyList] = useState(new Set());
  const [gene_list, setGeneList] = useState(new Set());

  if (!query_result.drug_query_result || !query_result.drug_query_result.geneDrugGroup) {
    return <p>No drug data available.</p>;
  }

  useEffect(() => {
    let drug_families: Set<string> = new Set();
    let drug_status: Set<string> = new Set();
    let type_of_therapy: Set<string> = new Set();
    let gene_list: Set<string> = new Set();

    query_result.drug_query_result.geneDrugGroup
      .map((drug: any, index: number) => {
        if (drug.standardDrugName) drug_families.add(drug.standardDrugName);
        if (drug.status) drug_status.add(drug.status);
        if (drug.therapy) type_of_therapy.add(drug.therapy);
        if (drug.gene) drug.gene.map((gene: any) => {
          if (gene.geneSymbol) gene_list.add(gene.geneSymbol);
        });
        //if(drug.dScore > 0.5 && drug.gScore > 0.4) clinical_trials = ++clinical_trials;
        //if(drug.status == "CLINICAL_TRIALS" || drug.status == "EXPERIMENTAL") clinical_trials = ++clinical_trials;
        //if(drug.status == "APPROVED" && drug.cancer.includes("COLON")) clinical_trials = ++clinical_trials;
      })
    setDrugFamilyList(drug_families);
    setDrugStatusList(drug_status);
    setTypeOfTherapyList(type_of_therapy);
    setGeneList(gene_list);
  }, []);

  const mustBeVisible = (gene_drug_group: any) => {
    if (gene_drug_group.status === "CLINICAL_TRIALS" || gene_drug_group.status === "EXPERIMENTAL") return true;
    if (gene_drug_group.status === "APPROVED" && cancer_types.some(cancer => (gene_drug_group.cancer as string[]).includes(cancer))) return true;
    return false;
  }

  return (



    <div className="inline-block w-full align-middle">

      <div className="rounded-lg bg-gray-50 p-4 w-full">
        {/* <p>{JSON.stringify(query_result)}</p> */}
        {/*DRUGS RESULT TOP*/}
        <div className='flex text-left mb-4 '>
          <p className="font-medium ml-4">
            Drug results
          </p>
          <button
            type="button"
            className={`ml-4 w-7 h-7 aspect-square border-2 border-gray-300 text-black rounded-lg hover:bg-gray-300 flex items-center justify-center
              ${enableFiltersView ? 'bg-gray-300' : 'bg-gray-50'}`}
            title='Clinical reports'
            onClick={() => { setEnableFiltersView(!enableFiltersView) }}
          >
            <FunnelIcon className="h-5 w-5" />
          </button>
        </div>

        {/*DRUGS RESULT HEADER*/}
        <div className="p-[1rem] pt-0 pb-0 h-14 bg-gray-50 rounded-xl mb-4 ml-[1rem] mr-[1rem] flex items-center justify-center">
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
            <p className="text-center">Drug (family)</p>
          </div>
          <div className='w-[11rem] border-l-[2px] border-white h-full justify-center flex items-center'>
            <p className="text-center">Drug status</p>
          </div>
          <div className='w-[10rem] border-l-[2px] border-white h-full justify-center flex items-center'>
            <p className="text-center">Type of therapy</p>
          </div>
          <div className='w-[6rem] border-l-[2px] border-white h-full justify-center flex items-center'>
            <p className="text-center">Gene(s)</p>
          </div>
          <div className='w-[18rem] border-l-[2px] border-white h-full justify-center flex items-center'>
            <p className="text-center">Variant(s)</p>
          </div>
          <div className='w-[12rem] border-l-[2px] border-white h-full justify-center flex items-center'>
            <p className="text-center">Consequence</p>
          </div>
          <div className='w-[13rem] border-l-[2px] border-white h-full justify-center flex items-center'>
            <p className="text-center">Sample variant frequency</p>
          </div>
          <div className='w-[10rem] border-l-[2px] border-white h-full justify-center flex items-center'>
            <p className="text-center">ClinVar</p>
          </div>
          <div className='w-[9rem] border-l-[2px] border-white h-full justify-center flex items-center'>
            <p className="text-center">Evidence</p>
          </div>
        </div>

        {/*TODO: DO FILTERS HERE*/}

        {enableFiltersView &&
          <div className="p-[1rem] pt-[1rem] pb-[1rem] h-[20rem] bg-gray-50 rounded-xl mb-4 ml-[1rem] mr-[1rem] flex items-center justify-center">
            <div className='w-[4rem] h-full justify-center flex items-center'>
            </div>
            <div className='w-[12rem] border-l-[2px] border-white h-full justify-center flex items-center'>
              <div className='h-full w-full flex-row items-center justify-center'>
                <div className="w-full pl-[1rem] pr-[1rem] mb-[1rem]">
                  <Search placeholder="" />
                </div>
                <div className='flex-1 flex-row h-[9.5rem] overflow-y-auto'>
                  <div className='pl-[1rem] pr-[1rem] flex justify-center items-center'>
                    <p className='w-[2rem] truncate flex-1' title='EVEROLIMUS (inhibitor mTO)'>EVEROLIMUS (inhibitor mTO)</p>
                    <div className='w-[1rem] h-full flex justify-center items-center'>
                      <input
                        className="rounded-sm w-[1rem] h-[1rem] aspect-square flex items-center justify-center"
                        type="checkbox"
                        id="chb1"
                        name="chb1"
                        value="chb1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-[11rem] border-l-[2px] border-white h-full justify-center flex items-center'>
              <div className='h-full w-full flex-row items-center justify-center'>
                <div className="w-full pl-[1rem] pr-[1rem] mb-[1rem]">
                  <Search placeholder="" />
                </div>
                <div className='flex-1 flex-row h-[9.5rem] overflow-y-auto'>
                  <div className='pl-[1rem] pr-[1rem] flex justify-center items-center'>
                    <p className='w-[2rem] truncate flex-1' title='Approved for lung cancer'>Approved for lung cancer</p>
                    <div className='w-[1rem] h-full flex justify-center items-center'>
                      <input
                        className="rounded-sm w-[1rem] h-[1rem] aspect-square flex items-center justify-center"
                        type="checkbox"
                        id="chb1"
                        name="chb1"
                        value="chb1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-[10rem] border-l-[2px] border-white h-full justify-center flex items-center'>
              <div className='h-full w-full flex-row items-center justify-center'>
                <div className="w-full pl-[1rem] pr-[1rem] mb-[1rem]">
                  <Search placeholder="" />
                </div>
                <div className='flex-1 flex-row h-[9.5rem] overflow-y-auto'>
                  <div className='pl-[1rem] pr-[1rem] flex justify-center items-center'>
                    <p className='w-[2rem] truncate flex-1' title='Targeted'>Targeted</p>
                    <div className='w-[1rem] h-full flex justify-center items-center'>
                      <input
                        className="rounded-sm w-[1rem] h-[1rem] aspect-square flex items-center justify-center"
                        type="checkbox"
                        id="chb1"
                        name="chb1"
                        value="chb1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-[6rem] border-l-[2px] border-white h-full justify-center flex items-center'>
              <div className='h-full w-full flex-row items-center justify-center'>
                <div className="w-full pl-[1rem] pr-[1rem] mb-[1rem]">
                  <Search placeholder="" />
                </div>
                <div className='flex-1 flex-row h-[9.5rem] overflow-y-auto'>
                  <div className='pl-[1rem] pr-[1rem] flex justify-center items-center'>
                    <p className='w-[2rem] truncate flex-1' title='KRAS'>KRAS</p>
                    <div className='w-[1rem] h-full flex justify-center items-center'>
                      <input
                        className="rounded-sm w-[1rem] h-[1rem] aspect-square flex items-center justify-center"
                        type="checkbox"
                        id="chb1"
                        name="chb1"
                        value="chb1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-[18rem] border-l-[2px] border-white h-full justify-center flex items-center'>
              <div className='w-full h-full flex-row items-center justify-center'>
                <div className="w-full pl-[1rem] pr-[1rem] mb-[1rem]">
                  <Search placeholder="" />
                </div>
                <div className='flex-1 flex-row h-[9.5rem] overflow-y-auto'>
                  <div className='pl-[1rem] pr-[1rem] flex justify-center items-center'>
                    <p className='w-[2rem] truncate flex-1' title='c.34G>T/pGly12Cys'>c.34G{'>'}T/pGly12Cys</p>
                    <div className='w-[1rem] h-full flex justify-center items-center'>
                      <input
                        className="rounded-sm w-[1rem] h-[1rem] aspect-square flex items-center justify-center"
                        type="checkbox"
                        id="chb1"
                        name="chb1"
                        value="chb1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-[12rem] border-l-[2px] border-white h-full justify-center flex items-center'>
              <div className='h-full w-full flex-row items-center justify-center'>
                <div className="w-full pl-[1rem] pr-[1rem] mb-[1rem]">
                  <Search placeholder="" />
                </div>
                <div className='flex-1 flex-row h-[9.5rem] overflow-y-auto'>
                  <div className='pl-[1rem] pr-[1rem] flex justify-center items-center'>
                    <p className='w-[2rem] truncate flex-1' title='missense'>missense</p>
                    <div className='w-[1rem] h-full flex justify-center items-center'>
                      <input
                        className="rounded-sm w-[1rem] h-[1rem] aspect-square flex items-center justify-center"
                        type="checkbox"
                        id="chb1"
                        name="chb1"
                        value="chb1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-[13rem] border-l-[2px] border-white h-full justify-center flex items-center'>
              <div className='h-full w-full flex-row items-center justify-center'>
                <div className='flex justify-center items-center w-full pl-[1rem] pr-[1rem] mb-[1rem]' >
                  <div className="rounded-md">
                    <select
                      id="procedure"
                      name="procedure"
                      className="w-[5rem] h-[2.5rem] rounded-md border border-gray-200 text-sm outline-2 placeholder:text-gray-500"
                      aria-describedby="sample-kind-error"
                    >
                      <option value="<" >{'<'}</option>
                      <option value=">" >{'>'}</option>
                      <option value="=" >{'='}</option>
                      <option value="<=" >{'<='}</option>
                      <option value=">=" >{'>='}</option>
                    </select>
                  </div>
                  <div className='w-full'>
                    <Search placeholder="" />
                  </div>
                </div>
                <div className='flex-1 flex-row h-[9.5rem] overflow-y-auto'>
                  <div className='pl-[1rem] pr-[1rem] flex justify-center items-center'>
                    <p className='w-[2rem] truncate flex-1' title='missense'>missense</p>
                    <div className='w-[1rem] h-full flex justify-center flex items-center'>
                      <input
                        className="rounded-sm w-[1rem] h-[1rem] aspect-square flex items-center justify-center"
                        type="checkbox"
                        id="chb1"
                        name="chb1"
                        value="chb1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-[10rem] border-l-[2px] border-white h-full justify-center flex items-center'>
              <div className='h-full w-full flex-row items-center justify-center'>
                <div className="w-full pl-[1rem] pr-[1rem] mb-[1rem]">
                  <Search placeholder="" />
                </div>
                <div className='flex-1 flex-row h-[9.5rem] overflow-y-auto'>
                  <div className='pl-[1rem] pr-[1rem] flex justify-center items-center'>
                    <p className='w-[2rem] truncate flex-1' title='Pathogenic'>Pathogenic</p>
                    <div className='w-[1rem] h-full flex justify-center items-center'>
                      <input
                        className="rounded-sm w-[1rem] h-[1rem] aspect-square flex items-center justify-center"
                        type="checkbox"
                        id="chb1"
                        name="chb1"
                        value="chb1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-[9rem] border-l-[2px] border-white h-full'>
              <div className='h-full flex-row'>
                <div className='h-full w-full flex-row items-center justify-center'>
                  <div className="w-full pr-[1rem] pl-[1rem] mb-[1rem]">
                    <Search placeholder="" />
                  </div>
                  <div className='flex-1 flex-row h-[9.5rem] overflow-y-auto'>
                    <div className='pl-[1rem] pr-[1rem] w-full flex justify-center items-center'>
                      <p className='w-[2rem] truncate flex-1' title='FDA'>FDA</p>
                      <div className='w-[1rem] h-full flex justify-center flex items-center'>
                        <input
                          className="rounded-sm w-[1rem] h-[1rem] aspect-square flex items-center justify-center"
                          type="checkbox"
                          id="chb1"
                          name="chb1"
                          value="chb1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        }

        {/*END TODO FILTERS*/}


        <div id='sensitivity' className="h-full w-full flex-row rounded-lg bg-green-100 p-[1rem]  mb-4 ">
          <p className="font-medium ml-4 mb-4 ">Drug response: Sensitivity</p>



          {
            query_result.drug_query_result.geneDrugGroup
              .filter((drug: any) => drug.geneDrugInfo.every((info: any) => info.sensitivity.includes("SENSITIVITY")))
              .map((drug: any, index: number) => (mustBeVisible(drug) &&
                
                <div key={drug.standardDrugName} className={`pl-[1rem] pr-[1rem] w-full h-auto min-h-[9rem] 
              ${index % 2 === 1 ? "bg-green-100" : "bg-green-50"} 
              flex items-center pt-[1rem] pb-[1rem] justify-center`}> {/* (h-3*nlines) */}


                  <div className='w-[4rem] h-full justify-center flex items-center'>
                    <input
                      className="rounded-sm w-7 h-7 aspect-square"
                      type="checkbox"
                      id="chb1"
                      name="chb1"
                      value="chb1"
                    /*checked={false}*/
                    /*onChange={}*/
                    />
                  </div>

                  <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
                    <div className='flex-row items-center break-all line-clamp-3 text-center'>
                      <p title={drug.standardDrugName}>{drug.standardDrugName}</p>
                    </div>
                  </div>

                  <div className='w-[11rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
                    <div className='flex-row items-center line-clamp-3 text-center'>
                      <p title={drug.statusDescription ? drug.statusDescription : 'no data'}>{drug.statusDescription ? drug.statusDescription : 'no data'}</p>
                    </div>
                  </div>

                  <div className='w-[10rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
                    <div className='flex items-center break-all line-clamp-3 text-center'>
                      <p
                        title={
                          drug.therapy?.includes('TARGETED') ? 'Targeted' :
                            drug.therapy?.includes('COMBINATION') ? 'Combination' :
                              drug.therapy ? drug.therapy :
                                'no data'
                        }
                      >{
                          drug.therapy?.includes('TARGETED') ? 'Targeted' :
                            drug.therapy?.includes('COMBINATION') ? 'Combination' :
                              drug.therapy ? drug.therapy :
                                'no data'}</p>
                    </div>
                  </div>
                  <div className='w-[6rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
                    <div className='flex-row items-center break-all text-center'>
                      {drug.gene.map((gene: any) => (
                        <p key={'symbol' + gene.geneSymbol}>{gene.geneSymbol}</p>
                      ))}
                    </div>
                  </div>
                  <div className='w-[18rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
                    <div className='flex-row items-center truncate text-center'>

                      {drug.gene.map((gene: any) => (
                        <p
                          className='truncate'
                          key={'HGVS' + gene.geneSymbol}
                          title={
                            query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.HGVS_cDNA +
                            ' / ' +
                            query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.HGVS_protein
                          }
                        >{
                            query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.HGVS_cDNA +
                            ' / ' +
                            query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.HGVS_protein
                          }</p>
                      ))}

                    </div>
                  </div>

                  <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
                    <div className='flex-row items-center truncate text-center'>
                      {drug.gene.map((gene: any) => (
                        <p
                          className='truncate'
                          key={'consequence_' + gene.geneSymbol}
                          title={query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.consequence}
                        >{
                            query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.consequence
                          }</p>
                      ))}
                    </div>
                  </div>

                  <div className='w-[13rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
                    <div className='flex-row items-center'>

                      {drug.gene.map((gene: any) => (
                        <p key={'frequency_' + gene.geneSymbol}>{
                          '0.1 (1/10)'
                        }</p>
                      ))}
                    </div>
                  </div>

                  <div className='w-[10rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
                    <div className='flex-row items-center truncate text-center'>

                      {drug.gene.map((gene: any) => (
                        <p
                          className='truncate'
                          title={
                            query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.cosmic_id ?
                              query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.cosmic_id?.split(':')[1] ?
                                query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.cosmic_id?.split(':')[1]
                                : query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.cosmic_id
                              : 'No data'
                          }
                          key={'CLINVAR_' + gene.geneSymbol}>{
                            query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.cosmic_id ?
                              query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.cosmic_id?.split(':')[1] ?
                                query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.cosmic_id?.split(':')[1]
                                : query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.cosmic_id
                              : 'No data'
                          }</p>
                      ))}

                    </div>
                  </div>
                  <div className='w-[9rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
                    <div className='flex-row items-center truncate text-center'>


                      {drug.geneDrugInfo.map((info: any, index: number) => (

                        < p className='truncate' key={'info_' + index} >
                          {info.drugStatusInfo?.includes('FDA') ? 'FDA'
                            : info.drugStatusInfo?.includes('Clinical Trials') ? 'Clinical Trials'
                              : info.drugStatusInfo ? info.drugStatusInfo : 'no data'}
                        </p>


                      ))}



                    </div>
                  </div>
                </div>

              ))
          }















        </div>



        <div id='resistance' className="h-full w-full flex-row rounded-lg bg-orange-100 p-4 mb-4">
          <p className="font-medium ml-4 mb-4 ">Drug response: Resistance / both</p>



          {
            query_result.drug_query_result.geneDrugGroup
              .filter((drug: any) => drug.geneDrugInfo.some((info: any) => info.sensitivity.includes("RESISTANCE")))
              .map((drug: any, index: number) => (

                <div key={drug.standardDrugName} className={`pl-4 pr-4 w-full h-[9rem] 
              ${index % 2 === 1 ? "bg-orange-100" : "bg-orange-50"} 
              flex items-center pt-[1rem] pb-[1rem] justify-center`}> {/* (h-3*nlines) */}


                  <div className='w-[4rem] h-full justify-center flex items-center'>
                    <input
                      className="rounded-sm w-7 h-7 aspect-square"
                      type="checkbox"
                      id="chb1"
                      name="chb1"
                      value="chb1"
                    /*checked={false}*/
                    /*onChange={}*/
                    />
                  </div>

                  <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
                    <div className='flex-row items-center break-all line-clamp-3 text-center'>
                      <p title={drug.standardDrugName}>{drug.standardDrugName}</p>
                    </div>
                  </div>

                  <div className='w-[11rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
                    <div className='flex-row items-center line-clamp-3 text-center'>
                      <p title={drug.statusDescription ? drug.statusDescription : 'no data'}>{drug.statusDescription ? drug.statusDescription : 'no data'}</p>
                    </div>
                  </div>

                  <div className='w-[10rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
                    <div className='flex items-center break-all line-clamp-3 text-center'>
                      <p
                        title={
                          drug.therapy?.includes('TARGETED') ? 'Targeted' :
                            drug.therapy?.includes('COMBINATION') ? 'Combination' :
                              drug.therapy ? drug.therapy :
                                'no data'
                        }
                      >{
                          drug.therapy?.includes('TARGETED') ? 'Targeted' :
                            drug.therapy?.includes('COMBINATION') ? 'Combination' :
                              drug.therapy ? drug.therapy :
                                'no data'}</p>
                    </div>
                  </div>
                  <div className='w-[6rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
                    <div className='flex-row items-center break-all text-center'>
                      {drug.gene.map((gene: any) => (
                        <p key={'symbol' + gene.geneSymbol}>{gene.geneSymbol}</p>
                      ))}
                    </div>
                  </div>
                  <div className='w-[18rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
                    <div className='flex-row items-center truncate text-center'>

                      {drug.gene.map((gene: any) => (
                        <p
                          className='truncate'
                          key={'HGVS' + gene.geneSymbol}
                          title={
                            query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.HGVS_cDNA +
                            ' / ' +
                            query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.HGVS_protein
                          }
                        >{
                            query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.HGVS_cDNA +
                            ' / ' +
                            query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.HGVS_protein
                          }</p>
                      ))}

                    </div>
                  </div>

                  <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
                    <div className='flex-row items-center truncate text-center'>
                      {drug.gene.map((gene: any) => (
                        <p
                          className='truncate'
                          key={'consequence_' + gene.geneSymbol}
                          title={query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.consequence}
                        >{
                            query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.consequence
                          }</p>
                      ))}
                    </div>
                  </div>

                  <div className='w-[13rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
                    <div className='flex-row items-center'>

                      {drug.gene.map((gene: any) => (
                        <p key={'frequency_' + gene.geneSymbol}>{
                          '0.1 (1/10)'
                        }</p>
                      ))}
                    </div>
                  </div>

                  <div className='w-[10rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
                    <div className='flex-row items-center truncate text-center'>

                      {drug.gene.map((gene: any) => (
                        <p
                          className='truncate'
                          title={
                            query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.cosmic_id ?
                              query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.cosmic_id?.split(':')[1] ?
                                query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.cosmic_id?.split(':')[1]
                                : query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.cosmic_id
                              : 'No data'
                          }
                          key={'CLINVAR_' + gene.geneSymbol}>{
                            query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.cosmic_id ?
                              query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.cosmic_id?.split(':')[1] ?
                                query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.cosmic_id?.split(':')[1]
                                : query_result.variant_analysis_result?.affectedGenesInfo?.[gene.geneSymbol]?.cosmic_id
                              : 'No data'
                          }</p>
                      ))}

                    </div>
                  </div>
                  <div className='w-[9rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
                    <div className='flex-row items-center truncate text-center'>


                      {drug.geneDrugInfo.map((info: any, index: number) => (

                        < p className='truncate' key={'info_' + index} >
                          {info.drugStatusInfo?.includes('FDA') ? 'FDA'
                            : info.drugStatusInfo?.includes('Clinical Trials') ? 'Clinical Trials'
                              : info.drugStatusInfo ? info.drugStatusInfo : 'no data'}
                        </p>


                      ))}



                    </div>
                  </div>
                </div>

              ))
          }

        </div>



      </div>


    </div >
  );
}
