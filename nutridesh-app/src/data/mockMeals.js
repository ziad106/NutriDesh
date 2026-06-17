// Pre-populated meal history for demo
import { FOODS_BD } from './foodsBD';

function findId(id) {
  return FOODS_BD.find((f) => f.id === id);
}

const today = new Date();
const todayMs = today.getTime();
const dayMs = 24 * 60 * 60 * 1000;

export const MOCK_MEALS = [
  // Today
  {
    id: 'm001',
    foodId: 'f003',
    food: findId('f003'),
    foodName: 'রুটি + ডিম',
    mealType: 'breakfast',
    portion_g: 150,
    logged_at: todayMs - 8 * 60 * 60 * 1000,
    scan_method: 'camera',
  },
  {
    id: 'm002',
    foodId: 'f032',
    food: findId('f032'),
    foodName: 'ডিম',
    mealType: 'breakfast',
    portion_g: 50,
    logged_at: todayMs - 8 * 60 * 60 * 1000,
    scan_method: 'camera',
  },
  {
    id: 'm003',
    foodId: 'f001',
    food: findId('f001'),
    foodName: 'ভাত',
    mealType: 'lunch',
    portion_g: 200,
    logged_at: todayMs - 3 * 60 * 60 * 1000,
    scan_method: 'camera',
  },
  {
    id: 'm004',
    foodId: 'f010',
    food: findId('f010'),
    foodName: 'মসুর ডাল',
    mealType: 'lunch',
    portion_g: 100,
    logged_at: todayMs - 3 * 60 * 60 * 1000,
    scan_method: 'camera',
  },
  {
    id: 'm005',
    foodId: 'f021',
    food: findId('f021'),
    foodName: 'রুই মাছ',
    mealType: 'lunch',
    portion_g: 120,
    logged_at: todayMs - 3 * 60 * 60 * 1000,
    scan_method: 'camera',
  },
  // Yesterday
  {
    id: 'm010',
    foodId: 'f090',
    food: findId('f090'),
    foodName: 'বিরিয়ানি',
    mealType: 'lunch',
    portion_g: 250,
    logged_at: todayMs - dayMs - 4 * 60 * 60 * 1000,
    scan_method: 'camera',
  },
  {
    id: 'm011',
    foodId: 'f001',
    food: findId('f001'),
    foodName: 'ভাত',
    mealType: 'dinner',
    portion_g: 180,
    logged_at: todayMs - dayMs - 1 * 60 * 60 * 1000,
    scan_method: 'manual',
  },
  // 2 days ago
  {
    id: 'm020',
    foodId: 'f003',
    food: findId('f003'),
    foodName: 'রুটি',
    mealType: 'breakfast',
    portion_g: 100,
    logged_at: todayMs - 2 * dayMs - 7 * 60 * 60 * 1000,
    scan_method: 'manual',
  },
];

export default MOCK_MEALS;
