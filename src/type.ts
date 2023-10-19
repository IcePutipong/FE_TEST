export interface StudentItem {
  id: number;
  name: string;
  surname: string;
  studentID: string;
  image: string;
  department: string;
  advisor: AdviserItem | string;
}

export interface AdviserItem {
  id: number;
  name: string;
  surname: string;
  position: string;
  image: string;
  department: string;
  studentList: StudentItem[];
  student: StudentItem | string;
}
