import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from './fonts';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/20/solid';
import { logoutAction } from '../lib/actions';


export default function LogoutButton() {
  return (
    <div
      className={`${lusitana.className} w-full h-full flex flex-col items-center justify-center leading-none text-white`}
    >
      <form className="w-full h-full"
          action={logoutAction}
        >
          <button
        className="bg-blue-600 w-full h-full text-sm text-white transition-colors hover:bg-blue-400 flex flex-col items-center justify-center"
        title='Logout'
      >
        <ArrowRightStartOnRectangleIcon className="h-[60%] w-[60%]"/>
      </button>
        </form>
      
      
    </div>
  );
}
