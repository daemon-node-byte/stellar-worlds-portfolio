import { StellarExperience } from "./components/StellarExperience";
import { getFieldNoteSummaries } from "./lib/fieldNotes";

export default function Home() {
  return <StellarExperience fieldNotes={getFieldNoteSummaries()} />;
}
