import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';
import HomeButton from '../home-button';
import LogoutButton from '../logout-button';

export default function SideNav() {
  return (
    <div className="flex justify-between h-12 bg-blue-600">
      <div className="w-12 h:full text-white flex items-center justify-center">
          <HomeButton />
        </div>
      <div className="w-full w-1/30 h:full text-white flex items-center justify-center">
          <AcmeLogo />
        </div>
      <div className="w-12 h:full text-white flex items-center justify-center">
          <LogoutButton />
        </div>
      {/*
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}
        >
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div> */}
    </div>
  );
}
