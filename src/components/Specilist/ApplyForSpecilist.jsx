import { Button, Chip, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import supabase from "@/src/services/supabase";
import ApplySpecialistModal from "./ApplySpecialistModal";

export default function ApplyForSpecilist({ userID }) {
  console.log("ApplyForSpecilist", userID);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [specialistData, setSpecialistData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load specialist data on mount
  useEffect(() => {
    loadSpecialistData();
  }, [userID]);

  const loadSpecialistData = async () => {
    setIsLoading(true);
    try {
      // Check if user already applied as specialist
      const { data, error: fetchError } = await supabase
        .from("specialists")
        .select("*")
        .eq("profile_id", userID)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is ok
        console.error("Load specialist error:", fetchError);
        setError(fetchError.message);
      } else if (data) {
        setSpecialistData(data);
      }
    } catch (err) {
      console.error("Load specialist error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
      }
  };

  const handleApplyClick = () => {
    setIsModalOpen(true);
  };

  const handleApplicationSuccess = (newSpecialistData) => {
    setSpecialistData(newSpecialistData);
    setIsModalOpen(false);
  };

  if (isLoading) return <Spinner />;
  if (error) return <div className="text-danger">{error}</div>;
  
  // If user already has a specialist record
  if (specialistData) {
    return specialistData.is_approved === true ? (
      <Chip color="success" className="text-white">
        Verified Specialist
      </Chip>
    ) : (
      <Chip color="warning">
        Pending Approval
      </Chip>
    );
  }
  
  // Show apply button if user hasn't applied yet
  return (
    <>
      <Button onClick={handleApplyClick}>Apply for Specialist</Button>
      
      <ApplySpecialistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userID={userID}
        onSuccess={handleApplicationSuccess}
      />
    </>
  );
}
