export interface Creator {
  member: boolean;
  name: string;
  gender: string;
  batch: string;
  uid: string;
  email: string;
  token: string;
  designation: string;
  photoUrl: string;
  passingYear: string;
}

export interface Particular {
  [key: string]: any; // "empty_list" in provided JSON, but usually contains food items. Allowing flexibility.
}

export interface DayMenu {
  particulars: any[]; // "empty_list" in provided JSON
}

// "MainMenu" from JSON
export interface MainMenu {
  creator: Creator;
  menu: DayMenu[];
}

export interface Payment {
  uid: string;
  amount: number;
  id: string;
  email: string;
  timeStamp: number;
  status: string;
  purpose: string;
  name: string;
}

export interface Poll {
  creater: Creator; // Note: Schema uses "creater"
  id: string;
  comp: any;
  question: string;
  date: string;
  options: string[];
  totalVotes: number;
  multiple: boolean;
  time: string;
  target: string;
}

export interface Review {
  foodtype: string;
  creater: Creator; // Note: Schema uses "creater"
  id: string;
  food: string;
  comp: any;
  review: string;
  dateTime: string;
  solved: boolean;
  day: string;
  rating: number;
  photos: any[];
}

// "Users" from JSON
export interface User {
  uid: string;
  gender: string;
  member: boolean;
  batch: string;
  passingYear: string;
  email: string;
  token: string;
  designation: string;
  photoUrl: string;
  name: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  type: 'Regular' | 'Emergency';
  timestamp: string;
}

// "MessLeaves" from JSON
export interface MessLeave {
  uid: string;
  userName: string;
  id: string;
  type: string;
  exceptionCase: boolean;
  timestamp: number;
  date: string;
  status: string;
  meal: string;
}

// "SpecialMeal" from JSON
export interface SpecialMeal {
  month: number;
  food: string;
  mealIndex: number;
  year: number;
  day: number;
  timestamp: number;
}

export interface AttendanceRecord {
  date: string;
  breakfast: number;
  lunch: number;
  dinner: number;
  guestCount: number;
}



export enum SidebarTab {
  Dashboard = 'Dashboard',
  Leaves = 'Leaves',
  MealPlanning = 'MealPlanning',
  Menu = 'Menu',
  Reviews = 'Reviews',
  Polls = 'Polls',
  Analytics = 'Analytics',
  Billing = 'Billing',
  Users = 'Users',
  Settings = 'Settings'
}
