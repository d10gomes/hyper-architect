import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type Quota = {
  plan: "free" | "starter" | "pro" | "studio";
  used: number;
  remaining: number;
  limit: number;
  periodEnd: string;
};

export const getMyQuota = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Quota> => {
    const { data, error } = await context.supabase.rpc("my_quota");
    if (error) {
      console.error("my_quota error", error);
      return { plan: "free", used: 0, remaining: 3, limit: 3, periodEnd: new Date().toISOString() };
    }
    const row = Array.isArray(data) ? data[0] : data;
    return {
      plan: (row?.plan ?? "free") as Quota["plan"],
      used: row?.used ?? 0,
      remaining: row?.remaining ?? 0,
      limit: row?.limit ?? 3,
      periodEnd: String(row?.period_end ?? new Date().toISOString()),
    };
  });
