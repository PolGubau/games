import MainLayout from "./MainLayout";

interface Props {
  children: React.ReactNode;
  title: string;
}
const BoardLayout: React.FC<Props> = ({ children, title }) => {

  return (
    <MainLayout title={title}>
      <div className="max-w-5xl mx-auto grid w-full">

        {children}
      </div>

    </MainLayout>
  );
};
export default BoardLayout;
