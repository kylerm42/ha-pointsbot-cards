/**
 * Shared TypeScript interfaces mirroring the PointsBot sensor entity
 * attribute contract (custom_components/pointsbot/sensor.py).
 *
 * total_points is read from entity.state (not attributes) because the
 * backend sets native_value = total_points.
 */

export interface BaseTask {
  id: string;
  name: string;
  done: boolean;
}

export interface BonusTask {
  id: string;
  name: string;
  points_value: number;
  enabled: boolean;
  completions_this_week: number;
}

export interface WeeklyAdjustment {
  id: string;
  amount: number;
  reason: string;
  timestamp: string; // ISO 8601
}

export interface PointsBotEntityAttributes {
  weekly_points: number;
  weekly_allotment: number;
  base_tasks: BaseTask[];
  bonus_tasks: BonusTask[];
  weekly_adjustments: WeeklyAdjustment[];
  person_id: string;
  name: string | null;
  picture: string | null;
}

export interface CardConfig {
  type: "custom:pointsbot-person-card";
  entity: string; // sensor.pointsbot_<slug>
}
