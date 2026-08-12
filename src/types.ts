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
  rewards: Reward[];
}

export interface Reward {
  id: string;
  person_id: string;
  name: string;
  cost: number;
  icon: string;
  enabled: boolean;
  description?: string;
  created: string;
  modified: string;
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
  /**
   * Optional entity whose `state` is rendered (no label) on the left side
   * of the second header row — the position the Total occupied before it
   * moved to the right. When unset, missing, or `unavailable`/`unknown`,
   * nothing is rendered in that slot.
   */
  secondary_value_entity?: string;
}

export interface RewardsCardConfig {
  type: "custom:pointsbot-person-rewards-card";
  person: string;
  hide_card_background?: boolean;
  show_disabled_rewards?: boolean;
  sort_by?: "cost" | "name" | "created";
  show_add_reward_button?: boolean;
  accent_color?: string;
}
