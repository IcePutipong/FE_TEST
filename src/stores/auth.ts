import { defineStore } from "pinia";
import axios from "axios";
import type { AxiosInstance } from "axios";
import type { AdviserItem, StudentItem } from "@/type";

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null as string | null,
    student: null as StudentItem | null,
    advisor: null as AdviserItem | null,
  }),

  getters: {
    currentUserName(): string {
      console.log(this.student?.name);
      console.log(this.advisor?.name);
      return this.student?.name || this.advisor?.name || "";
    },
    isAdmin(): boolean {
      return this.advisor?.roles.includes("ROLE_ADMIN") || false;
    },
  },

  actions: {
    login(username: string, password: string) {
      return apiClient
        .post("/api/v1/auth/authenticate", {
          username: username,
          password: password,
        })
        .then((res) => {
          this.token = res.data.access_token;
          this.student = res.data.student;
          this.advisor = res.data.advisor;
          localStorage.setItem("access_token", this.token as string);
          localStorage.setItem("student", JSON.stringify(this.student));
          localStorage.setItem("advisor", JSON.stringify(this.advisor));
          axios.defaults.headers.common["Authorization"] =
            "Bearer" + this.token;
          return res;
        });
    },

    logout() {
      console.log("logout");
      this.token = null;
      this.student = null;
      this.advisor = null;
      localStorage.removeItem("advisor");
      localStorage.removeItem("student");
      localStorage.removeItem("access_token");
    },

    reloadStudent(token: string, student: StudentItem) {
      this.token = token;
      this.student = student;
    },
    reloadAdvisor(token: string, advisor: AdviserItem) {
      this.token = token;
      this.advisor = advisor;
    },

    registerStudent(
      username: string,
      password: string,
      name: string,
      surname: string
    ) {
      return apiClient
        .post("/api/v1/auth/registerStudent", {
          username,
          password,
          name,
          surname,
        })
        .then((res) => {
          this.token = res.data.access_token;
          console.log(res.data.user);
          this.student = {
            id: res.data.user.id,
            studentID: res.data.user.studentID,
            name: res.data.user.name,
            images: res.data.user.images,
            roles: res.data.user.roles,
          } as unknown as StudentItem;
          localStorage.setItem("access_token", this.token as string);
          localStorage.setItem("student", JSON.stringify(this.student));
          return res;
        });
    },

    registerAdvisor(
      advisorID: string,
      name: string,
      surname: string,
      username: string,
      password: string
    ) {
      return apiClient
        .post("/api/v1/auth/registerAdvisor", {
          advisorID,
          name,
          surname,
          username,
          password,
        })
        .then((res) => {
          this.token = res.data.access_token;
          console.log(res.data.user);
          this.advisor = {
            advisorID: res.data.user.advisorID,
            name: res.data.user.name,
            surname: res.data.user.surname,
            username: res.data.user.username,
            password: res.data.user.password,
            image: res.data.user.image,
            roles: res.data.user.roles,
          } as unknown as AdviserItem;
          localStorage.setItem("access_token", this.token as string);
          localStorage.setItem("advisor", JSON.stringify(this.advisor));
          return res;
        });
    },
  },
});
