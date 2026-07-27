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
  icon?: string;
}

export interface CardConfig {
  type: "custom:pointsbot-person-card";
  entity: string; // sensor.pointsbot_<slug>
  accent_color?: string; // #RRGGBB hex color, defaults to "#B29FE8"
  /**
   * When true, the outer `ha-card` is rendered with no background,
   * padding, box-shadow, or border so the card blends into the dashboard
   * (matches ChoreBot's `person-points-card` "no background" look).
   * Defaults to `false`, which leaves the standard HA card chrome in place.
   */
  hide_card_background?: boolean;
}
