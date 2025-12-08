import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { UserRole } from "@/types";

export const useUserRole = (userId: string | undefined) => {
  const [role, setRole] = useState<UserRole>("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .single();

        if (error) {
          console.error("Error fetching user role:", error);
          setRole("user"); // Default to user on error
        } else {
          setRole((data?.role as UserRole) || "user");
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
        setRole("user");
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [userId]);

  return { role, loading };
};
