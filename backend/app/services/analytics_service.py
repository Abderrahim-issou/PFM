from sqlalchemy.orm import Session

from app.schemas.diagnostic import DiagnosticReport


def get_analytics_overview(
    db: Session,
    user_id: int,
):
    reports = (
        db.query(DiagnosticReport)
        .filter(DiagnosticReport.user_id == user_id)
        .all()
    )

    total_reports = len(reports)

    average_confidence = (
        sum(report.confidence for report in reports) / total_reports
        if total_reports > 0
        else 0
    )

    high_risk_count = sum(1 for report in reports if report.severity == "High")
    medium_risk_count = sum(1 for report in reports if report.severity == "Medium")
    low_risk_count = sum(1 for report in reports if report.severity == "Low")

    months = [
        ("Jan", 1),
        ("Feb", 2),
        ("Mar", 3),
        ("Apr", 4),
        ("May", 5),
        ("Jun", 6),
    ]

    monthly_stats = []

    for month_name, month_number in months:
        month_reports = [
            report for report in reports
            if report.created_at and report.created_at.month == month_number
        ]

        month_total = len(month_reports)

        healthy_count = sum(
            1
            for report in month_reports
            if "healthy" in report.disease.lower()
        )

        high_count = sum(
            1
            for report in month_reports
            if report.severity == "High"
        )

        healthy_score = (
            round((healthy_count / month_total) * 100)
            if month_total > 0
            else 0
        )

        outbreak_score = (
            round((high_count / month_total) * 100)
            if month_total > 0
            else 0
        )

        monthly_stats.append({
            "month": month_name,
            "healthy_score": healthy_score,
            "outbreak_score": outbreak_score,
        })

    return {
        "total_reports": total_reports,
        "average_confidence": round(average_confidence, 1),
        "high_risk_count": high_risk_count,
        "medium_risk_count": medium_risk_count,
        "low_risk_count": low_risk_count,
        "monthly_stats": monthly_stats,
    }