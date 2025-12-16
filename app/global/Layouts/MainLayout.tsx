import { Gamepad2 } from "lucide-react";
import type React from "react";
import { Link } from "react-router";

const MainLayout = ({ children, title }: { children: React.ReactNode; title?: string }) => {
  const sign = `

   ____          _          _ ____        ____       _ 
  / ___|___   __| | ___  __| | __ ) _   _|  _ \\ ___ | |
 | |   / _ \\ / _' |/ _ \\/ _' |  _ \\| | | | |_) / _ \\| |
 | |__| (_) | (_| |  __/ (_| | |_) | |_| |  __/ (_) | |
  \\____\\___/ \\__,_|\\___|\\__,_|____/ \\__, |_|   \\___/|_|
                                    |___/              

`;
  console.debug(sign);
  console.debug(`
Hi there! 👋
This website has been made by @polgubau, and it's open source!

More info at https://polgubau.com

_____________________________________________________
`);
  return (
    <main className="bg-background p-4 md:p-6 w-screen h-dvh grid grid-rows-[auto_1fr] gap-2 md:gap-4 overflow-hidden">
      <nav className="w-full md:rounded-full justify-start gap-2 flex items-center z-10">
        <Link to="/" title="Go to main screen">
          <Gamepad2 className="size-4 md:size-8" />
        </Link>
        <hgroup className="text-sm md:text-2xl flex gap-1 items-center">
          <Link to="/" title="Go to main screen">
            <h2>Pol/</h2>
          </Link>
          <h1 className="font-bold">{title ?? "Games"}</h1>
        </hgroup>
      </nav>

      <div className="w-full h-auto grid gap-2 bg-secondary-50 overflow-auto">
        {children}
      </div>
    </main>
  );
};

export default MainLayout;
