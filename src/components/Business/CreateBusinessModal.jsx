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
} from "@nextui-org/react";
import { uploadBusinessLogo } from "@/src/lib/utils/uploadImage";
import supabase from "@/src/services/supabase";
import AddressAutocomplete from "@/src/components/Common/AddressAutocomplete";

export default function CreateBusinessModal({ isOpen, onClose, userID, onSuccess }) {
  // Form data
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [calendlyUrl, setCalendlyUrl] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // Logo upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Handle logo file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size cannot exceed 5MB");
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    let createdBusinessId = null;

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError("User not logged in");
        setSubmitting(false);
        return;
      }

      // Validate required fields
      if (!name.trim()) {
        setError("Business name is required");
        setSubmitting(false);
        return;
      }

      if (!city.trim()) {
        setError("City is required");
        setSubmitting(false);
        return;
      }

      if (!address.trim()) {
        setError("Address is required");
        setSubmitting(false);
        return;
      }

      if (!phone.trim()) {
        setError("Phone is required");
        setSubmitting(false);
        return;
      }

      if (!email.trim()) {
        setError("Email is required");
        setSubmitting(false);
        return;
      }

      if (!calendlyUrl.trim()) {
        setError("Calendly URL is required");
        setSubmitting(false);
        return;
      }

      // STEP 1: Insert business record first (without logo_url)
      const { data: insertData, error: insertError } = await supabase
        .from("businesses")
        .insert([
          {
            owner_id: userID,
            name: name.trim(),
            city: city.trim(),
            address: address.trim(),
            description: description.trim() || null,
            phone: phone.trim(),
            email: email.trim(),
            website: website.trim() || null,
            logo_url: null, // Will be updated after upload
            calendly_url: calendlyUrl.trim(),
            latitude: latitude.trim() ? parseFloat(latitude) : null,
            longitude: longitude.trim() ? parseFloat(longitude) : null,
            is_approved: true, // Auto-approve new businesses
          },
        ])
        .select();

      if (insertError) {
        console.error("Create business error:", insertError);
        setError("Failed to create business: " + insertError.message);
        setSubmitting(false);
        return;
      }

      createdBusinessId = insertData[0].id;
      console.log("Business created with ID:", createdBusinessId);

      // STEP 2: Upload logo if selected, using the business ID as filename
      if (selectedFile) {
        const uploadResult = await uploadBusinessLogo(selectedFile, createdBusinessId);

        if (!uploadResult.success) {
          console.error("Logo upload failed:", uploadResult.error);
          
          // ROLLBACK: Delete the business record
          const { error: deleteError } = await supabase
            .from("businesses")
            .delete()
            .eq("id", createdBusinessId);
          
          if (deleteError) {
            console.error("Failed to rollback business:", deleteError);
            setError(`Logo upload failed and rollback failed: ${uploadResult.error}. Please contact support.`);
          } else {
            console.log("Business record rolled back successfully");
            setError(`Logo upload failed: ${uploadResult.error}. Business creation cancelled.`);
          }
          
          setSubmitting(false);
          return;
        }

        // STEP 3: Update business record with logo_url
        const { error: updateError } = await supabase
          .from("businesses")
          .update({ logo_url: uploadResult.url })
          .eq("id", createdBusinessId);

        if (updateError) {
          console.error("Failed to update logo_url:", updateError);
          setError("Business created but failed to save logo URL: " + updateError.message);
          setSubmitting(false);
          return;
        }

        console.log("Logo uploaded and business updated:", uploadResult.url);
        insertData[0].logo_url = uploadResult.url;
      }

      console.log("Business created successfully:", insertData[0]);
      
      // Notify parent and close modal
      if (onSuccess) {
        onSuccess(insertData[0]);
      }
      
      alert("Business created successfully!");
      handleClose();
    } catch (err) {
      console.error("Create business error:", err);
      
      // ROLLBACK: Try to delete business if it was created
      if (createdBusinessId) {
        const { error: deleteError } = await supabase
          .from("businesses")
          .delete()
          .eq("id", createdBusinessId);
        
        if (deleteError) {
          console.error("Failed to rollback business:", deleteError);
          setError(`Error occurred and rollback failed: ${err.message}. Please contact support.`);
        } else {
          console.log("Business record rolled back successfully");
          setError(`Error occurred: ${err.message}. Business creation cancelled.`);
        }
      } else {
        setError("Failed to create business: " + err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      // Reset form
      setName("");
      setCity("");
      setAddress("");
      setDescription("");
      setPhone("");
      setEmail("");
      setWebsite("");
      setCalendlyUrl("");
      setLatitude("");
      setLongitude("");
      setSelectedFile(null);
      setPreview(null);
      setLogoUrl(null);
      setError(null);
      onClose();
    }
  };

  const currentLogo = preview || logoUrl || `https://avatar.iran.liara.run/public/boy?username=${name || 'business'}`;

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
          Start a Store
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-6">
            {/* Logo Upload */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Business Logo</h3>
              <div className="flex items-start gap-4">
                {/* Logo preview */}
                <Avatar
                  src={currentLogo}
                  className="w-24 h-24"
                  isBordered
                />

                {/* Upload control */}
                <div className="flex-1">
                  <label className="block">
                    <div className="flex items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                      <div className="text-center">
                        <svg
                          className="mx-auto h-8 w-8 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="mt-1 text-xs text-gray-600">
                          {selectedFile ? selectedFile.name : "Click to select logo"}
                        </p>
                        <p className="text-xs text-gray-500">
                          JPG, PNG, WEBP supported, max 5MB
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>

                  {selectedFile && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-600">
                        New logo selected. Click "Create" to upload.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}
            </div>

            <Divider />

            {/* Business Information */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Business Information</h3>
              <div className="flex flex-col gap-4">
                {/* Name (Required) */}
                <Input
                  placeholder="Business name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="bordered"
                  isRequired
                />

                {/* City */}
                <Input
                  placeholder="City *"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  variant="bordered"
                  isRequired
                />

                {/* Address with Google Maps Autocomplete */}
                <AddressAutocomplete
                  value={address}
                  onChange={(newAddress) => setAddress(newAddress)}
                  onPlaceSelect={(place) => {
                    setAddress(place.address);
                    setLatitude(place.lat.toString());
                    setLongitude(place.lng.toString());
                  }}
                  placeholder="Address * (start typing to search)"
                  isRequired
                />

                {/* Description */}
                <Textarea
                  placeholder="Business description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  variant="bordered"
                  minRows={3}
                />

                {/* Phone */}
                <Input
                  placeholder="Phone *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  variant="bordered"
                  isRequired
                />

                {/* Email */}
                <Input
                  placeholder="Email *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="bordered"
                  type="email"
                  isRequired
                />

                {/* Website */}
                <Input
                  placeholder="Website (optional)"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  variant="bordered"
                />

                {/* Calendly URL */}
                <Input
                  placeholder="Calendly URL *: https://calendly.com/your-link"
                  value={calendlyUrl}
                  onChange={(e) => setCalendlyUrl(e.target.value)}
                  variant="bordered"
                  isRequired
                />

                {/* Latitude & Longitude - Auto-populated from address */}
                {(latitude || longitude) && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Latitude"
                      value={latitude}
                      variant="bordered"
                      isReadOnly
                      classNames={{
                        input: "font-mono"
                      }}
                    />
                    <Input
                      placeholder="Longitude"
                      value={longitude}
                      variant="bordered"
                      isReadOnly
                      classNames={{
                        input: "font-mono"
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="default" 
            variant="light" 
            onPress={handleClose}
            isDisabled={submitting}
          >
            Cancel
          </Button>
          <Button 
            color="primary" 
            onPress={handleSubmit}
            isDisabled={submitting}
            isLoading={submitting}
          >
            Create Business
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

