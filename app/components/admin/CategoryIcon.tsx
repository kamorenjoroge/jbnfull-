import {
  Drill, Hammer, BrickWall, Axe, Flame, Ruler, Disc, Briefcase, Lightbulb, Sun,
  Wrench, Droplets, BatteryCharging, Plug, Zap, Cable, Paintbrush, PaintRoller, SprayCan,
  ShowerHead, HardHat, Shovel, Pickaxe, Scale, Gauge, Thermometer, Scissors, Cog,
  Car, Fan, Tv, Lock, Shield, Package,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Drill, Hammer, BrickWall, Axe, Flame, Ruler, Disc, Briefcase, Lightbulb, Sun,
  Wrench, Droplets, BatteryCharging, Plug, Zap, Cable, Paintbrush, PaintRoller, SprayCan,
  ShowerHead, HardHat, Shovel, Pickaxe, Scale, Gauge, Thermometer, Scissors, Cog,
  Car, Fan, Tv, Lock, Shield, Package,
};

// The names the admin icon picker shows
export const CATEGORY_ICONS = Object.keys(icons);

export default function CategoryIcon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const Icon = icons[name] ?? Wrench;
  return <Icon className={className} />;
}