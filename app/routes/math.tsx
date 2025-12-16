import {MathPage} from "~/global/screens/Math/Math";

export function meta() {
  return [
    { title: "Math Challenge - Games" },
    { name: "description", content: "Test your math skills! Solve as many operations as you can." },
  ];
}

export default function Math() {
  return <MathPage />;
}
