import { useParams } from "react-router-dom";
import DetectedRegionsPlayground from "../components/Diagnostic_component";
import { getDiagnosticReportById } from "../api/api";
import useAuth from "../hooks/useAuth";

import { useEffect, useState } from "react";

const PlayGroundCheck = () => {
  const { reportId } = useParams();
  const { access_token } = useAuth();

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (!access_token || !reportId) return;

        const response = await getDiagnosticReportById(
          Number(reportId),
          access_token
        );

        if (response.status === 200) {
          setReport(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [access_token, reportId]);

  if (loading) {
    return <div>Loading report...</div>;
  }

  if (!report) {
    return <div>Report not found</div>;
  }

  return (
    <DetectedRegionsPlayground
      report={report}
    />
  );
};

export default PlayGroundCheck;