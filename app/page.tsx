'use client'
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
export default function Home() {
  const { theme } = useTheme();

  return (
    <div>
      <div className="flex justify-center bg-white dark:bg-gray-900 px-6 py-4  shadow-sm h-[69px] md:h-[89px] index-2" >
        <div className="flex justify-between items-center max-w-[1400px] w-full ">
          <div>
            {
              theme == 'dark' ? (
                <Image src={'/assets/images/gidy_dark.png'} alt='Gidy' width={100} height={30} />
              ) : (
                <Image src={'/assets/images/gidy_light.png'} alt='Gidy' width={100} height={30} />
              )
            }
          </div>

          <div>
            <Link href="/signin" className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:bg-blue-700 text-sm text-white font-bold py-[10px] px-5 rounded-lg shadow-[0_4px_12px_#4285f44d]">
              Login <svg className="text-white" fill="currentColor" width={'1rem'} height={'1rem'} focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="RocketLaunchIcon"><path d="M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 10.69l4.05-4.05c.47-.47 1.15-.68 1.81-.55zM11.17 17s3.74-1.55 5.89-3.7c5.4-5.4 4.5-9.62 4.21-10.57-.95-.3-5.17-1.19-10.57 4.21C8.55 9.09 7 12.83 7 12.83zm6.48-2.19c-2.29 2.04-5.58 3.44-5.89 3.57L13.31 22l4.05-4.05c.47-.47.68-1.15.55-1.81zM9 18c0 .83-.34 1.58-.88 2.12C6.94 21.3 2 22 2 22s.7-4.94 1.88-6.12C4.42 15.34 5.17 15 6 15c1.66 0 3 1.34 3 3m4-9c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2"></path></svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex justify-center md:items-center max-h-[calc(100vh-69px)]  md:min-h-[calc(100vh-89px)]">
        <div className="max-w-[1400px] w-full  px-6  py-6 md:py-12 grid grid-cols-1 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col gap-2 md:gap-8 px-4 max-w-[700px] w-full  ">
            <div className="flex gap-3 justify-center items-center w-fit border border-blue-400 bg-white dark:bg-gray-800 rounded-3xl py-2 px-4 shadow-[0_2px_8px_#4285f44d]">
              <div className="relative flex justify-center items-center h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 ">Welcome to Gidy</p>
            </div>

            <h1 className=" text-2xl md:text-5xl font-bold text-gray-800 dark:text-white">Find Jobs. Compete in<br /> Hackathons.</h1>
            <h6 className="text-md md:text-xl font-semibold text-gray-800 dark:text-gray-200 ">
              Discover jobs, compete in hackathons, and showcase real-world projects all in one unified platform.
            </h6>
            <p className="text-sm text-gray-400 dark:text-gray-400 font-medium">
              Whether you're preparing for your next job, proving your skills through projects, or standing out in hackathons, Gidy helps you turn your work into real career opportunities.
            </p>
            <button className="flex items-center gap-2 mt-4 px-8 py-3 font-semibold bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl hover:bg-blue-700 transition w-fit shadow-[0_4px_12px_#4285f44d]">
              Get Started <svg className="text-white" fill="currentColor" width={'1rem'} height={'1rem'} focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EastIcon"><path d="m15 5-1.41 1.41L18.17 11H2v2h16.17l-4.59 4.59L15 19l7-7z"></path></svg>
            </button>

          </div>
          <div className="flex w-full justify-center md:items-center mt-8 md:mt-0">
            <div className="animate-up-down w-[240px] h-[160px] md:w-[320px] md:h-[240px] relative">
              <Image
                src="/assets/images/hero_img.png"
                alt="Hero Illustration"
                width={320}
                height={240}

              />
            </div>

          </div>
        </div>
      </div>
    </div>


  );
}
