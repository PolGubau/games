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
  return (
    <main className="bg-primary p-8 w-screen h-screen grid grid-rows-[auto,1fr] gap-10">
      <nav className="bg-secondary-50 w-full p-2 rounded-full justify-start gap-4 flex items-center">
        <div className="flex gap-4 items-center bg-primary-900 h-full aspect-square rounded-full text-secondary-50 justify-center text-3xl p-4">
          <IoGameController />
        </div>{" "}
        <hgroup className="text-4xl flex gap-1 items-center">
          <Link to="/">
            <h2>Pol/</h2>
          </Link>
          <h1 className="font-bold">{title ?? "Games"}</h1>
        </hgroup>
      </nav>

      <div className="w-full h-auto grid gap-2 bg-secondary-50 rounded-[30px] xl:rounded-[80px] shadow-xl">
        <section className=" ">{children}</section>
      </div>
    </main>
  );
};

export default MainLayout;
