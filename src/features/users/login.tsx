import { useEffect, useState } from "react";
import { Form, useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import Button from "@/ui/Button";
import { useAuth } from "@/contexts/AuthContext";



export default function Login() {

  const navigate = useNavigate()

   type FormErrors = {
     email?: string;
     password?: string;
   };
   const { currentUser, error, status, signIn, dispatch } = useAuth();

   const [errors, setErrors] = useState<FormErrors>({
     email: "",
     password: "",
   });
   const [form, setForm] = useState({
     email: "",
     password: "",
   });
   async function handleSubmit() {
     const formErrors: FormErrors = {};

     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
     const passwordRegex =
       /^(?=.*?[A-Z)(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

     const validEmail = emailRegex.test(form.email);

     if (!form.email) formErrors.email = "E-mail não pode estar vazio";

     if (!form.password) formErrors.password = "Senha não pode estar vazio";

     if (!validEmail) formErrors.email = "Formato de email incorreto";

     setErrors(formErrors);
     console.log(Object.entries(formErrors).length === 0, formErrors);
     if (Object.entries(formErrors).length === 0) {
       console.log("click");
       try {
         await signIn(form.email, form.password);

          navigate("/");
  
       } catch (error) {
         console.error(error);
         throw error;
       }
     }
   }

   return (
     <Form className="sm:max-w-[440px] max-w-[1440px] h-screen my-0 mx-auto px-8 py-[120px] flex flex-col justify-center gap-4 ">
       {error.message && error.type != "SessionMissingError" && (
         <span className="border-[0.25px] border-red-500 text-red-800 bg-red-100 px-4 py-2 rounded-md text-center text-sm">
           {error?.message}
         </span>
       )}
       <div className="flex flex-col gap-2">
         <Input
           className={`${errors.email && "border-red-500"}`}
           value={form.email}
           onChange={(e) => setForm({ ...form, email: e.target.value })}
         />
         {errors.email && <span className="text-red-500">{errors.email}</span>}
       </div>
       <div className="flex flex-col gap-2">
         <Input
           className={`${errors.password && "border-red-500"}`}
           type="password"
           value={form.password}
           onChange={(e) => setForm({ ...form, password: e.target.value })}
         />

         {errors.password && (
           <span className="text-red-500 ml-2  whitespace-nowrap scroll-m-2.5">
             {errors.password}
           </span>
         )}
       </div>

       <Button
         onClick={handleSubmit}
         styles={"standard"}
         isLoading={status === "loading"}
         additionalStyles={"justify-center px-4 py-1.5"}>
         Entrar
       </Button>
     </Form>
   );
}

