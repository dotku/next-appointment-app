import ApplyForSpecilist from "../Specilist/ApplyForSpecilist";
import StartBusiness from "../Business/StartBusiness";

export default function Account({ userID }) {
  return (
    <div className="flex flex-col gap-4">
      <ApplyForSpecilist userID={userID} />
      <StartBusiness userID={userID} />
    </div>
  );
}
