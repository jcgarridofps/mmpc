'use client'

import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from './fonts';
import { WalletIcon } from '@heroicons/react/20/solid';


const buttonAction = ()=>{alert("Define and manage custom panels.\nThis capability will be available after future updates.");}

export default function PanelManagerButton() {
  return (
    <div
      className={`${lusitana.className} w-full h-full flex flex-col items-center justify-center leading-none text-white`}
    >
      <form className="w-full h-full"
          onClick={buttonAction}
        >
          <button
        className="bg-blue-600 w-full h-full text-sm text-white transition-colors hover:bg-blue-400 flex flex-col items-center justify-center"
        title='Panel manager'
      >
        <WalletIcon className="h-[60%] w-[60%]"/>
      </button>
        </form>
      
      
    </div>
  );
}
