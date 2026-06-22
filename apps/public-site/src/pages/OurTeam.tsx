import GovernanceTeamPage from './GovernanceTeamPage';

export default function OurTeam() {
  return (
    <GovernanceTeamPage
      group="team"
      pageKey="teamPage"
      seoTitle="Our Team"
      seoDescription="Meet the management and staff team at the Banjul International Convention Centre."
      defaultHero={{
        eyebrow: 'Our People',
        title: 'Management Team',
        description: 'The dedicated professionals delivering world-class events and experiences every day.',
      }}
      defaultSection={{
        eyebrow: 'Management',
        title: 'Our Team',
        description: 'Experienced professionals committed to operational excellence at BICC.',
      }}
    />
  );
}
