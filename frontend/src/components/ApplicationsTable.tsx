import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { api } from "../lib/api";
import type { Application, ApplicationStatus } from "../lib/api"; // ⬅️ add this line (type-only)



export default function ApplicationsTable() {
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["applications"],
    queryFn: async (): Promise<Application[]> => {
      const res = await api.get("/api/applications");
      return res.data;
    }
  });

  const mutateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ApplicationStatus }) =>
      api.put(`/api/applications/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["applications"] })
  });

  const mutateDelete = useMutation({
    mutationFn: async (id: string) => api.delete(`/api/applications/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["applications"] })
  });

  if (isLoading) return <p>Loading list...</p>;
  if (error) return <p style={{color:'red'}}>Loading failed</p>;
  if (!data?.length) return <p>There is no data yet, please add one to the form above.</p>;

  return (
    <table border={1} cellPadding={6} style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th>Company</th>
          <th>Position</th>
          <th>Link</th>
          <th>Date</th>
          <th>Status</th>
          <th>Notes</th>
          <th>Operations</th>
        </tr>
      </thead>
      <tbody>
        {data.map(a => (
          <tr key={a.id}>
            <td>{a.companyName}</td>
            <td>{a.positionTitle}</td>
            <td>
              {a.jobUrl ? <a href={a.jobUrl} target="_blank">{new URL(a.jobUrl).hostname}</a> : "-"}
            </td>
            <td>{a.applicationDate ? dayjs(a.applicationDate).format("YYYY-MM-DD") : "-"}</td>
            <td>
              <select
                value={a.status}
                onChange={(e) => mutateStatus.mutate({ id: a.id, status: e.target.value as ApplicationStatus })}
              >
                {["APPLIED","INTERVIEW_SCHEDULED","INTERVIEWED","OFFER_RECEIVED","REJECTED","WITHDRAWN","ACCEPTED"]
                  .map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </td>
            <td>{a.notes || "-"}</td>
            <td>
              <button onClick={() => mutateDelete.mutate(a.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
