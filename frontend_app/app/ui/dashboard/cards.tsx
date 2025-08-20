import {
  DocumentTextIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentMagnifyingGlassIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';

const iconMap = {
  patients: UserGroupIcon,
  analysis: DocumentMagnifyingGlassIcon,
  drug_queries: ClipboardDocumentListIcon,
  pending_analysis: ClockIcon,
  reports: DocumentTextIcon,
};

export default async function CardWrapper() {

  const {
    numberOfVariantAnalysis,
    numberOfDrugQueries,
    numberOfPatients,
    totalReports,
    totalPendingAnalysis,
  } = await fetchCardData();

  return (
    <>

      <Card title="Total Reports" value={totalReports} type="reports" />
      <Card title="Pending Analysis" value={totalPendingAnalysis} type="pending_analysis" />
      <Card title="Total Variant Analysis" value={numberOfVariantAnalysis} type="analysis" />
      <Card title="Total Drug Queries" value={numberOfDrugQueries} type="drug_queries" />
{/*       <Card
        title="Total Patients"
        value={numberOfPatients}
        type="patients"
      /> */}
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'patients' | 'analysis' | 'pending_analysis' | 'reports' | 'drug_queries';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
