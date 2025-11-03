import { Button, Chip, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import supabase from "@/src/services/supabase";
import CreateBusinessModal from "./CreateBusinessModal";

export default function StartBusiness({ userID }) {
  console.log("StartBusiness", userID);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [businessData, setBusinessData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load business data on mount
  useEffect(() => {
    loadBusinessData();
  }, [userID]);

  const loadBusinessData = async () => {
    setIsLoading(true);
    try {
      // Check if user already has a business
      const { data, error: fetchError } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", userID)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is ok
        console.error("Load business error:", fetchError);
        setError(fetchError.message);
      } else if (data) {
        setBusinessData(data);
      }
    } catch (err) {
      console.error("Load business error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClick = () => {
    setIsModalOpen(true);
  };

  const handleBusinessCreated = (newBusinessData) => {
    setBusinessData(newBusinessData);
    setIsModalOpen(false);
  };

  if (isLoading) return <Spinner />;
  if (error) return <div className="text-danger">{error}</div>;
  
  // If user already has a business
  if (businessData) {
    return (
      <Chip color="success" className="text-white">
        Business Owner
      </Chip>
    );
  }
  
  // Show create button if user hasn't created a business yet
  return (
    <>
      <Button onClick={handleCreateClick}>Start a Store</Button>
      
      <CreateBusinessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userID={userID}
        onSuccess={handleBusinessCreated}
      />
    </>
  );
}

