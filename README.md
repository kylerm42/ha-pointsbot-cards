# PointsBot Cards

Home Assistant Lovelace cards for the [PointsBot](https://github.com/kylerm42/ha-pointsbot) integration.

## Cards

- **`pointsbot-person-card`** — Displays a family member's total points, weekly points, task lists, and this week's point adjustments. Supports one-click base-task toggling, bonus-task completion, and a manual point adjustment dialog.
- **`pointsbot-person-rewards-card`** — Binds to one configured PointsBot person, lists that person's rewards, and supports reward creation, editing, deletion, and redemption. Rewards spend banked `total_points` only; current-week points become spendable after rollover.

---

### `pointsbot-person-rewards-card`

```yaml
type: custom:pointsbot-person-rewards-card
person: person.alice
show_disabled_rewards: false
sort_by: cost
show_add_reward_button: true
accent_color: "#B29FE8"
```

`person` is required and binds the card to that profile; there is no runtime
person selector or fallback. `sort_by` accepts `cost`, `name`, or `created`. The card displays the
banked balance, cost, remaining balance, and disabled/insufficient states before
redemption. It calls only `pointsbot.manage_reward`, `pointsbot.redeem_reward`,
and `pointsbot.delete_reward` for reward operations. Management controls are
available to every dashboard viewer who can use the card, matching the backend's
dashboard-access trust boundary.

---

## Installation

### HACS (Recommended)

1. Open HACS in Home Assistant.
2. Go to **Frontend** and click **+ Explore & Download Repositories**.
3. Search for **PointsBot Cards** and click **Download**.
4. HACS automatically registers the resource. If it does not, add it manually (see the Manual section below for the resource URL format).
5. Hard-refresh your browser (Ctrl+Shift+R / Cmd+Shift+R).

### Manual

1. Download `pointsbot-cards.js` from the [latest release](https://github.com/kylerm42/ha-pointsbot-cards/releases).
2. Copy it to `<HA config>/www/community/pointsbot-cards/pointsbot-cards.js`.
3. In Home Assistant go to **Settings → Dashboards → Resources** and add:

   ```yaml
   url: /local/community/pointsbot-cards/pointsbot-cards.js
   type: module
   ```

4. Hard-refresh your browser.

---

## Card Configuration

### `pointsbot-person-card`

**Visual editor:** The card ships a built-in visual editor. When you add the card from the **Add Card** GUI, the editor opens automatically and presents an entity picker filtered to the `sensor` domain so only `sensor.pointsbot_*` entities are shown. Select the entity for the person you want to display and save — no YAML editing required for basic setup.

**YAML configuration:**

```yaml
type: custom:pointsbot-person-card
entity: sensor.pointsbot_alice
```

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `entity` | string | **Yes** | The `sensor.pointsbot_<slug>` entity for the person (e.g. `sensor.pointsbot_alice`). Must be a sensor entity created by the PointsBot integration. |

> **Screenshot:** *(placeholder — screenshot to be added after first live deployment)*

**Card behavior:**

- Displays the person's **name** and **picture** (resolved live from the `person.*` entity by the backend — always current).
- Shows **Total Points** (lifetime, excluding current week) and **This Week** (current week's balance) as distinct values.
- An **Adjust Points** button opens a dialog to enter a signed amount (positive to award, negative to deduct) and a required reason. The reason is logged permanently in the PointsBot audit history.
- Three collapsible sections (all default to collapsed):
  - **Base Tasks** — checkbox per task; toggling calls `pointsbot.toggle_base_task`. Base tasks are informational only; checking them awards no points.
  - **Bonus Tasks** — each task shows its name, point value, and how many times it has been completed this week. The **Complete** button calls `pointsbot.complete_bonus_task` and awards the task's point value immediately. Disabled tasks (`enabled: false`) are visually dimmed and their **Complete** button is withheld.
  - **Adjustments** — read-only list of manual point adjustments made this week, showing amount, reason, and timestamp.
- The card updates automatically whenever Home Assistant sends a new state for the entity — no manual refresh needed.

**Entity-picker filtering note:** The visual config editor uses `ha-entity-picker` filtered to the `sensor` domain (`includeDomains: ["sensor"]`). This narrows the picker to sensor entities and makes it easier to find the correct `sensor.pointsbot_*` entity, but does not prevent selecting an unrelated sensor. The card will display an error state if the selected entity is not a valid PointsBot sensor.

---

## Requirements

- Home Assistant with the [PointsBot integration](https://github.com/kylerm42/ha-pointsbot) installed and at least one `sensor.pointsbot_*` entity created.
- Home Assistant 2024.1 or later (Lovelace custom cards, `ha-dialog`, standard web component support).

---

## Development

```bash
pnpm install
pnpm run watch    # Rebuild on changes (used by ha-pointsbot's card-builder service)
pnpm run build    # One-time production build
   pnpm run test     # Run unit tests (current count reported by Vitest, Vitest + happy-dom)
```

The `dist/` directory is gitignored. In the local development environment it is produced by the `card-builder` Docker service defined in `ha-pointsbot`'s `docker-compose.yml`, which mounts this repo and runs `pnpm run watch` (using pnpm via corepack). The output is then mounted into the HA container's `www/community/pointsbot-cards/` path, mimicking the HACS install path.

See [ha-pointsbot](https://github.com/kylerm42/ha-pointsbot) for the backend integration and full dev-environment setup instructions.
