import { useCallback, useEffect, useState } from "react";
import { profileFetch } from "@/lib/student-auth";
import type { ProfileData } from "@/components/edit-profile-dialog";

export async function fetchStudentProfile(): Promise<ProfileData> {
  return profileFetch("/api/student/profile") as Promise<ProfileData>;
}

export async function saveStudentProfile(payload: ProfileData): Promise<ProfileData> {
  return profileFetch("/api/student/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  }) as Promise<ProfileData>;
}

export async function uploadStudentAvatar(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const data = await profileFetch("/api/student/profile/image", { method: "POST", body }) as { avatarUrl: string };
  return data.avatarUrl;
}

export function useStudentProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStudentProfile();
      setProfile(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load profile");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { profile, loading, error, reload, setProfile };
}
