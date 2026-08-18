// ─── Onboarding state & persistence service ───────────────────────────────────

export interface OnboardingAnswers {
  purpose: string;
  interests: string[];
  companions: string;
}

const DEFAULT_ANSWERS: OnboardingAnswers = {
  purpose: 'Vacation / Tourism',
  interests: ['Nature', 'Culture'],
  companions: 'Family',
};

// Global in-memory cache
let _cachedAnswers: OnboardingAnswers = { ...DEFAULT_ANSWERS };
let _hasCompletedOnboarding: boolean = false;

export const OnboardingStorage = {
  async saveAnswers(answers: Partial<OnboardingAnswers>): Promise<OnboardingAnswers> {
    _cachedAnswers = {
      ..._cachedAnswers,
      ...answers,
    };
    _hasCompletedOnboarding = true;
    return _cachedAnswers;
  },

  getAnswers(): OnboardingAnswers {
    return _cachedAnswers;
  },

  hasCompletedOnboarding(): boolean {
    return _hasCompletedOnboarding;
  },

  reset(): void {
    _cachedAnswers = { ...DEFAULT_ANSWERS };
    _hasCompletedOnboarding = false;
  },
};
