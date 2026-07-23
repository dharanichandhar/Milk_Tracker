from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

scheduler = AsyncIOScheduler()


def setup_scheduler():
    from app.scheduler.jobs import daily_records, payment_reminders, session_cleanup

    scheduler.add_job(
        daily_records.generate_daily_milk_records,
        CronTrigger(hour=0, minute=5),
        id="daily_milk_records",
        replace_existing=True,
    )

    scheduler.add_job(
        payment_reminders.send_payment_reminders,
        CronTrigger(hour=9, minute=0),
        id="payment_reminders",
        replace_existing=True,
    )

    scheduler.add_job(
        session_cleanup.cleanup_expired_sessions,
        CronTrigger(hour=3, minute=0),
        id="session_cleanup",
        replace_existing=True,
    )

    scheduler.start()
