import GovernanceTeamPage from './GovernanceTeamPage';

export default function BoardMembers() {
  return (
    <GovernanceTeamPage
      group="board"
      pageKey="boardPage"
      seoTitle="Board Members"
      seoDescription="Meet the Board of Directors governing the Banjul International Convention Centre."
      defaultHero={{
        eyebrow: 'Governance',
        title: 'Board of Directors',
        description: 'The leadership guiding BICC\'s strategic direction and commitment to excellence.',
      }}
      defaultSection={{
        eyebrow: 'Board',
        title: 'Our Board Members',
        description: 'Distinguished leaders providing governance and strategic oversight for BICC.',
      }}
    />
  );
}
