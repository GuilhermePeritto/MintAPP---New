import { Activity, Calendar, MapPin, Moon, Share2, Sunrise, Target, UserPlus, Users, Zap } from 'lucide-react';
import React from 'react';

export interface Achievement {
  id: number;
  name: string;
  description: string;
  xpReward: number;
  icon: JSX.Element;
  progress?: number;
  maxProgress?: number;
  unlocked?: boolean;
}

export interface Level {
  level: number;
  xpRequired: number;
  title: string;
}

export const getAchievements = (t: (key: string) => string) => {
  
  return [
    { id: 1, name: t("first_blood"), description: t("first_blood_desc"), xpReward: 50, icon: React.createElement(Target, { className: "h-6 w-6 text-primary" }) },
    { id: 2, name: t("regular_player"), description: t("regular_player_desc"), xpReward: 100, icon: React.createElement(Calendar, { className:"h-6 w-6 text-primary"}) },
    { id: 3, name: t("facility_explorer"), description: t("facility_explorer_desc"), xpReward: 150, icon: React.createElement(MapPin, { className:"h-6 w-6 text-primary"}) },
    { id: 4, name: t("social_butterfly"), description: t("social_butterfly_desc"), xpReward: 100, icon: React.createElement(Users, { className:"h-6 w-6 text-primary"}) },
    { id: 5, name: t("influencer"), description: t("influencer_desc"), xpReward: 50, icon: React.createElement(Share2, { className:"h-6 w-6 text-primary"}) },
    { id: 6, name: t("early_bird"), description: t("early_bird_desc"), xpReward: 75, icon: React.createElement(Sunrise, { className:"h-6 w-6 text-primary"}) },
    { id: 7, name: t("night_owl"), description: t("night_owl_desc"), xpReward: 75, icon: React.createElement(Moon, { className:"h-6 w-6 text-primary"}) },
    { id: 8, name: t("streak_master"), description: t("streak_master_desc"), xpReward: 200, icon: React.createElement(Zap, { className:"h-6 w-6 text-primary"}) },
    { id: 9, name: t("diverse_athlete"), description: t("diverse_athlete_desc"), xpReward: 125, icon: React.createElement(Activity, { className:"h-6 w-6 text-primary"}) },
    { id: 10, name: t("referral_king"), description: t("referral_king_desc"), xpReward: 150, icon: React.createElement(UserPlus, { className:"h-6 w-6 text-primary"}) },
  ];
};

export const levels: Level[] = [
  { level: 1, xpRequired: 0, title: "Rookie" },
  { level: 2, xpRequired: 100, title: "Amateur" },
  { level: 3, xpRequired: 250, title: "Enthusiast" },
  { level: 4, xpRequired: 500, title: "Pro" },
  { level: 5, xpRequired: 1000, title: "Veteran" },
  { level: 6, xpRequired: 2000, title: "Master" },
  { level: 7, xpRequired: 3500, title: "Legend" },
  { level: 8, xpRequired: 5500, title: "Mythic" },
  { level: 9, xpRequired: 8000, title: "Demigod" },
  { level: 10, xpRequired: 11000, title: "Olympian" },
];

export function calculateLevel(xp: number): Level {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].xpRequired) {
      return levels[i];
    }
  }
  return levels[0];
}

export function calculateXpToNextLevel(xp: number): number {
  const currentLevel = calculateLevel(xp);
  const nextLevel = levels[currentLevel.level];
  return nextLevel ? nextLevel.xpRequired - xp : 0;
}

export function awardXp(currentXp: number, xpToAdd: number): number {
  return currentXp + xpToAdd;
}

export function getAchievementXp(achievementId: number, t: (key: string) => string): number {
  const achievements = getAchievements(t);
  const achievement = achievements.find(a => a.id === achievementId);
  return achievement ? achievement.xpReward : 0;
}

export function getXpForAction(action: string): number {
  const xpRewards: { [key: string]: number } = {
    'add_friend': 10,
    'share_achievement': 15,
    'link_social_account': 20,
    'complete_profile': 30,
    'daily_login': 5,
  };
  return xpRewards[action] || 0;
}

