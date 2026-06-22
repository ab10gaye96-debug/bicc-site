import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import SectionHeader from './ui/SectionHeader';
import ScrollReveal from './motion/ScrollReveal';
import { FALLBACK_BOARD_MEMBERS, FALLBACK_TEAM_MEMBERS } from '../data/teamDefaults';

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio?: string;
  image?: string;
  group: 'board' | 'team';
  order?: number;
  published?: boolean;
}

interface TeamSectionProps {
  group: 'board' | 'team';
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
  variant?: 'default' | 'governance';
  useFallbackMembers?: boolean;
}

const DEFAULTS = {
  board: {
    eyebrow: 'Governance',
    title: 'Board of Directors',
    description: 'The leadership guiding BICC\'s strategic direction and commitment to excellence.',
  },
  team: {
    eyebrow: 'Our People',
    title: 'Management Team',
    description: 'The dedicated professionals delivering world-class events and experiences every day.',
  },
};

function resolveMemberImage(member: TeamMember & Record<string, unknown>) {
  return (member?.image || member?.imageUrl || member?.photo || member?.photoUrl || member?.avatar || '') as string;
}

function GovernanceCard({ member, index }: { member: TeamMember; index: number }) {
  const image = resolveMemberImage(member as TeamMember & Record<string, unknown>);

  return (
    <ScrollReveal delay={index * 50} animation="fade-up">
      <article className="group flex gap-4 sm:gap-5 p-5 sm:p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-bicc-primary/20 transition-all duration-300 h-full">
        <div className="shrink-0">
          {image ? (
            <img
              src={image}
              alt={member.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover object-top ring-2 ring-slate-100 group-hover:ring-bicc-primary/30 transition-all"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-bicc-primary to-[#1a6d8a] flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-inner">
              {member.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-semibold text-slate-900 text-base sm:text-lg leading-snug">{member.name}</h3>
          <p className="text-bicc-primary font-medium text-sm mt-1 leading-relaxed">{member.title}</p>
          {member.bio && (
            <p className="text-slate-500 text-sm mt-2 leading-relaxed line-clamp-3">{member.bio}</p>
          )}
        </div>
      </article>
    </ScrollReveal>
  );
}

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const image = resolveMemberImage(member as TeamMember & Record<string, unknown>);

  return (
    <ScrollReveal delay={index * 80} animation="fade-up">
      <div className="group text-center">
        <div className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48 mb-5">
          {image ? (
            <img
              src={image}
              alt={member.name}
              className="w-full h-full rounded-2xl object-cover object-top shadow-lg ring-4 ring-white group-hover:ring-bicc-gold/40 transition-all duration-300"
            />
          ) : (
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-bicc-primary to-[#1a6d8a] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {member.name.charAt(0)}
            </div>
          )}
        </div>
        <h3 className="font-display font-semibold text-slate-900 text-lg">{member.name}</h3>
        <p className="text-bicc-primary font-medium text-sm mt-1">{member.title}</p>
        {member.bio && (
          <p className="text-slate-500 text-sm mt-3 leading-relaxed max-w-xs mx-auto">{member.bio}</p>
        )}
      </div>
    </ScrollReveal>
  );
}

export default function TeamSection({
  group,
  eyebrow,
  title,
  description,
  className = '',
  variant = 'default',
  useFallbackMembers = false,
}: TeamSectionProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const snap = await getDocs(collection(db, 'teamMembers'));
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as TeamMember[];
        const filtered = data
          .filter((m) => m.group === group && m.published !== false)
          .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

        if (filtered.length > 0) {
          setMembers(filtered);
          setUsingFallback(false);
        } else if (useFallbackMembers) {
          const fallback = (group === 'board' ? FALLBACK_BOARD_MEMBERS : FALLBACK_TEAM_MEMBERS).map((m, i) => ({
            ...m,
            id: `fallback-${i}`,
          }));
          setMembers(fallback);
          setUsingFallback(true);
        } else {
          setMembers([]);
          setUsingFallback(false);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
        if (useFallbackMembers) {
          const fallback = (group === 'board' ? FALLBACK_BOARD_MEMBERS : FALLBACK_TEAM_MEMBERS).map((m, i) => ({
            ...m,
            id: `fallback-${i}`,
          }));
          setMembers(fallback);
          setUsingFallback(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [group, useFallbackMembers]);

  const defaults = DEFAULTS[group];
  const bgClass = group === 'board' ? 'bg-gray-50' : 'bg-white';
  const isGovernance = variant === 'governance';

  if (loading) {
    return (
      <section className={`py-20 ${bgClass} ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse text-center">
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-4" />
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-20 sm:py-28 ${bgClass} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={eyebrow || defaults.eyebrow}
          title={title || defaults.title}
          description={description || defaults.description}
        />

        {usingFallback && (
          <p className="text-center text-xs text-slate-400 -mt-8 mb-10">
            Showing default roster — add photos and members in Admin → Team & Board.
          </p>
        )}

        {members.length === 0 ? (
          <div className="text-center py-12 px-6 bg-white/60 rounded-2xl border border-dashed border-gray-200 max-w-xl mx-auto">
            <p className="text-gray-500 text-sm">
              {group === 'board'
                ? 'Board members will appear here once added in the admin portal.'
                : 'Team members will appear here once added in the admin portal.'}
            </p>
          </div>
        ) : isGovernance ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {members.map((member, i) => (
              <GovernanceCard key={member.id} member={member} index={i} />
            ))}
          </div>
        ) : (
          <div className={`grid gap-10 sm:gap-12 ${
            members.length <= 2
              ? 'sm:grid-cols-2 max-w-2xl mx-auto'
              : members.length === 3
                ? 'sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto'
                : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {members.map((member, i) => (
              <MemberCard key={member.id} member={member} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
