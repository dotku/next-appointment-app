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
  Divider,
} from "@nextui-org/react";
import { uploadAvatar } from "@/src/lib/utils/uploadImage";
import supabase from "@/src/services/supabase";

export default function ProfileModal({ isOpen, onClose, session, onProfileUpdated }) {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  
  // Avatar state
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  
  // UI state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Load user data
  useEffect(() => {
    if (session && isOpen) {
      loadUserProfile();
    }
  }, [session, isOpen]);

  const loadUserProfile = async () => {
    if (!session) return;

    // Load user info from profiles table
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (data) {
      setName(data.name || "");
      setEmail(data.email || session.user.email || "");
      setContact(data.contact || "");
      setAvatarUrl(data.avatar_url || null);
    } else {
      // If no profile exists, create one
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: session.user.id,
          email: session.user.email,
        });

      if (insertError) {
        console.error("Create profile error:", insertError);
      }

      // Pre-fill email from auth session
      setEmail(session.user.email || "");
    }
  };

  // Handle file selection
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

  // Save profile info
  const handleSaveProfile = async () => {
    if (!session) return;

    setSaving(true);
    setError(null);

    try {
      let finalAvatarUrl = avatarUrl;

      // Step 1: Upload avatar if a new file is selected
      if (selectedFile) {
        const uploadResult = await uploadAvatar(selectedFile, session.user.id);

        if (!uploadResult.success) {
          setError(uploadResult.error);
          setSaving(false);
          return;
        }

        finalAvatarUrl = uploadResult.url;
      }

      // Step 2: Upsert profile with all information
      const { error: updateError } = await supabase
        .from("profiles")
        .upsert({
          id: session.user.id,
          name: name,
          email: email,
          contact: contact,
          avatar_url: finalAvatarUrl,
        }, {
          onConflict: 'id'
        });

      if (updateError) {
        console.error("Update profile error:", updateError);
        setError("Save failed: " + updateError.message);
        setSaving(false);
        return;
      }

      // Step 3: Update local state
      setAvatarUrl(finalAvatarUrl);
      setSelectedFile(null);
      setPreview(null);

      // Notify parent component
      if (onProfileUpdated) {
        onProfileUpdated({ 
          avatar_url: finalAvatarUrl,
          name: name,
          email: email,
          contact: contact,
        });
      }

      alert("Profile updated successfully!");
      
      // Close modal after successful save
      onClose();
    } catch (err) {
      console.error("Save profile error:", err);
      setError("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setSelectedFile(null);
      setPreview(null);
      setError(null);
      onClose();
    }
  };

  const currentAvatar = preview || avatarUrl || `https://avatar.iran.liara.run/public/girl?username=${session?.user?.id}`;

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
          Profile
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-6">
            {/* Avatar section */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Avatar</h3>
              <div className="flex items-start gap-4">
                {/* Avatar preview */}
                <Avatar
                  src={currentAvatar}
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
                          {selectedFile ? selectedFile.name : "Click to select image"}
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
                        New avatar selected. Click "Save" to upload.
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

            {/* Personal info section */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Basic Information</h3>
              <div className="flex flex-col gap-4">
                {/* Name */}
                <Input
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="bordered"
                />

                {/* Email */}
                <Input
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="bordered"
                  type="email"
                />

                {/* Contact */}
                <Input
                  placeholder="Enter phone"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  variant="bordered"
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="default" 
            variant="light" 
            onPress={handleClose}
            isDisabled={saving}
          >
            Cancel
          </Button>
          <Button 
            color="primary" 
            onPress={handleSaveProfile}
            isDisabled={saving}
            isLoading={saving}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

