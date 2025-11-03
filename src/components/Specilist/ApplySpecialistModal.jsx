"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
  Input,
  Textarea,
  Divider,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import supabase from "@/src/services/supabase";

export default function ApplySpecialistModal({ isOpen, onClose, userID, onSuccess }) {
  // Profile data (read-only)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    contact: "",
    avatar_url: null,
  });

  // Specialist data (editable)
  const [intro, setIntro] = useState("");
  const [calendlyUrl, setCalendlyUrl] = useState("");
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);

  // Business data
  const [businesses, setBusinesses] = useState([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const [businessSearchValue, setBusinessSearchValue] = useState("");

  // UI state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Load profile data when modal opens
  useEffect(() => {
    if (isOpen && userID) {
      loadProfileData();
    }
  }, [isOpen, userID]);

  // Search businesses with debounce
  useEffect(() => {
    if (!isOpen) return;

    const debounceTimer = setTimeout(() => {
      searchBusinesses(businessSearchValue);
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [businessSearchValue, isOpen]);

  const loadProfileData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("name, email, contact, avatar_url")
        .eq("id", userID)
        .single();

      if (profileError) {
        console.error("Load profile error:", profileError);
        setError("Failed to load profile: " + profileError.message);
        return;
      }

      if (profile) {
        setProfileData({
          name: profile.name || "",
          email: profile.email || "",
          contact: profile.contact || "",
          avatar_url: profile.avatar_url || null,
        });
      }
    } catch (err) {
      console.error("Load profile error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchBusinesses = async (searchQuery) => {
    setLoadingBusinesses(true);
    
    try {
      let query = supabase
        .from("businesses")
        .select("id, name, city, address")
        .order("name", { ascending: true });

      // Apply fuzzy search if there's a search query
      if (searchQuery && searchQuery.trim()) {
        query = query.ilike("name", `%${searchQuery.trim()}%`);
      }

      // Limit results to 50 for better performance
      query = query.limit(50);

      const { data, error: businessError } = await query;

      if (businessError) {
        console.error("Search businesses error:", businessError);
      } else {
        setBusinesses(data || []);
      }
    } catch (err) {
      console.error("Search businesses error:", err);
    } finally {
      setLoadingBusinesses(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError("User not logged in");
        setSubmitting(false);
        return;
      }

      // Create specialist record
      const { data: insertData, error: insertError } = await supabase
        .from("specialists")
        .insert([
          {
            profile_id: userID,
            name: profileData.name,
            email: profileData.email,
            phone: profileData.contact,
            avatar_url: profileData.avatar_url,
            intro: intro || null,
            calendly_url: calendlyUrl || null,
            business_id: selectedBusinessId || null,
            is_approved: true, // Auto-approve for now
          },
        ])
        .select();

      if (insertError) {
        console.error("Create specialist error:", insertError);
        setError("Failed to apply: " + insertError.message);
        setSubmitting(false);
        return;
      }

      console.log("Specialist created:", insertData);
      
      // Notify parent and close modal
      if (onSuccess) {
        onSuccess(insertData[0]);
      }
      
      alert("Successfully applied as a specialist!");
      onClose();
    } catch (err) {
      console.error("Apply for specialist error:", err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      // Reset form
      setIntro("");
      setCalendlyUrl("");
      setSelectedBusinessId(null);
      setBusinessSearchValue("");
      setBusinesses([]);
      setError(null);
      onClose();
    }
  };

  const avatarSrc = profileData.avatar_url || `https://avatar.iran.liara.run/public/girl?username=${userID}`;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="2xl"
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Apply for Specialist
        </ModalHeader>
        <ModalBody>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Profile Information (Read-only) */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Profile Information</h3>
                <div className="flex items-start gap-4 mb-4">
                  <Avatar
                    src={avatarSrc}
                    className="w-20 h-20"
                    isBordered
                  />
                  <div className="flex-1 text-sm text-gray-600">
                    <p>This information is from your profile and cannot be edited here.</p>
                    <p className="text-xs mt-1">Go to Profile to update these fields.</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Input
                    placeholder="Name"
                    value={profileData.name}
                    variant="bordered"
                    isReadOnly
                    classNames={{
                      input: "bg-gray-50",
                    }}
                  />
                  
                  <Input
                    placeholder="Email"
                    value={profileData.email}
                    variant="bordered"
                    isReadOnly
                    classNames={{
                      input: "bg-gray-50",
                    }}
                  />
                  
                  <Input
                    placeholder="Phone"
                    value={profileData.contact}
                    variant="bordered"
                    isReadOnly
                    classNames={{
                      input: "bg-gray-50",
                    }}
                  />
                </div>
              </div>

              <Divider />

              {/* Specialist Information (Editable) */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Specialist Information</h3>
                <div className="flex flex-col gap-4">
                  {/* Intro */}
                  <Textarea
                    placeholder="Tell us about yourself and your expertise (optional)"
                    value={intro}
                    onChange={(e) => setIntro(e.target.value)}
                    variant="bordered"
                    minRows={3}
                  />

                  {/* Calendly URL */}
                  <Input
                    placeholder="Calendly URL (optional): https://calendly.com/your-link"
                    value={calendlyUrl}
                    onChange={(e) => setCalendlyUrl(e.target.value)}
                    variant="bordered"
                  />

                  {/* Business Selection */}
                  <Autocomplete
                    placeholder="Search and select a business (optional)"
                    variant="bordered"
                    inputValue={businessSearchValue}
                    onInputChange={setBusinessSearchValue}
                    selectedKey={selectedBusinessId}
                    onSelectionChange={setSelectedBusinessId}
                    isLoading={loadingBusinesses}
                    items={businesses}
                    allowsCustomValue={false}
                  >
                    {(business) => (
                      <AutocompleteItem key={business.id} textValue={business.name}>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">{business.name}</span>
                          {(business.city || business.address) && (
                            <span className="text-xs text-gray-500">
                              {[business.city, business.address].filter(Boolean).join(", ")}
                            </span>
                          )}
                        </div>
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button 
            color="default" 
            variant="light" 
            onPress={handleClose}
            isDisabled={submitting || loading}
          >
            Cancel
          </Button>
          <Button 
            color="primary" 
            onPress={handleSubmit}
            isDisabled={submitting || loading}
            isLoading={submitting}
          >
            Submit Application
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

