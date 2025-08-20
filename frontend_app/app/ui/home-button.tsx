'use client';

import { HomeIcon } from '@heroicons/react/24/outline';
import { lusitana } from './fonts';
import { useRouter } from 'next/navigation';

export default function HomeButton() {
  const router = useRouter();

  return (
    <div
      className={`${lusitana.className} w-full h-full flex flex-col items-center justify-center leading-none text-white`}
    >
      <button
        className="bg-blue-600 w-full h-full text-sm text-white transition-colors hover:bg-blue-400 flex flex-col items-center justify-center"
        onClick={
          () => router.push('/')
        }
        title='Go to main dashboard'
      >
        <HomeIcon className="h-[60%] w-[60%]"/>
      </button>
      
    </div>
  );
}
