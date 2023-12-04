import { AuthData } from "../../auth/AuthWrapper"

export const Account = () => {

     const { user } = AuthData();

     return (
          <div className="page">
               <h2>Twoje konto</h2>
               <p>Username: {user.username}</p>
               <p>Imię: {user.firstName}</p>
               <p>Nazwisko: {user.lastName}</p>
               <p>Role: {user.role_id}</p>
          </div>
     )
}