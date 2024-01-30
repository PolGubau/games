import React from "react";
import { IoGameController } from "react-icons/io5";
import { Link } from "react-router-dom";

const MainLayout = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  const sign = `

   ____          _          _ ____        ____       _ 
  / ___|___   __| | ___  __| | __ ) _   _|  _ \\ ___ | |
 | |   / _ \\ / _' |/ _ \\/ _' |  _ \\| | | | |_) / _ \\| |
 | |__| (_) | (_| |  __/ (_| | |_) | |_| |  __/ (_) | |
  \\____\\___/ \\__,_|\\___|\\__,_|____/ \\__, |_|   \\___/|_|
                                    |___/              

`;
  console.log(sign);
  console.log(`
Hi there! 👋
This website has been made by @polgubau, and it's open source!

More info at https://polgubau.com

_____________________________________________________
`);
  return (
    <main className="bg-primary md:p-8 w-screen h-[100svh] grid grid-rows-[auto,1fr] gap-6 overflow-hidden">
      <nav className="bg-secondary-50 w-full p-3 md:rounded-full justify-start gap-2 md:gap-4 flex items-center z-10">
        <Link to="/" title="Go to main screen">
          <div className="flex items-center bg-primary-900 h-full p-1 aspect-square rounded-full text-secondary-50 justify-center text-3xl md:p-4">
            <IoGameController className="text-xl md:text-4xl" />
          </div>
        </Link>
        <hgroup className="text-lg md:text-4xl flex gap-1 items-center">
          <Link
            to="https://polgubau.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Check my portfolio"
          >
            <h2>Pol/</h2>
          </Link>
          <h1 className="font-bold">
            <Link to="/" title="Go to main screen">
              {title ?? "Games"}
            </Link>
          </h1>
        </hgroup>
      </nav>

      <div className="w-full h-auto grid gap-2 bg-secondary-50 md:rounded-[30px] xl:rounded-[80px] shadow-xl overflow-auto">
        {children}
      </div>
    </main>
  );
};

export default MainLayout;
