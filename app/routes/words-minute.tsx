import WordsPerMinutePage from "~/global/screens/words-minute/words-minute";

export function meta() {
  return [
    { title: "Words Per Minute - Games" },
    { name: "description", content: "Test your typing speed! How many words can you type in 60 seconds?" },
  ];
}

export default function WordsPerMinute() {
  return <WordsPerMinutePage />;
}
