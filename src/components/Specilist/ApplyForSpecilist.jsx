import { Button, Chip, Spinner } from "@nextui-org/react";
import { useSupabaseRowsByUserID } from "../../hooks/useSupabaseRowsByUserID";
import { useEffect, useMemo, useState } from "react";
import supabase from "@/src/services/supabase";

export default function ApplyForSpecilist({ userID, table = "profile_role" }) {
  console.log("ApplyForSpecilist", userID);
  const {
    isLoading,
    data: supabsaeRowsByUserIDData,
    error: supabaseRowsByUserIDError,
  } = useSupabaseRowsByUserID({ userID, table });

  const [error, setError] = useState(supabaseRowsByUserIDError);
  const [data, setData] = useState([]);

  const item = useMemo(
    () => (data ? data.find(({ profile_id }) => profile_id === userID) : null),
    [data, userID]
  );

  useEffect(() => {
    setData(supabsaeRowsByUserIDData);
  }, [supabsaeRowsByUserIDData]);

  const handleButtonClick = () => {
    // async function update() {
    //   const { data, error: updateTableError } = await supabase
    //     .from("profile_role")
    //     .update({ other_column: "otherValue" })
    //     .eq("some_column", "someValue")
    //     .select();
    //   if (updateTableError) {
    //     setError(updateTableError);
    //     return;
    //   }
    //   console.log("update data", data);
    // }

    async function insertItem() {
      const { data: insertData, error: insertError } = await supabase
        .from("profile_role")
        .insert([
          {
            profile_id: userID,
            // @todo: might need udpate the ID later
            role_id: "1213811c-fbc8-45d1-98d8-06ed2f078d5e",
          },
        ])
        .select();

      if (insertError) {
        setError(insertError.message);
        return;
      }
      console.log("insert data", data);

      setData(insertData);
    }

    insertItem();
  };

  if (isLoading) return <Spinner />;
  if (error) return <div className="text-danger">{error}</div>;
  console.log("item", item, data);
  if (item)
    return item.is_approved === true ? (
      <Chip color="success" className="text-white">
        Verified
      </Chip>
    ) : (
      <Chip>Pending</Chip>
    );
  return <Button onClick={handleButtonClick}>Apply for Specilist 001</Button>;
}
