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
      <div className=" aspect-square w-12 h:full text-white flex items-center justify-center">
          <HomeButton />
        </div>
      <div className="w-full h:full text-white flex items-center justify-center">
          <AcmeLogo />
        </div>
      <div className=" aspect-square w-12 h:full text-white flex items-center justify-center">
          <LogoutButton />
        </div>
    </div>
  );
}
