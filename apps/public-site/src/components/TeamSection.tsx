import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import SectionHeader from './ui/SectionHeader';
import ScrollReveal from './motion/ScrollReveal';

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
}

const DEFAULTS = {
  board: {
    eyebrow: 'Governance',
    title: 'Board of Directors',
    description: 'The leadership guiding BICC\'s strategic direction and commitment to excellence.',
  },
  team: {
    eyebrow: 'Our People',
    title: 'Team at BICC',
    description: 'The dedicated professionals delivering world-class events and experiences every day.',
  },
};

function resolveMemberImage(member: TeamMember & Record<string, any>) {
  return member?.image || member?.imageUrl || member?.photo || member?.photoUrl || member?.avatar || '';
}

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const image = resolveMemberImage(member as TeamMember & Record<string, any>);

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

export default function TeamSection({ group, eyebrow, title, description, className = '' }: TeamSectionProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const snap = await getDocs(collection(db, 'teamMembers'));
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as TeamMember[];
        const filtered = data
          .filter((m) => m.group === group && m.published !== false)
          .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        setMembers(filtered);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [group]);

  const defaults = DEFAULTS[group];
  const bgClass = group === 'board' ? 'bg-gray-50' : 'bg-white';

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
        {members.length === 0 ? (
          <div className="text-center py-12 px-6 bg-white/60 rounded-2xl border border-dashed border-gray-200 max-w-xl mx-auto">
            <p className="text-gray-500 text-sm">
              {group === 'board'
                ? 'Our board of directors will be listed here shortly.'
                : 'Our team members will be listed here shortly.'}
            </p>
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
