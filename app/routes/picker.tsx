import { PickerGame } from "~/global/screens/picker/picker-game";
import type { Route } from "./+types/picker";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Elige al azar - Pol Gubau" },
    {
      name: "description",
      content:
        "Pon los dedos en la pantalla, cuenta atrás y se elige a una persona al azar.",
    },
  ];
}

export default function Picker() {
  return <PickerGame />;
}
