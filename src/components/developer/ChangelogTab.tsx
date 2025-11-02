import { APIChangelog } from './APIChangelog';

export function ChangelogTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">API Changelog</h2>
        <p className="text-muted-foreground">
          Track all API changes, deprecations, and new features. Stay up-to-date with the latest updates.
        </p>
      </div>

      <APIChangelog />
    </div>
  );
}