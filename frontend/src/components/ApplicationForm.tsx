import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { api, APPLICATION_STATUSES } from "../lib/api";
import type { ApplicationStatus } from "../lib/api";
import { useQueryClient } from "@tanstack/react-query";

// --- schema (unchanged)
const schema = z.object({
  companyName: z.string().min(1, "Company required"),
  positionTitle: z.string().min(1, "Position required"),
  jobUrl: z.string().url("Must be URL").optional().or(z.literal("")),
  applicationDate: z.string().optional(),
  status: z.enum(APPLICATION_STATUSES).default("APPLIED"),
  notes: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

// --- key workaround: give resolver an explicit type
const formResolver: Resolver<FormValues> = zodResolver(schema) as unknown as Resolver<FormValues>;

export default function ApplicationForm() {
  const qc = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: formResolver, // ⬅️ use the typed resolver
    defaultValues: {
      status: "APPLIED" as ApplicationStatus,
      applicationDate: dayjs().format("YYYY-MM-DD"),
    },
  });

  // explicit type so handleSubmit(onSubmit) is happy
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    await api.post("/api/applications", {
      ...values,
      jobUrl: values.jobUrl || undefined,
      applicationDate: values.applicationDate || undefined,
    });
    reset();
    qc.invalidateQueries({ queryKey: ["applications"] });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: 8, maxWidth: 640 }}>
      <input placeholder="Company *" {...register("companyName")} />
      {errors.companyName && <small style={{ color: "red" }}>{errors.companyName.message}</small>}

      <input placeholder="Position *" {...register("positionTitle")} />
      {errors.positionTitle && <small style={{ color: "red" }}>{errors.positionTitle.message}</small>}

      <input placeholder="Job Link (optional)" {...register("jobUrl")} />
      {errors.jobUrl && <small style={{ color: "red" }}>{errors.jobUrl.message}</small>}

      <input type="date" {...register("applicationDate")} />

      <select {...register("status")}>
        {APPLICATION_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <textarea placeholder="Notes" rows={3} {...register("notes")} />

      <button disabled={isSubmitting} type="submit">
        Add Application
      </button>
    </form>
  );
}
