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
import { uploadImage } from "@/src/lib/utils/uploadImage";
import supabase from "@/src/services/supabase";

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

      let finalLogoUrl = logoUrl;

      // Upload logo if selected
      if (selectedFile) {
        const uploadResult = await uploadImage(selectedFile, `businesses/${userID}`, "UserAvatars");

        if (!uploadResult.success) {
          setError(uploadResult.error);
          setSubmitting(false);
          return;
        }

        finalLogoUrl = uploadResult.url;
      }

      // Create business record
      const { data: insertData, error: insertError } = await supabase
        .from("businesses")
        .insert([
          {
            owner_id: userID,
            name: name.trim(),
            city: city.trim() || null,
            address: address.trim() || null,
            description: description.trim() || null,
            phone: phone.trim() || null,
            email: email.trim() || null,
            website: website.trim() || null,
            logo_url: finalLogoUrl,
            calendly_url: calendlyUrl.trim() || null,
            latitude: latitude.trim() ? parseFloat(latitude) : null,
            longitude: longitude.trim() ? parseFloat(longitude) : null,
          },
        ])
        .select();

      if (insertError) {
        console.error("Create business error:", insertError);
        setError("Failed to create business: " + insertError.message);
        setSubmitting(false);
        return;
      }

      console.log("Business created:", insertData);
      
      // Notify parent and close modal
      if (onSuccess) {
        onSuccess(insertData[0]);
      }
      
      alert("Business created successfully!");
      handleClose();
    } catch (err) {
      console.error("Create business error:", err);
      setError("Failed to create business: " + err.message);
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
                  placeholder="City (optional)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  variant="bordered"
                />

                {/* Address */}
                <Input
                  placeholder="Address (optional)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  variant="bordered"
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
                  placeholder="Phone (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  variant="bordered"
                />

                {/* Email */}
                <Input
                  placeholder="Email (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="bordered"
                  type="email"
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
                  placeholder="Calendly URL (optional): https://calendly.com/your-link"
                  value={calendlyUrl}
                  onChange={(e) => setCalendlyUrl(e.target.value)}
                  variant="bordered"
                />

                {/* Latitude & Longitude */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Latitude (optional)"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    variant="bordered"
                    type="number"
                    step="any"
                  />
                  <Input
                    placeholder="Longitude (optional)"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    variant="bordered"
                    type="number"
                    step="any"
                  />
                </div>
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

