'use client';

import { EyeIcon, InformationCircleIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Search from '../search';
import { useState } from 'react';



export default function DrugQueryResultGenesPanel(
  { affected_genes, presence, n_variants }: { affected_genes: string[], presence: any, n_variants: Number }) {

  const [enableGenesExcluded, setEnableGenesExcluded] = useState<boolean>(false);
  const [enableGenesAnalyzed, setEnableGenesAnalyzed] = useState<boolean>(false);
  const [enableAffectedGenes, setEnableAffectedGenes] = useState<boolean>(false);

  return (
    <div className="flex-row w-full align-middle">
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
          <p className="text-left ml-4">Variants: {n_variants.toString()}</p>
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
          <p className="text-left ml-4">Affected genes: {affected_genes.length}</p>
          <button
            type="button"
            className={`ml-4 w-7 h-7 aspect-square border-2 border-gray-300 text-black rounded-lg hover:bg-gray-300 flex items-center justify-center
              ${enableAffectedGenes ? 'bg-gray-300':'bg-gray-50'}`
            }
            title='Clinical reports'
            onClick={()=>setEnableAffectedGenes(!enableAffectedGenes)}
          >
            <EyeIcon className="h-5 w-5" />
          </button>
        </div>
        <div className='flex-1 border-l-[2px] border-white h-full justify-center flex items-center'>
          <p className="text-left ml-4">Genes analyzed: {presence.present.length}</p>
          <button
            type="button"
            className={`ml-4 w-7 h-7 aspect-square border-2 border-gray-300 text-black rounded-lg hover:bg-gray-300 flex items-center justify-center
              ${enableGenesAnalyzed ? 'bg-gray-300':'bg-gray-50'}`
            }
            title='Clinical reports'
            onClick={()=>setEnableGenesAnalyzed(!enableGenesAnalyzed)}
          >
            <EyeIcon className="h-5 w-5" />
          </button>
        </div>
        <div className='flex-1 border-l-[2px] border-white h-full justify-center flex items-center'>
          <p className="text-left ml-4">Genes excluded: {presence.absent.length}</p>
          <button
            type="button"
            className={`ml-4 w-7 h-7 aspect-square border-2 border-gray-300 text-black rounded-lg hover:bg-gray-300 flex items-center justify-center
              ${enableGenesExcluded ? 'bg-gray-300':'bg-gray-50'}`
            }
            title='Clinical reports'
            onClick={()=>setEnableGenesExcluded(!enableGenesExcluded)}
          >
            <EyeIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {enableAffectedGenes &&
        <div className="p-4 pl-4 w-full bg-gray-50 rounded-xl mb-4 flex-row justify-between items-center">
          <p className="font-medium mb-[1rem]">Affected genes</p>
          <p className="text-left w-full">{affected_genes.toString().replaceAll(',', ', ')}</p>
        </div>
      }


      {enableGenesAnalyzed &&
        <div className="p-4 pl-4 w-full bg-gray-50 rounded-xl mb-4 flex-row justify-between items-center">
          <p className="font-medium mb-[1rem]">Genes analyzed</p>
          <p className="text-left w-full">{presence.present.toString().replaceAll(',', ', ')}</p>
        </div>
      }


      {enableGenesExcluded &&
        <div className="p-4 pl-4 w-full bg-gray-50 rounded-xl mb-4 flex-row justify-between items-center">
          <p className="font-medium mb-[1rem]">Genes excluded</p>
          <p className="text-left w-full">{presence.absent.toString().replaceAll(',', ', ')}</p>
        </div>
      }

    </div>
  );
}
