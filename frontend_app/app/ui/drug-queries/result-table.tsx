'use client';

import { EyeIcon, InformationCircleIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Search from '../search';
import { useState } from 'react';



export default function DrugQueryResultTable(
  { query_result }: { query_result: string }) {

  const [enableFiltersView, setEnableFiltersView] = useState<boolean>(false);

  return (



    <div className="inline-block w-full align-middle">
      <div className="rounded-lg bg-gray-50 p-4 w-full">

        {/*DRUGS RESULT TOP*/}
        <div className='flex text-left mb-4 '>
          <p className="font-medium ml-4">
            Drug results
          </p>
          <button
            type="button"
            className={`ml-4 w-7 h-7 aspect-square border-2 border-gray-300 text-black rounded-lg hover:bg-gray-300 flex items-center justify-center
              ${enableFiltersView ? 'bg-gray-300':'bg-gray-50'}`}
            title='Clinical reports'
            onClick={()=>{setEnableFiltersView(!enableFiltersView)}}
          >
            <FunnelIcon className="h-5 w-5" />
          </button>
        </div>

        {/*DRUGS RESULT HEADER*/}
        <div className="p-4 pt-0 pb-0 h-14 bg-gray-50 rounded-xl mb-4 ml-4 mr-4 flex items-center">
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
          <div className='w-[12rem] border-l-[2px] border-white h-full justify-center flex items-center'>
            <p className="text-center">Drug status</p>
          </div>
          <div className='w-[12rem] border-l-[2px] border-white h-full justify-center flex items-center'>
            <p className="text-center">Type of therapy</p>
          </div>
          <div className='w-[12rem] border-l-[2px] border-white h-full justify-center flex items-center'>
            <p className="text-center">Gene(s)</p>
          </div>
          <div className='w-[24rem] border-l-[2px] border-white h-full justify-center flex items-center'>
            <p className="text-center">Variant(s)</p>
          </div>
          <div className='w-[12rem] border-l-[2px] border-white h-full justify-center flex items-center'>
            <p className="text-center">Consequence</p>
          </div>
          <div className='w-[12rem] border-l-[2px] border-white h-full justify-center flex items-center'>
            <p className="text-center">Sample variant frequency</p>
          </div>
          <div className='w-[12rem] border-l-[2px] border-white h-full justify-center flex items-center'>
            <p className="text-center">ClinVar</p>
          </div>
          <div className='w-[12rem] border-l-[2px] border-white h-full justify-center flex items-center'>
            <p className="text-center">Evidence</p>
          </div>
        </div>

        {/*TODO: DO FILTERS HERE*/}

        {enableFiltersView &&
          <div className="p-4 pt-[1rem] pb-[1rem] h-[20rem] bg-gray-50 rounded-xl mb-4 ml-4 mr-4 flex">
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
            <div className='w-[12rem] border-l-[2px] border-white h-full justify-center flex items-center'>
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
            <div className='w-[12rem] border-l-[2px] border-white h-full justify-center flex items-center'>
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
            <div className='w-[12rem] border-l-[2px] border-white h-full justify-center flex items-center'>
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
            <div className='w-[24rem] border-l-[2px] border-white h-full justify-center flex items-center'>
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
            <div className='w-[12rem] border-l-[2px] border-white h-full justify-center flex items-center'>
              <div className='h-full w-full flex-row items-center justify-center'>
                <div className='flex justify-center items-center w-full pl-[1rem] pr-[1rem] mb-[1rem]' >
                  <div className="rounded-md">
                    <select
                      id="procedure"
                      name="procedure"
                      className="w-[4rem] h-[2.5rem] rounded-md border border-gray-200 text-sm outline-2 placeholder:text-gray-500"
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
            <div className='w-[12rem] border-l-[2px] border-white h-full justify-center flex items-center'>
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
            <div className='w-[12rem] border-l-[2px] border-white h-full'>
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


        <div className="h-full w-full flex-row rounded-lg bg-green-100 p-4 mb-4">
          <p className="font-medium ml-4 mb-4 ">Drug response: Sensitivity</p>
          <div className="pl-4 pr-4 w-full h-[9rem] bg-green-100 flex items-center pt-[1rem] pb-[1rem] justify-center"> {/* (h-3*nlines) */}
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
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p>EVEROLIMUS</p>
                <p>(inhibitor mTo)</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p>Approved for lung cancer</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex items-center'>
                <p>Targeted</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p>KRAS</p>
                <p>MTOR</p>
                <p>PTEN</p>
              </div>
            </div>
            <div className='w-[24rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p >c.34G{'>'}T / p.Gly12Cys</p>
                <p >c.34G{'>'}T / p.Gly12Cys</p>
                <p >c.34G{'>'}T / p.Gly12Cys</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">missense</p>
                <p className="flex items-center">stop_gained</p>
                <p className="flex items-center">splice_acceptor</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">0.1 (1/10)</p>
                <p className="flex items-center">0.1 (1/10)</p>
                <p className="flex items-center">0.1 (1/10)</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">Pathogenic</p>
                <p className="flex items-center">Pathogenic</p>
                <p className="flex items-center">Pathogenic</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">FDA</p>
              </div>
            </div>
          </div>




          <div className="pl-4 pr-4 w-full h-[9rem] bg-green-50 flex items-center pt-[1rem] pb-[1rem] justify-center"> {/* (h-3*nlines) */}
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
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p>EVEROLIMUS</p>
                <p>(inhibitor mTo)</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p>Approved for lung cancer</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex items-center'>
                <p>Targeted</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p>KRAS</p>
                <p>MTOR</p>
                <p>PTEN</p>
              </div>
            </div>
            <div className='w-[24rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p >c.34G{'>'}T / p.Gly12Cys</p>
                <p >c.34G{'>'}T / p.Gly12Cys</p>
                <p >c.34G{'>'}T / p.Gly12Cys</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">missense</p>
                <p className="flex items-center">stop_gained</p>
                <p className="flex items-center">splice_acceptor</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">0.1 (1/10)</p>
                <p className="flex items-center">0.1 (1/10)</p>
                <p className="flex items-center">0.1 (1/10)</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">Pathogenic</p>
                <p className="flex items-center">Pathogenic</p>
                <p className="flex items-center">Pathogenic</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">FDA</p>
              </div>
            </div>
          </div>
          <div className="pl-4 pr-4 w-full h-[9rem] bg-green-100 flex items-center pt-[1rem] pb-[1rem] justify-center"> {/* (h-3*nlines) */}
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
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p>EVEROLIMUS</p>
                <p>(inhibitor mTo)</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p>Approved for lung cancer</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex items-center'>
                <p>Targeted</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p>KRAS</p>
                <p>MTOR</p>
                <p>PTEN</p>
              </div>
            </div>
            <div className='w-[24rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p >c.34G{'>'}T / p.Gly12Cys</p>
                <p >c.34G{'>'}T / p.Gly12Cys</p>
                <p >c.34G{'>'}T / p.Gly12Cys</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">missense</p>
                <p className="flex items-center">stop_gained</p>
                <p className="flex items-center">splice_acceptor</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">0.1 (1/10)</p>
                <p className="flex items-center">0.1 (1/10)</p>
                <p className="flex items-center">0.1 (1/10)</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">Pathogenic</p>
                <p className="flex items-center">Pathogenic</p>
                <p className="flex items-center">Pathogenic</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">FDA</p>
              </div>
            </div>
          </div>
          <div className="pl-4 pr-4 w-full h-[9rem] bg-green-50 flex items-center pt-[1rem] pb-[1rem] justify-center"> {/* (h-3*nlines) */}
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
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p>EVEROLIMUS</p>
                <p>(inhibitor mTo)</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p>Approved for lung cancer</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex items-center'>
                <p>Targeted</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p>KRAS</p>
                <p>MTOR</p>
                <p>PTEN</p>
              </div>
            </div>
            <div className='w-[24rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p >c.34G{'>'}T / p.Gly12Cys</p>
                <p >c.34G{'>'}T / p.Gly12Cys</p>
                <p >c.34G{'>'}T / p.Gly12Cys</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">missense</p>
                <p className="flex items-center">stop_gained</p>
                <p className="flex items-center">splice_acceptor</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">0.1 (1/10)</p>
                <p className="flex items-center">0.1 (1/10)</p>
                <p className="flex items-center">0.1 (1/10)</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">Pathogenic</p>
                <p className="flex items-center">Pathogenic</p>
                <p className="flex items-center">Pathogenic</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">FDA</p>
              </div>
            </div>
          </div>









        </div>



        <div className="h-full w-full flex-row rounded-lg bg-orange-100 p-4 mb-4">
          <p className="font-medium ml-4 mb-4 ">Drug response: Resistance</p>
          <div className="pl-4 pr-4 w-full h-[9rem] bg-orange-100 flex items-center pt-[1rem] pb-[1rem] justify-center"> {/* (h-3*nlines) */}
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
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p>EVEROLIMUS</p>
                <p>(inhibitor mTo)</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p>Approved for lung cancer</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex items-center'>
                <p>Targeted</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p>KRAS</p>
                <p>MTOR</p>
                <p>PTEN</p>
              </div>
            </div>
            <div className='w-[24rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p >c.34G{'>'}T / p.Gly12Cys</p>
                <p >c.34G{'>'}T / p.Gly12Cys</p>
                <p >c.34G{'>'}T / p.Gly12Cys</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">missense</p>
                <p className="flex items-center">stop_gained</p>
                <p className="flex items-center">splice_acceptor</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">0.1 (1/10)</p>
                <p className="flex items-center">0.1 (1/10)</p>
                <p className="flex items-center">0.1 (1/10)</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">Pathogenic</p>
                <p className="flex items-center">Pathogenic</p>
                <p className="flex items-center">Pathogenic</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">FDA</p>
              </div>
            </div>
          </div>




          <div className="pl-4 pr-4 w-full h-[9rem] bg-orange-50 flex items-center pt-[1rem] pb-[1rem] justify-center"> {/* (h-3*nlines) */}
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
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p>EVEROLIMUS</p>
                <p>(inhibitor mTo)</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p>Approved for lung cancer</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex items-center'>
                <p>Targeted</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p>KRAS</p>
                <p>MTOR</p>
                <p>PTEN</p>
              </div>
            </div>
            <div className='w-[24rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p >c.34G{'>'}T / p.Gly12Cys</p>
                <p >c.34G{'>'}T / p.Gly12Cys</p>
                <p >c.34G{'>'}T / p.Gly12Cys</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">missense</p>
                <p className="flex items-center">stop_gained</p>
                <p className="flex items-center">splice_acceptor</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">0.1 (1/10)</p>
                <p className="flex items-center">0.1 (1/10)</p>
                <p className="flex items-center">0.1 (1/10)</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">Pathogenic</p>
                <p className="flex items-center">Pathogenic</p>
                <p className="flex items-center">Pathogenic</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">FDA</p>
              </div>
            </div>
          </div>
          <div className="pl-4 pr-4 w-full h-[9rem] bg-orange-100 flex items-center pt-[1rem] pb-[1rem] justify-center"> {/* (h-3*nlines) */}
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
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p>EVEROLIMUS</p>
                <p>(inhibitor mTo)</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p>Approved for lung cancer</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex items-center'>
                <p>Targeted</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p>KRAS</p>
                <p>MTOR</p>
                <p>PTEN</p>
              </div>
            </div>
            <div className='w-[24rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p >c.34G{'>'}T / p.Gly12Cys</p>
                <p >c.34G{'>'}T / p.Gly12Cys</p>
                <p >c.34G{'>'}T / p.Gly12Cys</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">missense</p>
                <p className="flex items-center">stop_gained</p>
                <p className="flex items-center">splice_acceptor</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">0.1 (1/10)</p>
                <p className="flex items-center">0.1 (1/10)</p>
                <p className="flex items-center">0.1 (1/10)</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">Pathogenic</p>
                <p className="flex items-center">Pathogenic</p>
                <p className="flex items-center">Pathogenic</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">FDA</p>
              </div>
            </div>
          </div>
          <div className="pl-4 pr-4 w-full h-[9rem] bg-orange-50 flex items-center pt-[1rem] pb-[1rem] justify-center"> {/* (h-3*nlines) */}
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
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p>EVEROLIMUS</p>
                <p>(inhibitor mTo)</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p>Approved for lung cancer</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex items-center'>
                <p>Targeted</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p>KRAS</p>
                <p>MTOR</p>
                <p>PTEN</p>
              </div>
            </div>
            <div className='w-[24rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p >c.34G{'>'}T / p.Gly12Cys</p>
                <p >c.34G{'>'}T / p.Gly12Cys</p>
                <p >c.34G{'>'}T / p.Gly12Cys</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">missense</p>
                <p className="flex items-center">stop_gained</p>
                <p className="flex items-center">splice_acceptor</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">0.1 (1/10)</p>
                <p className="flex items-center">0.1 (1/10)</p>
                <p className="flex items-center">0.1 (1/10)</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">Pathogenic</p>
                <p className="flex items-center">Pathogenic</p>
                <p className="flex items-center">Pathogenic</p>
              </div>
            </div>
            <div className='w-[12rem] h-full border-l-[2px] border-white flex items-center justify-center p-[1rem]'>
              <div className='flex-row items-center'>
                <p className="flex items-center">FDA</p>
              </div>
            </div>
          </div>









        </div>

      </div>
    </div>
  );
}
