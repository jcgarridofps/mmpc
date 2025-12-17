import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <main className="flex h-screen w-full">
      {/* Left column */}
      <div className="relative w-[70%] h-screen overflow-hidden ">
        <img
          src="main_background.png"
          alt="Side visual"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Right column */}
      <div className="w-[30%] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* SVG logo */}
          <img src="/logo.svg" alt="Logo" className="h-32 w-32"/>

          {/* Text */}
          <p className="text-center font-bold text-lg max-w-[400px] pt-2">
            MMP CANCER
          </p>

          {/* Text */}
          <p className="text-center text-lg max-w-[400px] pt-2">
            A tool for variant analysis and reporting targeted cancer treatments
          </p>

          {/* Other element (button, input, etc.) */}
          <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
              <Suspense>
                <LoginForm />
              </Suspense>
            </div>
        </div>
      </div>
    </main>
    /* <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main> */
  );
}