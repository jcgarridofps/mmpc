import { fetchReportResult } from '@/app/lib/data';

export default async function ReportResult(
  { report_id }: { report_id: string })
 {
  const report_result:JSON = await fetchReportResult(report_id);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div>
            <pre>
                <code>
                    {JSON.stringify({"report_result": report_result}, null, 2)}
                </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
