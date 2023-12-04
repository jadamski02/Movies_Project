import { Account } from "../pages/Account"
import { Login } from "../pages/Login"
import { SignUp } from "../pages/SignUp"
import { AdminPanel } from "../pages/AdminPanel"
import { AllMovies } from "../pages/AllMovies"

export const nav = [
     { path:     "/",            name: "Strona główna",  element: <AllMovies />,        isMenu: true,   isPrivate: false,  adminOnly: false  },
     { path:     "/login",       name: "Login",          element: <Login />,       isMenu: false,  isPrivate: false,  adminOnly: false  },
     { path:     "/rejestracja", name: "Rejestracja",    element: <SignUp />,      isMenu: false,  isPrivate: false,  adminOnly: false  },
     { path:     "/account",     name: "Konto",          element: <Account />,     isMenu: true,   isPrivate: true,   adminOnly: false  },
     { path:     "/adminpanel",  name: "Administator",   element: <AdminPanel />,  isMenu: true,   isPrivate: true,   adminOnly: true  },
]