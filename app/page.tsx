import { StellarExperience } from "./components/StellarExperience";
import { getFieldNoteSummaries } from "./lib/fieldNotes";
import { getProjectCaseStudySummaries } from "./lib/projectCaseStudies";

export default function Home() {
  return (
    <StellarExperience
      fieldNotes={getFieldNoteSummaries()}
      projects={getProjectCaseStudySummaries()}
    />
  );
}
