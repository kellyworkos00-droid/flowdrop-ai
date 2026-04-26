import { Avatar } from "@/components/ui/avatar";
import { mockWorkspace } from "@/lib/mocks/workspace";

export default function TeamPage() {
  return (
    <section>
      <h2 className="mb-4 font-[var(--font-display)] text-[22px] font-semibold">Team Flow</h2>
      <div className="grid gap-3 lg:grid-cols-2">
        {mockWorkspace.members.map((member) => (
          <article key={member.id} className="flow-card rounded-[var(--radius-lg)] border border-white/10 bg-[var(--color-surface-1)] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Avatar name={member.name} size="md" />
              <div>
                <p>{member.name}</p>
                <p className="text-[13px] text-[var(--color-text-secondary)]">{member.role}</p>
              </div>
            </div>
            <p className="text-[13px] text-[var(--color-text-secondary)]">Currently focused on: {member.lastDropTitle}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
