import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from './fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-col items-center leading-none text-white`}
    >
      <p className="text-[24px]">MMPC</p>
    </div>
  );
}
