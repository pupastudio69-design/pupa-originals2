import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Film, Star, MessageSquare, Gift, ChevronRight, 
  Crown, Zap, Heart, ArrowRight
} from 'lucide-react';

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'Welcome to Pupa',
    description: 'The home of Nollywood entertainment. Watch movies, discover new content, and join the community.',
    icon: Film,
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: 2,
    title: 'Discover Movies',
    description: 'Browse trending movies, new releases, and exclusive Pupa Originals. Something for every mood.',
    icon: Star,
    color: 'from-emerald-400 to-teal-500'
  },
  {
    id: 3,
    title: 'Join the Community',
    description: 'Rate movies, write reviews, and discuss with other fans. Your opinion matters.',
    icon: MessageSquare,
    color: 'from-blue-400 to-indigo-500'
  },
  {
    id: 4,
    title: 'Earn Rewards',
    description: 'Watch movies, invite friends, and collect points. Redeem for discounts and exclusive access.',
    icon: Gift,
    color: 'from-purple-400 to-pink-500'
  },
  {
    id: 5,
    title: 'Go Premium',
    description: 'Unlock 4K streaming, unlimited downloads, and ad-free experience. Start with a free trial.',
    icon: Crown,
    color: 'from-yellow-400 to-yellow-600'
  }
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const step = ONBOARDING_STEPS[currentStep];
  const isLast = currentStep === ONBOARDING_STEPS.length - 1;

  const next = () => {
    if (isLast) {
      localStorage.setItem('pupa_onboarding_complete', 'true');
      setCompleted(true);
      setTimeout(() => navigate('/welcome'), 500);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const skip = () => {
    localStorage.setItem('pupa_onboarding_complete', 'true');
    navigate('/welcome');
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <Zap size={40} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">You're All Set!</h2>
          <p className="text-gray-400 text-sm">Taking you to subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col">
      {/* Skip button */}
      <div className="flex justify-end p-4">
        <button onClick={skip} className="text-gray-400 text-sm hover:text-white">
          Skip
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-8">
        {ONBOARDING_STEPS.map((_, i) => (
          <div 
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === currentStep ? 'w-8 bg-yellow-400' : 
              i < currentStep ? 'w-4 bg-emerald-400' : 'w-4 bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mb-6`}>
          <step.icon size={40} className="text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">{step.title}</h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
          {step.description}
        </p>
      </div>

      {/* Bottom action */}
      <div className="p-6">
        <button
          onClick={next}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-lg hover:from-yellow-300 hover:to-yellow-400 transition-all flex items-center justify-center gap-2"
        >
          {isLast ? 'Get Started' : 'Next'}
          <ArrowRight size={20} />
        </button>
        
        <p className="text-center text-gray-600 text-xs mt-4">
          Step {currentStep + 1} of {ONBOARDING_STEPS.length}
        </p>
      </div>
    </div>
  );
}