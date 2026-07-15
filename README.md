# PointsBot Cards

Home Assistant Lovelace cards for the [PointsBot](https://github.com/kylerm42/ha-pointsbot) integration.

> **Status:** Phase 2 — work in progress. See the PointsBot integration repository for the backend.

## Cards

- **`pointsbot-person-card`** — Displays a person's total points, weekly points, task lists, and adjustment history. Supports one-click task completion and manual point adjustments.

## Installation

### HACS (Recommended)

1. Open HACS in Home Assistant.
2. Go to **Frontend** and click **+ Explore & Download Repositories**.
3. Search for **PointsBot Cards** and download it.
4. Add the resource to your Lovelace configuration (HACS usually handles this automatically).
5. Reload the browser.

### Manual

1. Download `pointsbot-cards.js` from the [latest release](https://github.com/kylerm42/ha-pointsbot-cards/releases).
2. Copy it to `config/www/community/ha-pointsbot-cards/pointsbot-cards.js`.
3. Add the following to your Lovelace resources:
   ```yaml
   url: /local/community/ha-pointsbot-cards/pointsbot-cards.js
   type: module
   ```
4. Reload the browser.

## Card Configuration

### `pointsbot-person-card`

```yaml
type: custom:pointsbot-person-card
entity: sensor.pointsbot_alice
```

| Option | Required | Description |
|--------|----------|-------------|
| `entity` | Yes | The `sensor.pointsbot_<slug>` entity for the person. |

## Development

```bash
pnpm install
pnpm run watch    # Rebuild on changes
pnpm run build    # One-time production build
pnpm run test     # Run unit tests
```

The `dist/` directory is mounted into the local HA development environment via the `ha-pointsbot` docker-compose setup (see Task 10 / Phase 2c).
