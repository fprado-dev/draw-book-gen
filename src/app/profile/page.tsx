"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";
import { toast } from "sonner";
import { useState, } from "react";

type TProfileInfos = {
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  location?: string;
  website?: string;
  twitter?: string;
  instagram?: string;
};

export default function Profile() {
  const router = useRouter();
  const [formData, setFormData] = useState<TProfileInfos>({
    name: "",
    username: "",
    email: "",
    avatar: "",
    bio: "",
    website: "",
    twitter: "",
    instagram: "",
  });

  const { data: session } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push("/sign-in");
        return null;
      }
      return session;
    },
  });

  const { isLoading } = useQuery({
    queryKey: ["user-profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      setFormData({
        name: data.name,
        username: data.username,
        email: data.email,
        avatar: data.avatar,
        bio: data.bio,
        website: data.website,
        twitter: data.twitter,
        instagram: data.instagram,
      })
      return data as TProfileInfos;
    },
    enabled: !!session?.user?.id,

  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: TProfileInfos) => {
      if (!session?.user?.id) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("users")
        .upsert({
          id: session.user.id,
          ...data,
          updated_at: new Date().toISOString(),
          email: session.user.email,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    },
  });

  const handleInputChange = (key: keyof TProfileInfos, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAvatarInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !session?.user?.id) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      // Upload the file with explicit user ID in path
      const { error: uploadError } = await supabase.storage
        .from('users-images')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Failed to upload avatar');
        return;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('users-images')
        .getPublicUrl(filePath);

      // Update the avatar URL in the form data
      handleInputChange('avatar', publicUrl);

      // Also update the user's profile in the database
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar: publicUrl })
        .eq('id', session.user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        toast.error('Failed to update profile');
        return;
      }

      toast.success('Avatar uploaded successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar',);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };



  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="animate-pulse space-y-8">
          <div className="h-10 w-32 bg-gray-200 rounded" />
          <Card>
            <CardHeader>
              <div className="h-8 w-48 bg-gray-200 rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="h-24 w-24 rounded-full bg-gray-200 mx-auto" />
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl ">Edit Profile</CardTitle>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-6 gap-4 mt-10">
        <div className="col-span-1 cursor-pointerjustify-center flex">

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarInputChange}
            id="avatar-upload"
          />
          <label
            htmlFor="avatar-upload"
          >
            <Avatar className="w-32 h-32 group-hover:opacity-80 transition-opacity cursor-pointer">
              {formData.avatar && <AvatarImage src={formData.avatar} className="object-cover" />}
              <AvatarFallback className="bg-slate-300 w-32 h-32 flex items-center justify-center">
                <span className="text-4xl text-white">{formData.name?.charAt(0) || "U"}</span>
              </AvatarFallback>
            </Avatar>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="col-span-5 ">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-zinc-700 dark:text-zinc-300">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                autoComplete="off"
                className="bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80
                                 focus:border-zinc-300 dark:focus:border-zinc-700
                                 focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-800
                                 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="username" className="text-zinc-700 dark:text-zinc-300">
                Username
              </Label>
              <Input
                id="username"
                placeholder="@username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                autoComplete="off"
                className="bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80
                                 focus:border-zinc-300 dark:focus:border-zinc-700
                                 focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-800
                                 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio" className="text-zinc-700 dark:text-zinc-300">
                Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                className="resize-none bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80
                                 focus:border-zinc-300 dark:focus:border-zinc-700
                                 focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-800
                                 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                rows={4}
                autoComplete="off"
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Social Links</h3>
              <div className="grid gap-4">
                {["website", "twitter", "instagram"].map((social) => (
                  <div key={social} className="grid gap-2">
                    <Label htmlFor={social} className="capitalize text-zinc-700 dark:text-zinc-300">
                      {social}
                    </Label>
                    <Input
                      id={social}
                      placeholder={social === "website" ? "https://your-website.com" : "@username"}
                      value={formData[social as keyof TProfileInfos] || ""}
                      onChange={(e) => handleInputChange(social as keyof TProfileInfos, e.target.value)}
                      autoComplete="off"
                      className="bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80
                                             focus:border-zinc-300 dark:focus:border-zinc-700
                                             focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-800
                                             placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/projects")}
              className="cursor-pointer border-zinc-200/80 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="cursor-pointer  bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}