import { useIsPresent, motion } from "framer-motion";
import MainLayout from "./MainLayout";

interface Props {
  children: React.ReactNode;
  title: string;
}
const BoardLayout: React.FC<Props> = ({ children, title }) => {
  const isPresent = useIsPresent();

  return (
    <MainLayout title={title}>
      {children}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
        exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
        className="privacy-screen"
      />
    </MainLayout>
  );
};
export default BoardLayout;
