import { AutonomousTradeService } from "./autonomousTradeService";
import { CronJob } from "cron";

export class SchedulerService {
  private autonomousTradeService: AutonomousTradeService;
  private tradingJob: CronJob;

  constructor() {
    this.autonomousTradeService = new AutonomousTradeService();

    // Run every 3 minutes
    this.tradingJob = new CronJob("*/3 * * * *", async () => {
      console.log("Starting autonomous trading cycle...");
      await this.autonomousTradeService.startAutonomousTrading();
    });
  }

  startScheduler() {
    this.tradingJob.start();
    console.log("Autonomous trading scheduler started");
  }

  stopScheduler() {
    this.tradingJob.stop();
    console.log("Autonomous trading scheduler stopped");
  }
}
